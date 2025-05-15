"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const telegram_service_1 = require("../../src/telegram/telegram.service");
const ai_service_1 = require("../../src/ai/ai.service");
jest.mock('axios');
describe('TelegramService', () => {
    let service;
    let messageModelMock;
    let aiServiceMock;
    beforeEach(async () => {
        const messageModelConstructorMock = jest.fn().mockImplementation(() => ({
            save: jest.fn(),
        }));
        aiServiceMock = {
            generateResponse: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                telegram_service_1.TelegramService,
                {
                    provide: (0, mongoose_1.getModelToken)('Message'),
                    useValue: messageModelConstructorMock,
                },
                {
                    provide: ai_service_1.AiService,
                    useValue: aiServiceMock,
                },
            ],
        }).compile();
        service = module.get(telegram_service_1.TelegramService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('handleUpdate', () => {
        it('should save message with AI response', async () => {
            const saveMock = jest.fn();
            const fakeInstance = { save: saveMock };
            service.messageModel = jest.fn().mockImplementation(() => fakeInstance);
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
            service.messageModel = {
                find: jest.fn().mockResolvedValue(fakeMessages),
            };
            jest.spyOn(service, 'sendTelegramMessage').mockResolvedValue(undefined);
            const sentCount = await service.sendPendingResponses();
            expect(sentCount).toBe(1);
            expect(fakeMessages[0].status).toBe('responded');
            expect(fakeMessages[0].save).toHaveBeenCalled();
            expect(service.sendTelegramMessage).toHaveBeenCalledWith('123', 'reply');
        });
    });
});
//# sourceMappingURL=telegram.service.spec.js.map