const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "queue",
    description: "قائمة التشغيل",
    cooldown: 5000,
    aliases: ['انتظار','القائمة','إنتظار','أنتظار'],
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

            const reload = new ButtonBuilder()
                .setCustomId('reload')
                .setStyle(ButtonStyle.Primary)
                .setLabel('🔄');
            const next = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Primary);
            if (queue.songs.length === 1) next.setDisabled(true)

            const back = new ButtonBuilder()
                .setCustomId('back')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);
            const row = new ActionRowBuilder()
                .addComponents(back, reload, next);

            const exampleEmbed = new EmbedBuilder()
                .setTitle(queue.songs[0].name)
                .setURL(queue.songs[0].url)
                .addFields(
                    { name: 'Time', value: queue.songs[0].formattedDuration, inline: true },
                    { name: 'Views', value: queue.songs[0].views + ' view', inline: true },
                    { name: 'Req by', value: `<@${queue.songs[0].user.id}>`, inline: true },
                )
                .setImage(queue.songs[0].thumbnail)
                .setTimestamp()
                .setFooter({ text: `1 / ${queue.songs.length}` });

            return message.reply({
                embeds: [exampleEmbed],
                components: [row]
            })
        } catch (err) {
            console.log(err)
            console.log(err)
        }
    },
};