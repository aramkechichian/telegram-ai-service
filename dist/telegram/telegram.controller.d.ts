import { TelegramService } from './telegram.service';
export declare class TelegramController {
    private readonly telegramService;
    private readonly logger;
    constructor(telegramService: TelegramService);
    receiveUpdate(update: any): Promise<{
        ok: boolean;
    }>;
    sendPendingMessages(): Promise<{
        sent: number;
    }>;
}
