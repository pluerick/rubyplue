const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({
   intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ] 
  });
const axios = require('axios');
const admin = require('firebase-admin');
const FormData = require('form-data');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const fs = require('fs');
const openaiapi = require('openai-api');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const prefix = '?';
let worldPrompt = '';
clearchannelID = '';
const openai = require('openai');
const request = require('request');


// Parse the service account key JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize the Firebase Admin SDK with the service account key
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://rubyplue-a4332-default-rtdb.firebaseio.com"
});



// Define the cardinal directions
const directions = ["north", "south", "east", "west"];

client.on('ready', () => {
console.log('RubyBot lives!');
});

client.on('messageCreate', async message => {


// Get the player's Discord name  
const playerName = message.author.username;

// Get the name of the Discord server where the command was generated
const serverName = message.guild.name;

// Set up a Firebase Realtime Database reference to the players table
const playersRef = admin.database().ref(`test1/${serverName}/players`);

// Set up a Firebase Realtime Database reference to the rooms table
const roomsRef = admin.database().ref(`test1/${message.guild.name}/rooms`);

 // Set up a Firebase Realtime Database reference to the server's data
 const serverRef = admin.database().ref(`test1/${serverName}`);



// Only respond to messages sent by humans (not bots)
if (message.author.bot) return;

// Check if the message starts with a question mark
if (message.content.startsWith('?')) {

// Parse the command and arguments
const [command, ...args] = message.content.slice(1).trim().split(/\s+/);
const serverName = message.guild.name;

// Handle the 'start') command
if (command === 'start') {
  // Set up a Firebase Realtime Database reference to the server's data
  const serverRef = admin.database().ref(`test1/${serverName}`);
  // Check if the server's data exists in the database
  serverRef.once("value", serverSnapshot => {
  if (!serverSnapshot.exists()) {
  // The server's data doesn't exist in the database, inform the user and take no further action
  message.reply(`Sorry, ${serverName} is not registered in the game. Use the 'generate' command to create a new game database.`);
  } else {
  // The server's data exists in the database, check if the player already exists
  const playerName = message.author.username;
  const playersRef = admin.database().ref(`test1/${serverName}/players`);
  playersRef.orderByChild('name').equalTo(playerName).once('value', snapshot => {
  if (snapshot.exists()) {
    message.reply(`You have already started the game!`);
  } else {
    // Get the ID of the first room
    const roomsRef = serverRef.child("rooms");
    roomsRef.orderByKey().limitToFirst(1).once('value', snapshot => {
      const roomId = Object.keys(snapshot.val())[0].slice(-1);

  // Check if the player is already in the database, if not, add them
      const playersRef = serverRef.child("players");
      playersRef.orderByChild("name").equalTo(playerName).once("value", (playerSnapshot) => {
        if (playerSnapshot.exists()) {
          message.reply(`You have already started the game!`);
        } else {
          // Add the player's name and current room to the database
          const playerData = {
            name: playerName,
            current_room: roomId,
          };
          playersRef.push(playerData)
            .then(() => {
              message.reply(`Welcome to the game, ${playerName}! Your name and current room have been added to the database.`);
            })
            .catch((error) => {
              console.error(error);
              message.reply(`Sorry, there was an error adding your name and current room to the database.`);
            });
        }
      });
    }, error => {
      console.error(error);
      message.reply(`Sorry, there was an error accessing the database.`);
    });
  }
  });
  }
  }, error => {
  console.error(error);
  message.reply(`Sorry, there was an error accessing the database.`);
  });
}

// Handle the "setmaproom" command
if (command === 'setmaproom') {
  const serverName = message.guild.name;
  const channelId = message.channel.id;

  // Reference to the servername node of the database .test1.[servernames]
  const roomsRef = admin.database().ref(`test1/${serverName}`);

  // Check if the server already has a maproom and overwrite it if it exists
  roomsRef.child('mapRoom').once('value', (snapshot) => {
    if (snapshot.exists()) {
      roomsRef.child('mapRoom').set(channelId)
        .then(() => {
          // Send a confirmation message to the same channel
          message.channel.send(`Map room has been updated to this channel (ID: ${channelId})`);
        })
        .catch((error) => {
          console.error(error);
          // Send an error message to the same channel
          message.channel.send('An error occurred while updating the map room. Please try again later.');
        });
    } else {
      // Create a new mapRoom node with the channelId if it does not exist
      roomsRef.child('mapRoom').set(channelId)
        .then(() => {
          // Send a confirmation message to the same channel
          message.channel.send(`Map room has been set to this channel (ID: ${channelId})`);
        })
        .catch((error) => {
          console.error(error);
          // Send an error message to the same channel
          message.channel.send('An error occurred while setting the map room. Please try again later.');
        });
    }
  });
}

// Handle the "setworlddesc" command
if (command === 'setworlddesc' || command === 'swd') {
  const serverName = message.guild.name;
  const channelId = message.channel.id;
   // Join all arguments into a single string
  const worldDesc = args.join(' ');

  // Set up a Firebase Realtime Database reference to the worldDesc property
  const worldDescRef = admin.database().ref(`test1/${message.guild.name}`);

  // Check if the server already has a worldDesc and overwrite it if it exists
  worldDescRef.child('worldDesc').once('value', (snapshot) => {
    if (snapshot.exists()) {
      worldDescRef.child('worldDesc').set(worldDesc)
        .then(() => {
          // Send a confirmation message to the same channel
          message.channel.send(`Overwrote world description to: ${worldDesc}. \n This will be used when the map is generated again.`);
        })
        .catch((error) => {
          console.error(error);
          // Send an error message to the same channel
          message.channel.send('An error occurred while updating the map room. Please try again later.');
        });
    } else {
      // Create a new worldDesc node with the channelId if it does not exist
      worldDescRef.child('worldDesc').set(worldDesc)
        .then(() => {
          // Send a confirmation message to the same channel
          message.channel.send(`New world description set to: ${worldDesc}. \n This will be used when the map is generated.`);
        })
        .catch((error) => {
          console.error(error);
          // Send an error message to the same channel
          message.channel.send('An error occurred while setting the map room. Please try again later.');
        });
    }
  });
}


// Handle the movement commands
if (command === 'north' || command === 'south' || command === 'east' || command === 'west' || command === 'n' || command === 's' || command === 'e' || command === 'w') {

  // Check if the player exists in the database
  playersRef.orderByChild('name').equalTo(playerName).once('value', async (snapshot) => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      // Get the player's unique ID
      const playerID = Object.keys(snapshot.val())[0];

      // Get the player's current room ID
      const currentRoomID = snapshot.val()[playerID].current_room;

      // Get the current room's data
      roomsRef.child("room " + currentRoomID).once('value', async (snapshot) => {
        if (!snapshot.exists()) {
          message.reply(`Sorry, ${playerName}, the current room does not exist in the database.`);
        } else {
          let direction = '';
          if (command === 'north' || command === 'n' && snapshot.val().north) {
            direction = 'north';
          } else if (command === 'south'  || command === 's' && snapshot.val().south) {
            direction = 'south';
          } else if (command === 'east'  || command === 'e' && snapshot.val().east) {
            direction = 'east';
          } else if (command === 'west'  || command === 'w' && snapshot.val().west) {
            direction = 'west';
          }
          if (direction) {
            // Update the player's current room to the new room in the appropriate direction
            const newRoomID = snapshot.val()[direction];
            const playerRef = playersRef.child(playerID);
            playerRef.child('current_room').set(newRoomID, (error) => {
              if (error) {
                message.reply(`Sorry, ${playerName}, there was an error updating your current room.`);
              } else {
                // Get the new room's data
                roomsRef.child("room " + newRoomID).once('value', async (snapshot) => {
                  if (!snapshot.exists()) {
                    message.reply(`Sorry, ${playerName}, the new room does not exist in the database.`);
                  } else {
                    const replyEmbed = await lookAround(snapshot, roomsRef);
                    //message.reply(replyMessage);
                    message.reply({ embeds: [replyEmbed] });
                  }
                });
              }
            });
            
          } else {
            message.reply(`Sorry, ${playerName}, there is no room in that direction.`);
          }
        }
      });
    }
  });
}


// Handle the "look" command
if (command === 'look' || command === 'l') {

  // Check if the player exists in the database
  playersRef.orderByChild('name').equalTo(playerName).once('value', async (snapshot) => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      // Get the player's current room ID
      const currentRoomID = snapshot.val()[Object.keys(snapshot.val())[0]].current_room;

      // Get the current room's data and use lookAround() to generate the reply message
      roomsRef.child("room " + currentRoomID).once('value', async (snapshot) => {
        if (!snapshot.exists()) {
          message.reply(`Sorry, ${playerName}, the current room does not exist in the database.`);
        } else {
          const replyEmbed = await lookAround(snapshot, roomsRef);
          message.reply({ embeds: [replyEmbed] });
        }
      });
    }
  });
}


