export declare class AiService {
    private readonly logger;
    private readonly COHERE_API_KEY;
    generateResponse(prompt: string): Promise<string>;
}
