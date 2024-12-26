const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { joinVoiceChannel } = require('@discordjs/voice');
const { Utils } = require("devtools-ts");
const utilites = new Utils();
const db = require(`quick.db`)


module.exports = {
    name: "247",
    description: "stability",
    cooldown: 5000,
    aliases: ['join'],
    async execute(client, message, args) {
        try {

            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) 
                return;
            
            const allowedUserIds = ["1150890847768936458"];
if (!allowedUserIds.includes(message.author.id)) {
    return message.react('🚫');
}

            let channel = message.member.voice.channel;
            if (!channel) 
                return;

            distube.voices.join(channel).then(() => {
                if (!db.get(`24_7_${message.guild.id}`)) {
                    db.set(`24_7_${message.guild.id}`, channel.id);
                    message.react('✅'); // رياكت عند تفعيل 24/7
                } else {
                    db.delete(`24_7_${message.guild.id}`);
                    message.react('❌'); // رياكت عند تعطيل 24/7  
                }
            })
        } catch (err) {
            console.log(err)
        }
    },
};