#!/usr/bin/env node
/**
 * Business Card Telegram Bot
 * - Receives card photos
 * - OCR recognition
 * - Saves to linked account
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Config
const CONFIG_FILE = path.join(__dirname, 'config.json');
const DATA_FILE = path.join(__dirname, 'card_users.json');

// Telegram Bot Token
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || loadConfig().telegram_bot_token || '';
if (!BOT_TOKEN) {
    console.warn('Missing TELEGRAM_BOT_TOKEN; bot network operations will fail until configured.');
}

// Load config
function loadConfig() {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) {
        return {};
    }
}

// Load users
function loadUsers() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {}
    return { users: {}, links: {} };
}

// Save users
function saveUsers(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Send Telegram message
function sendMessage(chatId, text, parseMode = 'Markdown') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: parseMode,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📇 查看我的名片', callback_data: 'view_cards' }],
                    [{ text: '🔗 綁定網站帳戶', callback_data: 'link_account' }]
                ]
            }
        });
        
        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(null);
                }
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Send photo request
function sendPhotoUrl(chatId, photoUrl, caption) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            chat_id: chatId,
            photo: photoUrl,
            caption: caption
        });
        
        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${BOT_TOKEN}/sendPhoto`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(null);
                }
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Download file
function downloadFile(fileId) {
    return new Promise(async (resolve, reject) => {
        // Get file path first
        const getFileUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`;
        
        https.get(getFileUrl, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', async () => {
                try {
                    const result = JSON.parse(body);
                    if (!result.ok || !result.result) {
                        reject(new Error('Cannot get file'));
                        return;
                    }
                    
                    const filePath = result.result.file_path;
                    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
                    
                    // Download the file
                    const fileData = await new Promise((resolve, reject) => {
                        https.get(downloadUrl, (res) => {
                            const chunks = [];
                            res.on('data', (chunk) => chunks.push(chunk));
                            res.on('end', () => resolve(Buffer.concat(chunks)));
                            res.on('error', reject);
                        }).on('error', reject);
                    });
                    
                    resolve(fileData);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Simple OCR using Tesseract.js - we'll simulate for now
// In production, you'd use Tesseract.js or an OCR API
function parseBusinessCard(imageBuffer) {
    // This is a simplified simulation
    // In production, integrate with Tesseract.js or OCR API
    
    // Return simulated parsed data
    return {
        name: '',
        title: '',
        company: '',
        phone: '',
        email: '',
        address: '',
        raw: '名片辨識需要 OCR API 支援'
    };
}

// Save card for user
function saveCard(telegramId, cardData) {
    const data = loadUsers();
    
    if (!data.users[telegramId]) {
        data.users[telegramId] = [];
    }
    
    const card = {
        id: Date.now().toString(),
        ...cardData,
        created_at: new Date().toISOString()
    };
    
    data.users[telegramId].push(card);
    saveUsers(data);
    
    return card;
}

// Get user cards
function getUserCards(telegramId) {
    const data = loadUsers();
    return data.users[telegramId] || [];
}

// Link account
function linkAccount(telegramId, websiteUsername) {
    const data = loadUsers();
    data.links[telegramId] = websiteUsername;
    saveUsers(data);
}

// Get linked account
function getLinkedAccount(telegramId) {
    const data = loadUsers();
    return data.links[telegramId] || null;
}

// Handle webhook
async function handleUpdate(update) {
    if (!update.message && !update.callback_query) return;
    
    const message = update.message || update.callback_query.message;
    const chatId = message.chat.id;
    const userId = update.callback_query ? update.callback_query.from.id : message.from.id;
    
    if (update.callback_query) {
        const data = update.callback_query.data;
        
        if (data === 'view_cards') {
            const cards = getUserCards(userId.toString());
            if (cards.length === 0) {
                await sendMessage(chatId, '📇 您還沒有名片，請上傳名片照片來新增！');
            } else {
                let text = '📇 您的名片列表：\n\n';
                cards.forEach((card, i) => {
                    text += `${i + 1}. ${card.name || '未命名'}\n`;
                    if (card.company) text += `   公司: ${card.company}\n`;
                    if (card.phone) text += `   電話: ${card.phone}\n`;
                    if (card.email) text += `   Email: ${card.email}\n`;
                    text += '\n';
                });
                await sendMessage(chatId, text);
            }
        } else if (data === 'link_account') {
            await sendMessage(chatId, '🔗 請告訴我您在名片王網站註冊的帳號名稱來綁定');
        }
        
        return;
    }
    
    if (update.message.text) {
        const text = update.message.text;
        const linked = getLinkedAccount(userId.toString());
        
        // Check if waiting for link
        if (text.startsWith('/link ')) {
            const username = text.replace('/link ', '').trim();
            linkAccount(userId.toString(), username);
            await sendMessage(chatId, `✅ 已成功綁定帳號：${username}\n\n之後上傳的名片將會儲存到這個帳號`);
            return;
        }
        
        // Help command
        if (text === '/start' || text === '/help') {
            await sendMessage(chatId, `
📇 *名片王 Bot*

功能：
• 上傳名片照片自動辨識
• 儲存名片到帳戶
• 同步到網站

指令：
/start - 開始
/help - 說明
/link [帳號] - 綁定網站帳號
/cards - 查看我的名片
            `);
            return;
        }
        
        if (text === '/cards') {
            const cards = getUserCards(userId.toString());
            if (cards.length === 0) {
                await sendMessage(chatId, '📇 您還沒有名片，請上傳名片照片來新增！');
            } else {
                let text = '📇 您的名片列表：\n\n';
                cards.forEach((card, i) => {
                    text += `${i + 1}. ${card.name || '未命名'}\n`;
                    if (card.company) text += `   公司: ${card.company}\n`;
                    if (card.phone) text += `   電話: ${card.phone}\n`;
                    if (card.email) text += `   Email: ${card.email}\n`;
                    text += '\n';
                });
                await sendMessage(chatId, text);
            }
            return;
        }
        
        // Check if linked
        if (!linked) {
            await sendMessage(chatId, '請先綁定網站帳號！使用 /link [帳號] 指令');
            return;
        }
        
        await sendMessage(chatId, '請上傳名片照片，我會自動辨識並儲存！');
        return;
    }
    
    if (update.message.photo) {
        const userIdStr = userId.toString();
        const linked = getLinkedAccount(userIdStr);
        
        if (!linked) {
            await sendMessage(chatId, '請先綁定網站帳號！使用 /link [帳號] 指令');
            return;
        }
        
        await sendMessage(chatId, '📷 收到名片照片，正在辨識中...');
        
        try {
            const photo = update.message.photo[update.message.photo.length - 1];
            const fileId = photo.file_id;
            
            // Download and process
            const imageBuffer = await downloadFile(fileId);
            
            // Parse card (simplified - would need real OCR)
            const cardData = parseBusinessCard(imageBuffer);
            
            // Save card
            const savedCard = saveCard(userIdStr, {
                name: cardData.name || '待確認',
                title: cardData.title || '',
                company: cardData.company || '',
                phone: cardData.phone || '',
                email: cardData.email || '',
                address: cardData.address || '',
                note: '由 Telegram Bot 辨識'
            });
            
            await sendMessage(chatId, `
✅ *名片已儲存！*

姓名：${savedCard.name}
公司：${savedCard.company}
電話：${savedCard.phone}
Email：${savedCard.email}

已同步到帳號：${linked}
            `);
            
        } catch (e) {
            console.error('OCR Error:', e);
            await sendMessage(chatId, '❌ 辨識失敗，請稍後再試');
        }
        
        return;
    }
}

// Webhook server
function startServer(port = 3000) {
    const server = http.createServer(async (req, res) => {
        if (req.method === 'POST' && req.url === '/webhook') {
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', async () => {
                try {
                    const update = JSON.parse(body);
                    await handleUpdate(update);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: true }));
                } catch (e) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                }
            });
        } else if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok' }));
        } else {
            res.writeHead(404);
            res.end();
        }
    });
    
    server.listen(port, () => {
        console.log(`🤖 Bot server running on port ${port}`);
        console.log(`📡 Webhook: http://your-domain.com/webhook`);
    });
}

// Set webhook
async function setWebhook(webhookUrl) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Main
const args = process.argv.slice(2);
if (args[0] === 'webhook' && args[1]) {
    setWebhook(args[1]).then(result => {
        console.log('Webhook set:', result);
    }).catch(console.error);
} else {
    startServer(3000);
}

module.exports = { handleUpdate, saveCard, getUserCards, linkAccount };
