const fs = require('fs');

module.exports = (client) => {
  let commandCount = 0; // متغير لحساب عدد الأوامر المسجلة

  fs.readdirSync('./commands').forEach((folder) => {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      let command = require(`../commands/${folder}/${file}`);
      if (command.name) {
        client.commands.set(command.name, command);
        commandCount++; // زيادة العداد لكل أمر مسجل
      }
    }
  });

  // طباعة عدد الأوامر المسجلة
  console.log(('Started refreshing prefix commands...').yellow);
  console.log((`Successfully reloaded ${commandCount} prefix commands!`).yellow);
}