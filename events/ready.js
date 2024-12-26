const { ActivityType } = require('discord.js');
const db = require('quick.db');
const distube = require('../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    try {
      console.log((`Logged in as ${client.user.tag}`).red);
      
      client.user.setStatus("dnd")
      
      client.user.setActivity(`🎶`, { type: ActivityType.Playing })
      setInterval(async () => {
        client.guilds.cache.forEach(async g => {
          let vch = await db.get(`24_7_${g.id}`)
          if (vch == null) return;
          let ch = client.channels.cache.get(vch);
          if (ch == null) return db.delete(`24_7_${g.id}`)
          const clientMember = g.members.cache.get(client.user.id);
          const checkJoined = clientMember?.voice?.channelId == ch.id;
          if (!checkJoined) {
            console.log(checkJoined)
            try {
              await distube.voices.join(ch)
            } catch (e) {
              console.log("connection", e);
            }
          }
        })
      }, 4000)
    } catch (err) {
      console.log(err)
    }
  }
};