import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('webhook')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async receiveUpdate(@Body() update: any) {
    this.logger.log('Update received');
    await this.telegramService.handleUpdate(update);
    return { ok: true };
  }

  @Post('send-pending')
  async sendPendingMessages() {
    const sentCount = await this.telegramService.sendPendingResponses();
    return { sent: sentCount };
  }
}