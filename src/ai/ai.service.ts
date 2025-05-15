import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly COHERE_API_KEY = process.env.COHERE_API_KEY;

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/chat',
        {
          message: prompt,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.text;
    } catch (error) {
      const err = error as any;
      this.logger.error('Error calling Cohere Chat API');
      this.logger.error(err.response?.data || err.message);

      return 'Sorry, I\'m having trouble responding right now.';
    }
  }
}
