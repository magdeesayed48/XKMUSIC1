const client = require("../index");
const { Utils } = require("devtools-ts");
const utilites = new Utils();


module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        try {
            if (!interaction.isCommand()) return; // استخدام isCommand مباشرة
            if (!interaction.guild) return;

            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
};