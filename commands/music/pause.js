const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "pause",
    description: "Pauses the currently playing track.",
    cooldown: 5000,
    aliases: ['pa','ايقاف','إيقاف','توقيف'],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) 
            return;

            if (!message.guild.members.me.voice.channel)
    return;
            
            if (!message.member.voice.channel)
                return;
            const queue = distube.getQueue(message)
            if (!queue) return message.reply({ content: `:x: **يجب عليك تشغيل أغنية اولاً!**` })
            const song = queue.songs[0]
            let name = song.name
            if (queue.paused) {
                                const embed = new EmbedBuilder()
                  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                  .setTitle(`> تم إيقاف الأغنية بالفعل!!`)
                  .setDescription(`- **${name}**`)
                  .setFooter({ text: `لإعادة التشغيل اكتب: تشغيل`, iconURL: `https://img.youtube.com/vi/${song.id}/mqdefault.jpg`})
                  .setTimestamp();
                message.reply({ embeds: [embed] })
            } else {
                distube.pause(message);
                const embed = new EmbedBuilder()
                  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                  .setTitle(`> تم إيقاف الأغنية مؤقتاً:`)
                  .setDescription(`- **${name}**`)
                  .setFooter({ text: `لإعادة التشغيل اكتب: تشغيل`, iconURL: `https://img.youtube.com/vi/${song.id}/mqdefault.jpg`})
                  .setTimestamp();
                message.reply({ embeds: [embed] })
            }
        } catch (err) {
            console.log(err)
        }
    },
};
