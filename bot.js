const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

//client.login('MTA4MzExNzI0Mzc5NTI0NzIzNQ.G-ZR4x.XPb5dG371MiW5qk_1EhvBG1JpomL9WVifuFj5s');
client.login(token)
