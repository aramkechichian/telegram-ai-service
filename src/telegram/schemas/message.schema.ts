import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AiResponse {
  @Prop()
  text!: string;

  @Prop()
  createdAt!: Date;
}

const AiResponseSchema = SchemaFactory.createForClass(AiResponse);

@Schema()
export class Message extends Document {
  @Prop()
  chatId!: string;

  @Prop()
  userMessage!: string;

  @Prop({ type: AiResponseSchema })
  aiResponse!: AiResponse;

  @Prop({ enum: ['pending', 'responded'], default: 'pending' })
  status!: 'pending' | 'responded';

  @Prop()
  createdAt!: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);