const { EmbedBuilder, PermissionsBitField, ChannelType, ComponentType } = require('discord.js');
const config = require('../config.json');
const quiz = require('../quiz.json');
const quizList = require('../functions/quizList.js');
const numFormat = require('../functions/numFormat.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const { member, guild, user, channel, message } = interaction

    if (interaction.isChatInputCommand()) return;

    else if (interaction.isButton() && member.roles.cache.has("1022364465657815122") && !member.roles.cache.has(config["roleIds"][0]) && !member.roles.cache.has(config["roleIds"][1]) && !member.roles.cache.has(config["roleIds"][2])) {

      // && !member.roles.cache.has(config["roleIds"][0]) && !member.roles.cache.has(config["roleIds"][1]) && !member.roles.cache.has(config["roleIds"][2])) 

      if (message.guild.channels.cache.find(channel => channel.name.includes(`${user.id}`))) {
        const roleRequired = new EmbedBuilder()
          .setDescription(`${user.tag} You already have an active quiz!`)
          .setColor(config['style']['primaryColor'])
        interaction.reply({
          embeds: [roleRequired],
          ephemeral: true
        });

        return
      }


      //////////////////////////////////////////////////
      // create quiz
      //////////////////////////////////////////////////

      const minutes = numFormat.convertMsToMinutesSeconds(config["quizTime"]);

      // const quizRole = message.guild.roles.cache.get("1026248802568503449");
      // member.roles.remove(quizRole)
      try {
        member.guild.channels.create({
          name: `quiz-${user.tag}-${user.id}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: user.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
        }).then(async channel => {

          ///////////////////////////////////////
          // embeds after channel creation
          ///////////////////////////////////////
          const success = new EmbedBuilder()
            .setTitle(`${user.tag} has started a quiz!`)
            .setDescription(`Please finish the quiz in ${channel} within ${minutes} minute!`)
            .setColor(config['style']['primaryColor'])

          await interaction.reply({
            embeds: [success],
            ephemeral: true
          });

          const reminder = new EmbedBuilder()
            .setDescription(`${user.tag} please finish the quiz in ${minutes} minute or the quiz will end and the channel will be deleted!`)
            .setColor(config['style']['primaryColor'])

          await channel.send({
            embeds: [reminder],
            ephemeral: true
          });

          // await channel.setParent('1028862575510831104');

          ///////////////////////////////////////
          // send a quiz message in new channel
          ///////////////////////////////////////
          let quizQuestions = quiz
          const item = quizQuestions[Math.floor(Math.random() * quiz.length)];

          ///////////////////////////////////////
          // collector creation
          ///////////////////////////////////////
          const weightKeys = Object.keys(item.weights)
          const filter = response => {
            return weightKeys.some(answer => answer.toLowerCase() === response.content.toLowerCase());
          };
          const collector = channel.createMessageCollector({ filter, max: config['maxQuestions'], time: config['quizTime'] });

          ///////////////////////////////////////
          // guild role fetch
          ///////////////////////////////////////
          await message.guild.roles.fetch()
          const roles = config['roles']
          let fetchedRoles = []
          roles.forEach((roleName, i) => {
            fetchedRoles.push(message.guild.roles.cache.find(role => role.name === roleName))
          })
          let count = 0
          const guildWeight = new Map([['Ronin', 0], ['Droid', 0], ['Human', 0]]);

          collector.on('collect', async m => {
            switch (true) {
              case item.weights[m] == "Ronin":
                guildWeight.set('Ronin', guildWeight.get('Ronin') + 1 || 1);
                break;
              case item.weights[m] == "Droid":
                guildWeight.set('Droid', guildWeight.get('Droid') + 1 || 1);
                break;
              case item.weights[m] == "Human":
                guildWeight.set('Human', guildWeight.get('Human') + 1 || 1);
                break;
            }
            count += 1

            if (count < config['maxQuestions']) {
              let index = Math.floor(Math.random() * quizQuestions.length)
              await quizList.newQuestion(quizQuestions, index, channel)
              quizQuestions = quizQuestions.filter(item => {
                return quizQuestions[index] != item
              })
            }
          });

          collector.on('end', async collected => {
            const roninVal = guildWeight.get("Ronin")
            const droidVal = guildWeight.get("Droid")
            const humanVal = guildWeight.get("Human")
            ///////////////////////////////////////
            // give member guild role based on quiz score
            ///////////////////////////////////////
            let givenRole = null
            switch (true) {
              case count === 0:
                break;
              case roninVal > humanVal && roninVal > droidVal:
                givenRole = roles[0]
                member.roles.add(fetchedRoles[0]);
                break;
              case droidVal > roninVal && droidVal > humanVal:
                givenRole = roles[1]
                member.roles.add(fetchedRoles[1]);
                break;
              case humanVal > roninVal && humanVal > droidVal:
                givenRole = roles[2]
                member.roles.add(fetchedRoles[2]);
                break;
              case humanVal === roninVal || humanVal === droidVal || droidVal === roninVal || droidVal === roninVal === humanVal:
                const chance = Math.floor(Math.random() * 3)
                if (chance === 0) {
                  givenRole = roles[0]
                  member.roles.add(fetchedRoles[0]);
                } else if (chance === 1) {
                  givenRole = roles[1]
                  member.roles.add(fetchedRoles[1]);
                }
                else {
                  givenRole = roles[2]
                  member.roles.add(fetchedRoles[2]);
                }
                break;
            }
            ///////////////////////////////////////
            // log quiz interaction
            ///////////////////////////////////////
            if (count > 0) {
              console.log(`${user.tag} given the ${givenRole} role with a quiz score of ${[...guildWeight.entries()]}`)

              const ending = new EmbedBuilder()
                .setTitle(`${user.tag} Thank you for filling out our quiz! It seems you're best fitted with the ${givenRole}s! This channel will delete now!`)
                .setColor(config['style']['primaryColor'])

              await channel.send({
                embeds: [ending],
                ephemeral: false
              });

              setTimeout(() => {
                channel.delete()
              }, "10000")

            } else {
              console.log(`${user.tag} did not finish the quiz, the channel has been deleted.`)

              const unfinished = new EmbedBuilder()
                .setTitle(`${user.tag} You didn't finish the quiz in time! Please try again!`)
                .setColor(config['style']['primaryColor'])

              // member.roles.add(quizRole)

              await channel.send({
                embeds: [unfinished],
                ephemeral: false
              });

              setTimeout(() => {
                channel.delete()
              }, "10000")
            }
          });
          let index = Math.floor(Math.random() * quizQuestions.length)
          quizList.newQuestion(quizQuestions, index, channel)
          quizQuestions = quizQuestions.filter(item => {
            return quizQuestions[index] != item
          })
          // quizList.newQuestion(quizQuestions, channel)
          ///////////////////////////////////////
          // error handling
          ///////////////////////////////////////
        }).catch(async err => {
          console.log(err)
        });
        console.log(`${user.tag} in #${channel.name} triggered an quiz interaction`)
      } catch (error) {
        console.log(error)
      }
    } else if (member.roles.cache.has(config["roleIds"][0]) || member.roles.cache.has(config["roleIds"][1]) || member.roles.cache.has(config["roleIds"][2])) {

      const roleRequired = new EmbedBuilder()
        .setDescription(`${user.tag} You already have a guild role! You cannot take the quiz again!`)
        .setColor(config['style']['primaryColor'])
      interaction.reply({
        embeds: [roleRequired],
        ephemeral: true
      });
    }
    else if (!member.roles.cache.has("1022364465657815122")) {
      const roleRequired = new EmbedBuilder()
        .setDescription(`${user.tag} You don't have the Virtual role!`)
        .setColor(config['style']['primaryColor'])
      interaction.reply({
        embeds: [roleRequired],
        ephemeral: true
      });
    }
  },
};