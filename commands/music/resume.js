const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "resume",
    description: "إستئناف التشغيل.",
    aliases: ['تشغيل', 'استئناف', 'إستئناف', 'أستئناف'],
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) 
                return;

            if (!message.guild.members.me.voice.channel)
    return;
            
            if (!message.member.voice.channel)
                return;

            const queue = distube.getQueue(message);
            if (!queue) 
                return message.reply({ content: `:x: **يجب عليك تشغيل أغنية أولاً!**` });

            // إذا كانت الأغنية تعمل بالفعل
            if (!queue.paused) {
                const embedAlreadyPlaying = new EmbedBuilder()
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle(`> الأغنية تعمل بالفعل!`)
                    .setDescription(`- **${queue.songs[0].name}**`)
                    .setFooter({ text: `Enjoy The Music 🎶`, iconURL: `https://img.youtube.com/vi/${queue.songs[0].id}/mqdefault.jpg` })
                    .setTimestamp();
                return message.reply({ embeds: [embedAlreadyPlaying] });
            }

            const song = queue.songs[0];
            let name = song.name;

            const embedResumed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTitle(`> تم إستئناف التشغيل:`)
                .setDescription(`- **${name}**`)
                .setFooter({ text: `Enjoy The Music 🎶`, iconURL: `https://img.youtube.com/vi/${song.id}/mqdefault.jpg` })
                .setTimestamp();

            message.reply({ embeds: [embedResumed] });
            return distube.resume(message);
        } catch (err) {
            console.log(err);
        }
    },
};