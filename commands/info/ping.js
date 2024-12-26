const { EmbedBuilder } = require("discord.js");
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "ping",
    description: `Test the bots response time.`,
    aliases: ['السرعة'],
    cooldown: 5000,
    async execute(client, message, args) {
        try {

            const allowedUserIds = ["1150890847768936458"];
if (!allowedUserIds.includes(message.author.id)) {
    return;
}
            
            const embed = new EmbedBuilder()
                .setTitle('Pong! 🏓')
                .setColor(0x0099FF)
                .setThumbnail(client.user.displayAvatarURL() )
                .setDescription(`**Time:** \`${Date.now() - message.createdTimestamp}\`\n**Micro:** \`${Math.round(client.ws.ping)}\`\n**WS:** \`${client.ws.ping}\``)
                .setTimestamp()
                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() });
            message.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err)
        }
    },
};