const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const db = require(`quick.db`)
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "volume",
    description: "Changes/Shows the current volume.",
    cooldown: 5000,
    aliases: ['vol','صوت','ص','الصوت'],
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
            const volume = parseInt(args[0]);
            if (!volume) {
                return message.reply({ content: `> :loud_sound: الصوت: \`${queue.volume}\`%` });
            }
            if (isNaN(volume)) {
                return message.reply({ content: '> :no_entry_sign: يرجى أختيار رقم صحيح!' });
            }
            if (volume < 0 || volume > 150 || isNaN(volume))
                return message.reply({ content: "> :no_entry_sign: **مسموح لك بأختيار مستوى الصوت من: `0` إلى `150`**" })
            if (volume < 0) volume = 0;
            if (volume > 150) volume = 150;
            db.set(`volume_${message.guild.id}`, volume)
            message.reply(`> :loud_sound: **تم تغيير مستوى الصوت من: \`${queue.volume}\` إلى \`${volume}\`**`)
            distube.setVolume(message, volume);
        } catch (err) {
            console.log(err)
        }
    },
};
