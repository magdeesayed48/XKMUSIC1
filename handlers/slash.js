const fs = require('fs');

module.exports = (client) => {
  fs.readdirSync('./SlashCommands').forEach((folder) => {
    const commandFiles = fs.readdirSync(`./SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../SlashCommands/${folder}/${file}`);
      if (command.name) {
        client.slashCommands.set(command.name, command);
      }
    }
  });
  
  const commands = client.slashCommands.map(({ execute, ...data }) => data);
  
  console.log(('Started refreshing slash commands...').green);
  console.log((`Successfully reloaded ${commands.length} slash commands!`).green);
}