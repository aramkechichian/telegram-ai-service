"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("./schemas/message.schema");
const ai_service_1 = require("../ai/ai.service");
const axios_1 = __importDefault(require("axios"));
const schedule_1 = require("@nestjs/schedule");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(messageModel, aiService) {
        this.messageModel = messageModel;
        this.aiService = aiService;
        this.logger = new common_1.Logger(TelegramService_1.name);
        this.TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
    }
    async handleUpdate(update) {
        const message = update.message;
        if (!message || !message.text)
            return;
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
    async handleCron() {
        const sentCount = await this.sendPendingResponses();
        if (sentCount > 0) {
            this.logger.log(`Sent ${sentCount} pending messages`);
        }
    }
    async sendPendingResponses() {
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
            }
            catch (error) {
                this.logger.error(`Failed to send message to ${message.chatId}`, error);
            }
        }
        return pendingWithResponse.length;
    }
    async sendTelegramMessage(chatId, text) {
        try {
            await axios_1.default.post(`${this.TELEGRAM_API_URL}/sendMessage`, {
                chat_id: chatId,
                text,
            });
        }
        catch (error) {
            this.logger.error(`Telegram send failed for chatId ${chatId}`, error);
        }
    }
};
exports.TelegramService = TelegramService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "handleCron", null);
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ai_service_1.AiService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map