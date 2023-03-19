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
    // Send the user's message to the OpenAI API and get a response
    const userMessage = message.content.slice(1);
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Ask ChatGPT a question: ${userMessage}`,
      max_tokens: 200,
      temperature: 0.5,
      n: 1
 
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
      }
      
    });

    // Send the response back to the user
    const botMessage = response.data.choices[0].text;
    message.reply('logged');
    console.log(userMessage);
    console.log(response.data.choices[0].text);
    console.log(response.data);
    
  }
});

client.login(process.env.TOKEN)
