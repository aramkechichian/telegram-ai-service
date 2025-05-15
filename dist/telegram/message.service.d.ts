import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
export declare class MessageService {
    private messageModel;
    constructor(messageModel: Model<Message>);
    createUserMessage(chatId: string, userMessage: string): Promise<Message>;
    updateAiResponse(messageId: string, aiResponse: string): Promise<void>;
}
