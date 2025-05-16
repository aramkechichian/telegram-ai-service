import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { AiService } from '../ai/ai.service';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly aiService: AiService,
  ) {}

  async handleUpdate(update: any) {
    const message = update.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id.toString();
    const userMessage = message.text;

    this.logger.log(`Received message: ${userMessage}`);

    const aiText = "Aramik Bot Said: " + await this.aiService.generateResponse(userMessage);
    
    const msg = new this.messageModel({
      chatId,
      userMessage,
      aiResponse: {
        text: aiText,
        createdAt: new Date(),
      },
      status: 'pending',
      createdAt: new Date(),
    });

    await msg.save();

    this.logger.log(`Message with AI response saved.`);
  }

  @Cron('*/5 * * * * *')
  async handleCron() {
    const sentCount = await this.sendPendingResponses();
    if (sentCount > 0) {
      this.logger.log(`Sent ${sentCount} pending messages`);
    }
  }

  async sendPendingResponses(): Promise<number> {
    const pendingWithResponse = await this.messageModel.find({
      status: 'pending',
      'aiResponse.text': { $exists: true, $ne: '' },
    });

    for (const message of pendingWithResponse) {
      try {
        await this.sendTelegramMessage(message.chatId, message.aiResponse.text);

        message.status = 'responded';
        await message.save();

        this.logger.log(`Sent response to ${message.chatId}`);
      } catch (error) {
        this.logger.error(`Failed to send message to ${message.chatId}`, error);
      }
    }

    return pendingWithResponse.length;
  }

  private async sendTelegramMessage(chatId: string, text: string) {
    try {
      await axios.post(`${this.TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text,
      });
    } catch (error) {
      this.logger.error(`Telegram send failed for chatId ${chatId}`, error);
    }
  }
}
