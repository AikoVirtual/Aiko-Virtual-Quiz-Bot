const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

// Function to send embed about taking the quiz to channel

const sendQuizWebhook = async (channel) => {
  try {
    console.log("Sending webhook!")
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Take The Quiz!')
          .setStyle(ButtonStyle.Primary),
      );

    const embed = new EmbedBuilder()
      .setColor(config['style']['primaryColor'])
      .setTitle('Ready to journey into the Aiko Season?').setURL('https://aikovirtual.com/').setThumbnail('https://cdn.discordapp.com/attachments/598508688759848969/1029401287101534218/inochi_full.png')
      .setDescription("In Benkei, you are required to go through intense training in order to become a Ronin. This journey starts from the day you are born. \n \n In the far province of the East Winds, where Zatsu resides; houses several categories of Ronins ranging from Fishermen, Collectors, Scouters, and Spies. These categories change according to Benkei’s regions. \n \n Benkei’s world surrounds the Inochi No Ki, fostering elders who have lived entire centuries–mastering the art of reading spiritual energies. Once a year an elder from each region gathers to perform *The Ancestral Call* a ceremony that titles a Ronin’s role in society after they have completed their training. \n \n Based on the culture passed down from centuries to centuries in the vast regions of Benkei, we created this quiz, which will define which nation you will be part of during Season 1. \n \n You will be chosen for either one of the two nations. Benkei or Zenet. \n \n Which side will you fight for? \n \n Will you represent Benkei as a Ronin? \n \n Or will you fight alongside the Droids on Zenet?");

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
  } catch (error) {
    console.error('Error trying to send a message: ', error);
  }

}

exports.sendQuizWebhook = sendQuizWebhook;
