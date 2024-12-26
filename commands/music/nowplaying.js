const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "nowplaying",
    description: "Shows what is song that the bot is currently playing.",
    cooldown: 5000,
    aliases: ['الان', 'np', 'status', 'الأن', 'الآن'],
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
            
            let embed = new EmbedBuilder()
                .setTitle(`${song.name}`)
                .setURL(`${song.url}`)
                .setDescription(`\nDuration: \`[${queue.formattedCurrentTime}/${song.formattedDuration}]\``)
                .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
              .setTimestamp();
            message.reply({ embeds: [embed] })
        } catch (err) {
            console.log(err)
        }
    },
};