//Handle the "generate" command
if (command === 'generate') {
  const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);

  message.reply('Generating room descriptions with Open AI! This may take a few seconds...');

  const roomsData = [
    {
      name: 'room 1',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 4,
      west: 0,
      east: 2,
      south: 0,
    },
    {
      name: 'room 2',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 5,
      west: 1,
      east: 3,
      south: 0,
    },
    {
      name: 'room 3',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 6,
      west: 2,
      east: 0,
      south: 0,
    },
    {
      name: 'room 4',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 0,
      west: 0,
      east: 5,
      south: 1,
    },
    {
      name: 'room 5',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 0,
      west: 4,
      east: 6,
      south: 2,
    },
    {
      name: 'room 6',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 0,
      west: 5,
      east: 0,
      south: 3,
    },
    {
      name: 'room 7',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 1,
      west: 0,
      east: 8,
      south: 4,
    },
    {
      name: 'room 8',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 2,
      west: 7,
      east: 9,
      south: 5,
    },
    {
      name: 'room 9',
      description: await generateDescription(args),
      image: 'https://imgur.com/fePkCyU',
      north: 3,
      west: 8,
      east: 0,
      south: 6,
    },
  ];



  roomsRef.once('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('Data already exists in the database. Skipping...');
      message.reply('Rooms data already exists in the database. Skipping...');
    } else {
      console.log('Adding rooms data to the database...');
      roomsData.forEach((room) => {
        roomsRef.child(room.name).set(room);
      });
      message.reply('Rooms data added to the database successfully!');
    }
  });
}

