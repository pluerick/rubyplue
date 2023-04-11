const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const admin = require('firebase-admin');
const FormData = require('form-data');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const fs = require('fs');
const openaiapi = require('openai-api');
const prefix = '?';

// Parse the service account key JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize the Firebase Admin SDK with the service account key
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://rubyplue-a4332-default-rtdb.firebaseio.com"
});


// Define the cardinal directions
const directions = ["north", "south", "east", "west"];

client.once('ready', () => {
console.log('RubyBot lives!');
});

client.on('message', async message => {
// Get the player's Discord name  
const playerName = message.author.username;
// Get the name of the Discord server where the command was generated
const serverName = message.guild.name;

// Set up a Firebase Realtime Database reference to the players table
const playersRef = admin.database().ref(`test1/${serverName}/players`);

// Set up a Firebase Realtime Database reference to the rooms table
const roomsRef = admin.database().ref(`test1/${message.guild.name}/rooms`);

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
      const roomId = Object.keys(snapshot.val())[0];

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

// Handle the "test" command
if (command === 'test') {
  // Get the player's Discord name
  const playerName = message.author.username;
  const serverName = message.guild.name;
  message.reply(`You are ${playerName} on ${serverName}.`);
}

// Handle the "north" command
if (command === 'north') {

  // Check if the player exists in the database
  playersRef.orderByChild('name').equalTo(playerName).once('value', async (snapshot) => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      // Get the player's current room ID
      const currentRoomID = snapshot.val()[Object.keys(snapshot.val())[0]].current_room;

      // Get the current room's data
      roomsRef.child("room " + currentRoomID).once('value', async (snapshot) => {
        if (!snapshot.exists()) {
          message.reply(`Sorry, ${playerName}, the current room does not exist in the database.`);
        } else {
          // Check if there is a room to the north
          if (snapshot.val().north) {
            // Update the player's current room to the room to the north
            const newRoomID = snapshot.val().north;
            playersRef.child(Object.keys(snapshot.val())[0]).update({ current_room: newRoomID });

            // Get the new room's data
            roomsRef.child("room " + newRoomID).once('value', async (snapshot) => {
              if (!snapshot.exists()) {
                message.reply(`Sorry, ${playerName}, the new room does not exist in the database.`);
              } else {
                const replyMessage = await lookAround(snapshot, roomsRef);
                message.reply(replyMessage);
              }
            });
          } else {
            message.reply(`Sorry, ${playerName}, there is no room to the north.`);
          }
        }
      });
    }
  });
}




// Handle the "look" command
if (command === 'look') {

  // Check if the player exists in the database
  playersRef.orderByChild('name').equalTo(playerName).once('value', async (snapshot) => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      // Get the player's current room ID
      const currentRoomID = snapshot.val()[Object.keys(snapshot.val())[0]].current_room;

      // Get the current room's data
      roomsRef.child("room " + currentRoomID).once('value', async (snapshot) => {
        if (!snapshot.exists()) {
          message.reply(`Sorry, ${playerName}, the current room does not exist in the database.`);
        } else {
          const replyMessage = await lookAround(snapshot, roomsRef);
          message.reply(replyMessage);
        }
      });
    }
  });
}

async function lookAround(snapshot, roomsRef){

          // Get the current room's data
          const currentRoom = snapshot.val();

          // Create a message with the current room's name and description
          let replyMessage = `You are currently in ${currentRoom.name}. ${currentRoom.description}\n`;

          // Check each direction for an adjacent room
          const directions = ["north", "south", "east", "west"];
          for (const direction of directions) {
            if (currentRoom[direction]) {
              const neighborRoomID = currentRoom[direction];
              const neighborRoomNameSnapshot = await roomsRef.child(neighborRoomID).child('name').once('value');
              const neighborRoomName = neighborRoomNameSnapshot.exists() ? neighborRoomNameSnapshot.val() : `room ${neighborRoomID}`;
              replyMessage += `To the ${direction}, you can see ${neighborRoomName}.\n`;
            }
          }

          // Return the message
          return replyMessage;
        }


    
if (command === 'generate') {
  const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);

  const roomsData = [
    {
      name: 'room 1',
      description: 'A description of the room',
      north: 4,
      west: 0,
      east: 2,
      south: 0,
    },
    {
      name: 'room 2',
      description: 'A description of the room',
      north: 5,
      west: 1,
      east: 3,
      south: 0,
    },
    {
      name: 'room 3',
      description: 'A description of the room',
      north: 6,
      west: 2,
      east: 0,
      south: 0,
    },
    {
      name: 'room 4',
      description: 'A description of the room',
      north: 0,
      west: 0,
      east: 5,
      south: 1,
    },
    {
      name: 'room 5',
      description: 'A description of the room',
      north: 0,
      west: 4,
      east: 6,
      south: 2,
    },
    {
      name: 'room 6',
      description: 'A description of the room',
      north: 0,
      west: 5,
      east: 0,
      south: 3,
    },
    {
      name: 'room 7',
      description: 'A description of the room',
      north: 1,
      west: 0,
      east: 8,
      south: 4,
    },
    {
      name: 'room 8',
      description: 'A description of the room',
      north: 2,
      west: 7,
      east: 9,
      south: 5,
    },
    {
      name: 'room 9',
      description: 'A description of the room',
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


//Handle the "haiku" command
if (command === 'haiku') {
  const haiku = await generateHaiku();
  console.log('haiku ran');
  message.reply(haiku);
}


async function generateHaiku() {
  const OpenAI = require('openai-api');
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Make sure you have an API key and set it as an environment variable
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