const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "stop",
    description: "Stop the current song and clears the entire music queue.",
    cooldown: 5000,
    aliases: ['st', 'وقف','ستوب'],
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
            
                        const embed = new EmbedBuilder()
                .setDescription(`> ↯ Stopped the music and 0 tracks in queue has been cleared.`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });
            return distube.stop(message);
        } catch (err) {
            console.log(err)
        }
    },
};