if (command === 'makeimages') {
  const roomArg = args[0];
  message.reply('Generating room images with Open AI for room number', roomArg, '! This may take a few seconds...')
  const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);
  roomsRef.once('value', (snapshot) => {
    const rooms = snapshot.val();
    const roomKey = 'room ' + roomArg;
    const roomRef = roomsRef.child(roomKey);
    const roomDescription = rooms[roomKey].description;
    const { exec } = require('child_process');
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const prompt = roomDescription.replace(/[^\w\s]/g, '');
    const cmd = `curl https://api.openai.com/v1/images/generations \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${openaiApiKey}" \
      -d '{
        "prompt": "make an image that looks like a painting and depicts a room matching the following description-- ${prompt}",
        "n": 2,
        "size": "1024x1024"
      }'`;        
      try {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          const response = JSON.parse(stdout);
          const currentRoomImageUrl = response.data[0].url;
          //message.reply(currentRoomImageUrl);
          message.reply('Done! Uploading image to Imgur...');
          axios.get(currentRoomImageUrl, { responseType: 'arraybuffer' })
            .then((response) => {
              const imageData = response.data;
              const formData = new FormData();
              formData.append('image', imageData, { filename: 'image.png' });
              const uploadOptions = {
                url: 'https://api.imgur.com/3/image',
                headers: {
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
                  ...formData.getHeaders(),
                },
                data: formData,
              };
              axios.post(uploadOptions.url, uploadOptions.data, { headers: uploadOptions.headers })
                .then((response) => {
                  const imgurUrl = response.data.data.link;
                  console.log(`Imgur URL:`, imgurUrl);
                  message.reply('Done! Image uploaded to Imgur successfully!');
      
                  // Update the image node for the current room 
                  roomRef.update({ image: `${imgurUrl}` }, (error) => {
                    if (error) {
                      console.error(`Failed to update image for room ${roomKey}:`, error);
                    } else {
                      console.log(`Image for room ${roomKey} updated successfully`);
                      message.reply('Done! Image for room updated successfully!');
                    }
                  });
                })
                .catch((error) => {
                  console.error(`Failed to upload image to Imgur:`, error);
                });
            })
            .catch((error) => {
              console.error(`Failed to retrieve image data:`, error);
            });
        });
      } catch (error) {
        console.error(`Error executing curl command: ${error}`);
      }
      
  });
}


//Handle the "blast" command
if (command === 'blast') {
  const rootRef = admin.database().ref();

  rootRef.remove()
  .then(() => {
    console.log('All data removed successfully.');
  })
  .catch((error) => {
    console.error('Error removing data:', error);
  });
  message.reply('PEW PEW database BALETTEEDD');
}

// This command returns an image.
if (command === 'image') {
  message.reply('Creating AI image...');
  const { exec } = require('child_process');
  const openaiApiKey = process.env.OPENAI_API_KEY; // Replace with your OpenAI API key
  const prompt = message.content.slice(7); // Get the prompt from the message content
  const cmd = `curl https://api.openai.com/v1/images/generations \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${openaiApiKey}" \
    -d '{
      "prompt": "${prompt}",
      "n": 2,
      "size": "256x256"
    }'`;


  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    const response = JSON.parse(stdout);
    console.log('response:', response);
    const imgURL = response.data[0].url;
    const exampleEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Generated Image')
    .setDescription(`Generated image for prompt: ${prompt}`)
    .setImage(imgURL);

    message.reply(exampleEmbed);
  });

}



