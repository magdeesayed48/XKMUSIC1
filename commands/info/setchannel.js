const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'set_channel',
  description: 'حدد قناة للاستجابة للأوامر',
  aliases: ['setchannel', 'setch', 'sc'], // أسماء مستعارة للأمر
  async execute(client, message, args) {
    try {
      // التأكد من أن المستخدم لديه صلاحيات المسؤول
      const allowedUserIds = ["1150890847768936458"];
if (!allowedUserIds.includes(message.author.id)) {
    return;
}

      // التأكد من وجود منشن أو ID للقناة
      const channelMention = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
      if (!channelMention || !channelMention.isTextBased()) {
        return message.react('❌');
      }

      // تحديد مسار ملف القنوات
      const filePath = path.resolve(__dirname, '../../channels.json');

      // إذا لم يكن الملف موجودًا، يتم إنشاؤه
      if (!fs.existsSync(filePath)) {
        try {
          fs.writeFileSync(filePath, JSON.stringify({}, null, 2), 'utf8');
        } catch (error) {
          console.error(error);
        }
      }

      // قراءة بيانات الملف
      let channelsData = {};
      try {
        channelsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        console.error(error);
      }

      // تحديث معرف القناة الخاصة بالسيرفر الحالي
      channelsData[message.guild.id] = channelMention.id;

      // كتابة البيانات المحدثة إلى الملف
      try {
        fs.writeFileSync(filePath, JSON.stringify(channelsData, null, 2), 'utf8');
      } catch (error) {
        console.error(error);
      }

      // إرسال رسالة تأكيد
      return message.react('✅');
    } catch (error) {
      console.error(error);
      return message.react('🚫');
    }
  },
};