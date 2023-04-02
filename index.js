const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('ChatGPT bot is online!');
});

client.on('message', async message => {
  // Only respond to messages sent by humans (not bots)
  if (message.author.bot) return;

  // Check if the message starts with a question mark
  if (message.content.startsWith('?')) {
    // Parse the command and arguments
    const [command, ...args] = message.content.slice(1).trim().split(/\s+/);

    // Handle the "start" command
    if (command === 'start') {
      // Do something when the "start" command is used
      message.reply('Starting the game...');
    }

    // Handle the "look" command
    if (command === 'look') {
      // Do something when the "look" command is used
      message.reply('You look around and see nothing of interest.');
    }

  }
});

client.login(process.env.TOKEN);
