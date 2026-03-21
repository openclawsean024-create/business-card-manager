# Telegram Bot Setup

## Bot Username
@CardKingBot

## Commands
/start - Start the bot
/help - Help
/link [username] - Link to website account
/cards - View my cards

## Webhook Setup
To set the webhook for production:

```bash
node telegram-bot.js webhook https://your-domain.com/webhook
```

## For Local Development
Use ngrok to expose local port:
```bash
ngrok http 3000
node telegram-bot.js webhook https://your-ngrok-url.ngrok.io/webhook
```
