const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'del_channel',
  description: 'احذف القناة المحددة من الإعدادات',
  aliases: ['removechannel', 'deletechannel', 'dc'], // أسماء مستعارة للأمر
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

      // إذا لم يكن الملف موجودًا، يتم إرسال خطأ
      if (!fs.existsSync(filePath)) {
        return message.react('🚫');
      }

      // قراءة بيانات الملف
      let channelsData = {};
      try {
        channelsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        console.error(error);
      }

      // التأكد إذا كانت القناة مسجلة لهذا السيرفر
      if (!channelsData[message.guild.id] || channelsData[message.guild.id] !== channelMention.id) {
        return message.react('❌');
      }

      // حذف القناة من البيانات
      delete channelsData[message.guild.id];

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