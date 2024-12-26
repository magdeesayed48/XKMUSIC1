const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(client, message) {
    if (message.author.bot) return;

    // تحميل ملف القنوات
    const filePath = path.join(__dirname, '../channels.json');
    let channelsData = {};

    try {
      channelsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.error('Error reading channels file:', error);
      return;
    }

    // الحصول على معرف القناة المسموح بها
    const allowedChannelId = channelsData[message.guild.id];

    // إذا لم يتم تحديد قناة
    if (!allowedChannelId) {
      const isBotMentioned = message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`);
      
      if (!isBotMentioned) return;

      // إذا كانت الرسالة تحتوي فقط على المنشن
      
      if (message.content.trim() === `<@!${client.user.id}>` || message.content.trim() === `<@${client.user.id}>`) {
        const embed = new EmbedBuilder()
          .setDescription(`**يرجى التواصل مع [المالك](https://discord.com/users/1150890847768936458) ليقوم بتفعيل الشات لك** 👮`)
          .setColor('#ffffff')
          .setTimestamp();

        return message.reply({ embeds: [embed] });
      }

      // تحليل الرسالة وتنفيذ الأمر
      const args = message.content
        .replace(`<@!${client.user.id}>`, '')
        .replace(`<@${client.user.id}>`, '')
        .trim()
        .split(/ +/);

      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const command =
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return;

      try {
        await command.execute(client, message, args);
      } catch (error) {
        console.error(error);
        message.reply('حدث خطأ أثناء تنفيذ الأمر!');
      }
    } else {
      // إذا تم تحديد قناة
      if (message.channel.id !== allowedChannelId) return;

      const isBotMentioned = message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`);
      let args;

      if (isBotMentioned) {
        // إذا كانت الرسالة تحتوي فقط على المنشن
        if (message.content.trim() === `<@!${client.user.id}>` || message.content.trim() === `<@${client.user.id}>`) {
          const embed = new EmbedBuilder()
                      .setTitle('- Help Menu')
          .setDescription('> **يرجى عدم إزعاجي كثيراً بالمنشن**\n> **تفضل هذه الأوامر الخاصة بي:**\n')
          .addFields(
            { name: '⭐ play', value: '`p` , `شغل` , `ش`', inline: true },
            { name: '⭐ stop', value: '`st` , `ستوب` , `وقف`', inline: true },
            { name: '⭐ pause', value: '`pa` , `ايقاف` , `إيقاف` , `توقيف`', inline: true },
            { name: '⭐ resume', value: '`re` , `تشغيل` , `استئناف` , `أستئناف` , `إستئناف`', inline: true },
            { name: '⭐ skip', value: '`sk` , `تخطي` , `سكب` , `سكيب` , `التالي`', inline: true },
            { name: '⭐ queue', value: '`qu` , `القائمة` , `انتظار`, `إنتظار` , `أنتظار`', inline: true },
            { name: '⭐ volume', value: 'vol` , `الصوت` , `ص` , `صوت`', inline: true},
            { name: '⭐ loop', value: '`loop` , `تكرار`', inline: true },
            { name: '⭐ autoplay', value: '`اوتو` , `تلقائي`' , inline: true },
            { name: '⭐ nowplaying', value: '`np` , `الان` , `status` , `الأن` , `الآن`', inline: true }
          )
            .setColor('#ffffff')
            .setTimestamp();

          return message.reply({ embeds: [embed] });
        }

        // إزالة المنشن وتحليل الرسالة
        args = message.content
          .replace(`<@!${client.user.id}>`, '')
          .replace(`<@${client.user.id}>`, '')
          .trim()
          .split(/ +/);
      } else {
        // تحليل الرسالة مباشرة
        args = message.content.trim().split(/ +/);
      }

      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const command =
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return;

      try {
        await command.execute(client, message, args);
      } catch (error) {
        console.error(error);
        message.reply('حدث خطأ أثناء تنفيذ الأمر!');
      }
    }
  },
};