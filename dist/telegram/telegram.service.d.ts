import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { AiService } from '../ai/ai.service';
export declare class TelegramService {
    private messageModel;
    private readonly aiService;
    private readonly logger;
    private readonly TELEGRAM_API_URL;
    constructor(messageModel: Model<Message>, aiService: AiService);
    handleUpdate(update: any): Promise<void>;
    handleCron(): Promise<void>;
    sendPendingResponses(): Promise<number>;
    private sendTelegramMessage;
}
