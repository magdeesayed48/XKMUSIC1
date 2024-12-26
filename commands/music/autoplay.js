    const { EmbedBuilder } = require("discord.js");
    const distube = require('../../client/distube')
    const { Utils } = require("devtools-ts");
    const utilites = new Utils();

    module.exports = {
        name: "autoplay",
        description: "تشغيل تلقائي.",
        cooldown: 5000,
        aliases: ['اوتو','تلقائي'],
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
                
                const mode = distube.toggleAutoplay(message)
                if (!queue.autoplay) {
                    message.reply({ content: `:white_check_mark: autoplay: **\`${queue.autoplay ? "On" : "Off"}\`**` })
                } else {
                    message.reply({ content: `:white_check_mark: autoplay: **\`${queue.autoplay ? "On" : "Off"}\`**` })
                }
            } catch (err) {
                console.log(err)
            }
        },
    };