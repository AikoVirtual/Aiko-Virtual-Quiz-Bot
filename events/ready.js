const token = process.env['token'];
const config = require('../config.json');
const quiz = require('../functions/sendQuizWebhook.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {

    console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id})`);
    console.log(`૮ ˶ᵔ ᵕ ᵔ˶ ა  ${client.user.tag} ready to take quizzes!`);

    // send quizwebhook (comment out if not needed)
    // const channel = client.channels.cache.get(config['quiz']['quizChannelId']);
    // quiz.sendQuizWebhook(channel)
  },
};