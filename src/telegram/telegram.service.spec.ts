
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TelegramService } from '../../src/telegram/telegram.service';
import { AiService } from '../../src/ai/ai.service';
import axios from 'axios';

jest.mock('axios');

describe('TelegramService', () => {
  let service: TelegramService;
  let messageModelMock: any;
  let aiServiceMock: any;

  beforeEach(async () => {
    const messageModelConstructorMock = jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    }));

    aiServiceMock = {
      generateResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        {
          provide: getModelToken('Message'),
          useValue: messageModelConstructorMock,
        },
        {
          provide: AiService,
          useValue: aiServiceMock,
        },
      ],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleUpdate', () => {
    it('should save message with AI response', async () => {
      const saveMock = jest.fn();
      const fakeInstance = { save: saveMock };
      (service as any).messageModel = jest.fn().mockImplementation(() => fakeInstance);

      aiServiceMock.generateResponse.mockResolvedValue('AI reply');

      const update = {
        message: {
          chat: { id: 123 },
          text: 'hello',
        },
      };

      await service.handleUpdate(update);

      expect(aiServiceMock.generateResponse).toHaveBeenCalledWith('hello');
      expect(saveMock).toHaveBeenCalled();
    });

    it('should return early if no message or text', async () => {
      await expect(service.handleUpdate({})).resolves.toBeUndefined();
      await expect(service.handleUpdate({ message: {} })).resolves.toBeUndefined();
    });
  });

  describe('sendPendingResponses', () => {
    it('should send pending messages and update status', async () => {
      const fakeMessages = [
        {
          chatId: '123',
          aiResponse: { text: 'reply' },
          status: 'pending',
          save: jest.fn(),
        },
      ];
  
      (service as any).messageModel = {
        find: jest.fn().mockResolvedValue(fakeMessages),
      };
  
      jest.spyOn(service as any, 'sendTelegramMessage').mockResolvedValue(undefined);
  
      const sentCount = await service.sendPendingResponses();
  
      expect(sentCount).toBe(1);
      expect(fakeMessages[0].status).toBe('responded');
      expect(fakeMessages[0].save).toHaveBeenCalled();
      expect((service as any).sendTelegramMessage).toHaveBeenCalledWith('123', 'reply');
    });
  });
  
});
