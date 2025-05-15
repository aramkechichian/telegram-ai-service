import { Document } from 'mongoose';
export declare class AiResponse {
    text: string;
    createdAt: Date;
}
export declare class Message extends Document {
    chatId: string;
    userMessage: string;
    aiResponse: AiResponse;
    status: 'pending' | 'responded';
    createdAt: Date;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any> & Message & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}> & import("mongoose").FlatRecord<Message> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
