require('dotenv').config();
require('./server'); // giữ online trên Replit

const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

function getDaysUntilExam() {
  const today = new Date();
  const examDate = new Date('2025-06-25');
  const diffTime = examDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

client.once('ready', () => {
  console.log(`✅ Bot đã đăng nhập với tên ${client.user.tag}`);

  // Gửi thông báo mỗi ngày lúc 7h sáng
  cron.schedule('0 7 * * *', () => {
    const daysLeft = getDaysUntilExam();
    if (daysLeft > 0) {
      const channel = client.channels.cache.get(process.env.CHANNEL_ID);
      if (channel) {
        const message = `📢 Còn ${daysLeft} ngày nữa là đến kỳ thi THPT Quốc Gia! 🎓\n🏆 Đã cố gắng thì đừng lo kết quả!`;
        channel.send(message);
      } else {
        console.error('❌ Không tìm thấy kênh. Hãy kiểm tra CHANNEL_ID trong file .env.');
      }
    }
  });
});

client.login(process.env.TOKEN);
