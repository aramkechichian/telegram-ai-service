"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let AiService = AiService_1 = class AiService {
    constructor() {
        this.logger = new common_1.Logger(AiService_1.name);
        this.COHERE_API_KEY = process.env.COHERE_API_KEY;
    }
    async generateResponse(prompt) {
        var _a;
        try {
            const response = await axios_1.default.post('https://api.cohere.ai/v1/chat', {
                message: prompt,
                temperature: 0.7,
            }, {
                headers: {
                    Authorization: `Bearer ${this.COHERE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.text;
        }
        catch (error) {
            const err = error;
            this.logger.error('Error calling Cohere Chat API');
            this.logger.error(((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            return 'Sorry, I\'m having trouble responding right now.';
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map