const { EmbedBuilder, PermissionsBitField, ChannelType, ComponentType } = require('discord.js');
const config = require('../config.json');
const quiz = require('../quiz.json');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isButton()) { return; }
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction: ${interaction.commandName}`);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    }
    catch (error) {
      console.error(error);

      // create embed
      const embed = new EmbedBuilder()
        .setColor(config['style']['primaryColor'])
        .setTitle(`Something went wrong!`)
        .setDescription(`Please try again(｡•́︿•̀｡)`);

      // reply
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

  },
};