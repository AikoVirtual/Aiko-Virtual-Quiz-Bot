const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

// Function to send embed about taking the quiz to channel
const sendQuizWebhook = async (channel) => {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('primary')
        .setLabel('Take The Quiz!')
        .setStyle(ButtonStyle.Primary),
    );

  const embed = new EmbedBuilder()
    .setColor(config['style']['primaryColor'])
    .setTitle('Ready to journey into the Aiko Season?')
    .setURL('https://discord.js.org').setThumbnail('https://cdn.discordapp.com/attachments/598508688759848969/1029401287101534218/inochi_full.png')
    .setDescription("Before you start your journey into the Aiko Season, **you will take a personality quiz to find out what guild you belong to.** These questions are general questions to help us find out what kind of person you are. \n \n **Your score will determine to us whether you're a Ronin, Droid, or Human.** We curated it in a way that everyone else in your guild has similar tastes as you. \n \n We hope you enjoy the experience and connect further with our Aikommunity as you begin to bond with your fellow guild mates.");

  try {
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.find(wh => wh.token);

    if (!webhook) {
      channel.createWebhook({
        name: 'A:Temporis | Season 1',
        avatar: 'https://cdn.discordapp.com/attachments/598508688759848969/1029401287101534218/inochi_full.png',
      })
        .then(webhook => console.log(`Created webhook ${webhook}`))
        .catch(console.error);

      return console.log('No webhook was found that I can use!');
    }

    await webhook.send({
      username: 'A:\Temporis | Season 1',
      avatarURL: 'https://cdn.discordapp.com/attachments/598508688759848969/1029401287101534218/inochi_full.png',
      embeds: [embed],
      components: [row],
    });

  } catch (error) {
    console.error('Error trying to send a message: ', error);
  }
}

exports.sendQuizWebhook = sendQuizWebhook;
