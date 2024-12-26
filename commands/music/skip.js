const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');

module.exports = {
    name: "skip",
    description: "Skip the current song.",
    cooldown: 5000,
    aliases: ['sk', 'التالي', 'تخطي', 'سكيب', 'سكب'],
    async execute(client, message, args) {
        try {
            // التحقق من أن المستخدم في نفس القناة الصوتية مع البوت
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) 
                return;

            if (!message.guild.members.me.voice.channel)
    return;
            
            // التحقق من أن المستخدم في قناة صوتية
            if (!message.member.voice.channel) 
                return;

            // الحصول على قائمة التشغيل
            const queue = distube.getQueue(message);
            if (!queue) {
                return message.reply({ content: `:x: **يجب عليك تشغيل أغنية اولاً!**` });
            }

            // التحقق من وجود أغنية حالية وأغنية تالية
            const song = queue.songs[0];
            const nextSong = queue.songs[1];
            if (!queue.autoplay && queue.songs.length <= 1) {
                return message.reply({ content: `:x: **هذه الأغنية هي الأخيرة في قائمة التشغيل!**` });
            }

            // إنشاء الإيمبد والإرسال
            const embed = new EmbedBuilder()
                .setDescription(`> ↯ **Skipped, the next song is:** \`${nextSong?.name || 'Autoplay song'}\``)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });

            // تخطي الأغنية
            await distube.skip(message);
        } catch (err) {
            console.error(err);
            message.react('⭕');
        }
    },
};