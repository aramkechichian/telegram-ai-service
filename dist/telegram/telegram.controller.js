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
var TelegramController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramController = void 0;
const common_1 = require("@nestjs/common");
const telegram_service_1 = require("./telegram.service");
let TelegramController = TelegramController_1 = class TelegramController {
    constructor(telegramService) {
        this.telegramService = telegramService;
        this.logger = new common_1.Logger(TelegramController_1.name);
    }
    async receiveUpdate(update) {
        this.logger.log('Update received');
        await this.telegramService.handleUpdate(update);
        return { ok: true };
    }
    async sendPendingMessages() {
        const sentCount = await this.telegramService.sendPendingResponses();
        return { sent: sentCount };
    }
};
exports.TelegramController = TelegramController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "receiveUpdate", null);
__decorate([
    (0, common_1.Post)('send-pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "sendPendingMessages", null);
exports.TelegramController = TelegramController = TelegramController_1 = __decorate([
    (0, common_1.Controller)('webhook'),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], TelegramController);
//# sourceMappingURL=telegram.controller.js.map