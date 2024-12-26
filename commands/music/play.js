const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const wait = require('node:timers/promises').setTimeout;
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "play",
    description: "Add a song to queue and plays it.",
    cooldown: 5000,
    aliases: ['p', 'ش', 'شغل'],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId)
                return;
            if (!message.guild.members.me.voice.channel)
    return;

            if (!message.member.voice.channel)
                return;
         
            let player = args.slice(0).join(' ')
            if (!player) return message.reply({ content: `**Play Commands :**
\`play < Song title > , < URL > :\` **YouTube, Spotify, Twitch, or SoundCloud**`})


            const queue = distube.getQueue(message)
            message.reply({ content: `:watch: Searching ... (\`${player}\`)` }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 3000);
            }).catch(() => { });

            const voiceChannel = message.member?.voice?.channel;
            if (voiceChannel) {
                await distube.play(voiceChannel, player, {
                    message,
                    textChannel: message.channel,
                    member: message.member,
                });
            }
        } catch (err) {
            console.log(err)
        }
    },
};

