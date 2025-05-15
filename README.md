# 🤖 Telegram AI Service

A NestJS microservice that receives messages from Telegram via webhook, stores them in MongoDB, generates intelligent responses using Cohere AI, and replies back automatically. Built with SOLID principles and a clean architecture, this project is production-ready and easy to maintain.

## 📌 Features

- ✅ Telegram Bot Webhook integration  
- ✅ AI-powered replies using **Cohere** (easy to adapt to OpenAI, Claude, etc.)  
- ✅ MongoDB for storing user messages, AI responses, status and timestamps  
- ✅ CRON-like background job to reply to pending messages  
- ✅ Clean structure following **SOLID** principles  
- ✅ Fully typed with TypeScript  
- ✅ Unit tested with Jest

---

## 🧠 How It Works

1. User sends a message to your Telegram bot.  
2. NestJS receives it via webhook and stores it in MongoDB.  
3. An AI service (Cohere) generates a response and stores it too.  
4. A scheduled task sends the response back via Telegram API.  

---

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-username/telegram-ai-service.git
cd telegram-ai-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file:

```bash
cp .env.example .env
```

Then update the following variables:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MONGODB_URI=your_mongodb_connection_string
COHERE_API_KEY=your_cohere_api_key
```

### 4. Start the server

```bash
npm run start:dev
```

The server will run on `http://localhost:3000`.

---

## 🌐 Webhook Setup

### Expose your server with `ngrok`:

```bash
ngrok http 3000
```

### Register your Telegram webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -d "url=https://<YOUR_NGROK_URL>/webhook"
```

Now Telegram will forward messages to your `/webhook` endpoint.

---

## 🧪 Testing

This project uses **Jest** for unit testing.

To run all tests:

```bash
npm test
```

Test files are colocated with their source files (e.g. `telegram.service.spec.ts`).

---

## 🔁 Background Job to Send Replies

This app uses [`@nestjs/schedule`](https://docs.nestjs.com/techniques/task-scheduling) to run a job every 5 seconds. It checks MongoDB for messages with status `pending` and sends the AI reply back via Telegram.

You don't need to manually call an endpoint — it works in the background after AI responses are saved.

If you want to trigger it manually (e.g. in dev):

```bash
curl -X POST http://localhost:3000/webhook/send-pending
```

---

## 📂 Project Structure

```
src/
├── ai/                  # AI integration (Cohere)
│   └── ai.service.ts
├── telegram/
│   ├── telegram.controller.ts
│   ├── telegram.service.ts
│   ├── schemas/
│   │   └── message.schema.ts
│   └── telegram.service.spec.ts
├── app.module.ts
└── main.ts
```

---

## ✅ Example MongoDB Document

After processing a message, MongoDB stores it like this:

```json
{
  "chatId": "123456789",
  "userMessage": "Tell me a joke",
  "aiResponse": {
    "text": "Why don't scientists trust atoms? Because they make up everything!",
    "createdAt": "2025-05-15T14:30:00.000Z"
  },
  "status": "responded",
  "createdAt": "2025-05-15T14:29:58.000Z"
}
```

---

## 📌 Technologies Used

- [NestJS](https://nestjs.com/) — Node.js framework
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM
- [Cohere](https://cohere.ai/) — AI text generation
- [Jest](https://jestjs.io/) — Unit testing
- [Ngrok](https://ngrok.com/) — Local tunneling for webhooks

---

## 👨‍💻 Author

Developed by [Aram Kechichian](https://www.linkedin.com/in/aramkechichian/)  
Feel free to connect or message me!
