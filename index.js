const Discord = require('discord.js');
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
 if (message.content.startsWith('?')) {
    // Send the user's message to the OpenAI API and get a response
    const userMessage = message.content.slice(1);
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Ask ChatGPT a question: ${userMessage}`,
      max_tokens: 100,
      temperature: 0.7,
      n: 1,
      stop: ['\n']
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
      }
    });

    // Send the response back to the user
    const botMessage = response.data.choices[0].text.trim();
    message.reply(botMessage);
  }
});


client.login(process.env.TOKEN)
