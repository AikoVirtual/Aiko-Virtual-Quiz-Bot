const { EmbedBuilder, PermissionsBitField, ChannelType, ComponentType } = require('discord.js');
const config = require('../config.json');

// Function to update quiz everytime someone answers a question so that it doesn't call the same questions
const newQuestion = async (quizQuestions, index, channel) => {
  let question = quizQuestions[index]

  const questionEmbed = new EmbedBuilder()
    .setTitle('Please answer with 1, 2, 3 or 4 as your response!')
    .setDescription(question.question)
    .addFields(
      { name: '1.', value: question.choices[0], inline: false },
      { name: '2.', value: question.choices[1], inline: false },
      { name: '3.', value: question.choices[2], inline: false },
      { name: '4.', value: question.choices[3], inline: false },
    )
    .setColor(config['style']['primaryColor'])

  await channel.send({
    embeds: [questionEmbed],
  })
}

exports.newQuestion = newQuestion;
