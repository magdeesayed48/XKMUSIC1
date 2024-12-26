const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const db = require(`quick.db`)
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "repeat",
    description: "Toggles the repeat mode.",
    cooldown: 5000,
    aliases: ['loop', 'تكرار'],
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
            if (0 <= Number(args[0]) && Number(args[0]) <= 2) {
                distube.setRepeatMode(message, parseInt(args[0]))
                message.reply({ content: `:notes: **تم ضبط وضع التكرار على:** ${args[0].replace("0", "\`تعطيل\`").replace("1", "\`تكرار هذه الأغنية\`").replace("2", "\`تكرار القائمة\`")}` })
            } else {
                const embed = new EmbedBuilder()
                  .setTitle(`> يرجى أختيار رقم بين: < 0 - 2 >`)
                  .setDescription(`- **0 = \`تعطيل\`**\n- **1 = \`تكرار هذه الأغنية\`**\n- **2 = \`تكرار القائمة\`**`)
                  .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                  .setTimestamp();
                message.reply({ embeds: [embed] })
            }
        } catch (err) {
            console.log(err)
        }
    },
};