//Handle the "haiku" command
if (command === 'haiku') {
  
  //message.author.send("TEST");

  const haiku = await generateHaiku();
  console.log('haiku ran 4');
  message.reply(haiku);
}

async function lookAround(snapshot, roomsRef){

  // Get the current room's data
  const currentRoom = snapshot.val();

  // Create an embed with the current room's name and description
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(currentRoom.name)
    .setDescription(currentRoom.description)
    .setImage(currentRoom.image)
    .setTimestamp();

  // Check each direction for an adjacent room
  const directions = ["north", "south", "east", "west"];
  const fields = [];
  for (const direction of directions) {
    if (currentRoom[direction]) {
      const neighborRoomID = currentRoom[direction];
      const neighborRoomNameSnapshot = await roomsRef.child(neighborRoomID).child('name').once('value');
      const neighborRoomName = neighborRoomNameSnapshot.exists() ? neighborRoomNameSnapshot.val() : `room ${neighborRoomID}`;
      fields.push({ name: `${direction}`, value: ''});
    }
  }
  embed.addFields(fields);

// Add buttons for each direction
// Create a new action row with buttons
const row = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('north')
			.setLabel('North')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('south')
			.setLabel('South')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('east')
			.setLabel('East')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('west')
			.setLabel('West')
			.setStyle(ButtonStyle.Primary),
	);


 



  // Return the embed
  return embed;
}




//This function writes descriptions of the rooms and assigns to the data
async function generateDescription(args) {
  const OpenAI = require('openai-api');
  const openai = new OpenAI(OPENAI_API_KEY);
  const subject  = args[0];
  let prompt = 'From the second person perspective of a person as they enter a room, describe a room. Describe evidence and clues to things or creatures that may have been there previously.  Since other systems will come up with the monsters, traps, and weapons dont mention those. Dont mention actions taken by the player or changes to the room. Try not to use language that would be considered offensive when generating images later like blood';
  

// Set up a Firebase Realtime Database reference to the worldDesc property
const worldDescRef = admin.database().ref(`test1/${message.guild.name}`);

// If test1.[servernames].worldDesc exists, set worldDesc to that value

  // Check if the server already has a worldDesc in the database
  worldDescRef.child('worldDesc').once('value', (snapshot) => {
    if (snapshot.exists()) {
      // If it exists, set a variable worldPrompt to the worldDesc value
      const worldDesc = snapshot.val();
      console.log('debug 1', worldDesc);
      global.worldPrompt = `The world description: ${worldDesc}`;
      // // Send a message to the same channel with the worldDesc
      // message.channel.send(worldPrompt);
    } else {
  global.worldPrompt = 'a basic dungeon and dragons like world in the medieval times.';
    }
  });

  if (global.worldPrompt !== 0) {
    prompt += ` Here's a description of the world this game world exists in: ${global.worldPrompt}.`;
  }
  console.log(prompt);
  const model = 'text-davinci-002';

  const gptResponse = await openai.complete({
    engine: model,
    prompt: prompt,
    maxTokens: 150,
    n: 1,
    temperature: 0.7
  });

  const GeneratedDesc = gptResponse.data.choices[0].text.trim();
  global.currentRoomDesc = GeneratedDesc;
  //console.log(GeneratedDesc);
  return GeneratedDesc;
}


// Handle the 'clear' command
if (command === 'clear') {
  // Get the channel where the command was sent
  const channel = message.channel;

  // Fetch the last 100 messages in the channel
  const messages = await channel.messages.fetch({ limit: 100 });

  // Delete all messages in the channel
  await channel.bulkDelete(messages);

  // Send a confirmation message
  //await channel.send(`${playerName}, all messages have been deleted!`);
}


//This function writes haikus!
  async function generateHaiku() {
    const OpenAI = require('openai-api');
    const openai = new OpenAI(OPENAI_API_KEY);
    const subject  = args[0];

    const prompt = `Generate a haiku about ${subject}`;
    const model = 'text-davinci-002';

    const gptResponse = await openai.complete({
      engine: model,
      prompt: prompt,
      maxTokens: 50,
      n: 1,
      temperature: 0.7
    });

    const haiku = gptResponse.data.choices[0].text.trim();
    return haiku;
  }


}});



client.login(process.env.TOKEN);