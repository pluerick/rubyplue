const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const admin = require('firebase-admin');
const FormData = require('form-data');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const canvas = require('canvas');
const { createCanvas } = require('canvas');
const fs = require('fs');
const openaiapi = require('openai-api');

// Define the cardinal directions
const directions = ["north", "south", "east", "west"];

// Parse the service account key JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize the Firebase Admin SDK with the service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rubyplue-a4332-default-rtdb.firebaseio.com"
});

client.once('ready', () => {
  console.log('RubyBot lives!');
});

client.on('message', async message => {
  const activity = 'Hello, world!'; // Initialize activity to a string value
  client.user.setActivity(activity);

  // Only respond to messages sent by humans (not bots)
  if (message.author.bot) return;

  // Check if the message starts with a question mark
  if (message.content.startsWith('?')) {
    // Parse the command and arguments
    const [command, ...args] = message.content.slice(1).trim().split(/\s+/);
    const serverName = message.guild.name;

    
  if (command === 'north') {
  // Get the player's Discord name
  const playerName = message.author.username;
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference for the player
  const dbRef = admin.database().ref(`test1/${serverName}/players`);

  // Look up the player's data in the database
  dbRef.orderByChild('name').equalTo(playerName).once('value', snapshot => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      const playerKey = Object.keys(snapshot.val())[0];
      const playerData = snapshot.val()[playerKey];
      const currentRoomId = playerData.current_room;

      // Look up the current room's data in the database
      const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);
      roomsRef.once('value', snapshot => {
        const currentRoomData = snapshot.val()[currentRoomId];

        // Check if there is a room to the north
        if (currentRoomData.north) {
          // Move the player to the room to the north
          const newRoomId = currentRoomData.north;
          const updates = {};
          updates[`test1/${serverName}/players/${playerKey}/current_room`] = newRoomId;
          admin.database().ref().update(updates)
            .then(() => {
              message.reply(`You move north to ${snapshot.val()[newRoomId].name}.`);
            })
            .catch((error) => {
              console.error(error);
              message.reply(`Sorry, there was an error updating your current room.`);
            });
        } else {
          // There is no room to the north
          message.reply(`There is no room to the north.`);
        }
      }, error => {
        console.error(error);
        message.reply(`Sorry, there was an error accessing the database.`);
      });
    }
  });
}
 
// Handle the "south" command
if (command === 'south') {
  // Get the player's Discord name
  const playerName = message.author.username;
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference for the player
  const dbRef = admin.database().ref(`test1/${serverName}/players`);

  // Look up the player's data in the database
  dbRef.orderByChild('name').equalTo(playerName).once('value', snapshot => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      const playerKey = Object.keys(snapshot.val())[0];
      const playerData = snapshot.val()[playerKey];
      const currentRoomId = playerData.current_room;

      // Look up the current room's data in the database
      const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);
      roomsRef.once('value', snapshot => {
        const currentRoomData = snapshot.val()[currentRoomId];

        // Check if there is a room to the south
        if (currentRoomData.south) {
          // Move the player to the room to the south
          const newRoomId = currentRoomData.south;
          const updates = {};
          updates[`test1/${serverName}/players/${playerKey}/current_room`] = newRoomId;
          admin.database().ref().update(updates)
            .then(() => {
              message.reply(`You move south to ${snapshot.val()[newRoomId].name}.`);
            })
            .catch((error) => {
              console.error(error);
              message.reply(`Sorry, there was an error updating your current room.`);
            });
        } else {
          // There is no room to the south
          message.reply(`There is no room to the south.`);
        }
      }, error => {
        console.error(error);
        message.reply(`Sorry, there was an error accessing the database.`);
      });
    }
  });
}


// Handle the "west" command
if (command === 'west') {
  // Get the player's Discord name
  const playerName = message.author.username;
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference for the player
  const dbRef = admin.database().ref(`test1/${serverName}/players`);

  // Look up the player's data in the database
  dbRef.orderByChild('name').equalTo(playerName).once('value', snapshot => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      const playerKey = Object.keys(snapshot.val())[0];
      const playerData = snapshot.val()[playerKey];
      const currentRoomId = playerData.current_room;

      // Look up the current room's data in the database
      const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);
      roomsRef.once('value', snapshot => {
        const currentRoomData = snapshot.val()[currentRoomId];

        // Check if there is a room to the west
        if (currentRoomData.west) {
          // Move the player to the room to the west
          const newRoomId = currentRoomData.west;
          const updates = {};
          updates[`test1/${serverName}/players/${playerKey}/current_room`] = newRoomId;
          admin.database().ref().update(updates)
            .then(() => {
              message.reply(`You move west to ${snapshot.val()[newRoomId].name}.`);
            })
            .catch((error) => {
              console.error(error);
              message.reply(`Sorry, there was an error updating your current room.`);
            });
        } else {
          // There is no room to the west
          message.reply(`There is no room to the west.`);
        }
      }, error => {
        console.error(error);
        message.reply(`Sorry, there was an error accessing the database.`);
      });
    }
  });
}

// Handle the "east" command
if (command === 'east') {
  // Get the player's Discord name
  const playerName = message.author.username;
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference for the player
  const dbRef = admin.database().ref(`test1/${serverName}/players`);

  // Look up the player's data in the database
  dbRef.orderByChild('name').equalTo(playerName).once('value', snapshot => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      const playerKey = Object.keys(snapshot.val())[0];
      const playerData = snapshot.val()[playerKey];
      const currentRoomId = playerData.current_room;

      // Look up the current room's data in the database
      const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);
      roomsRef.once('value', snapshot => {
        const currentRoomData = snapshot.val()[currentRoomId];

        // Check if there is a room to the east
        if (currentRoomData.east) {
          // Move the player to the room to the east
          const newRoomId = currentRoomData.east;
          const updates = {};
          updates[`test1/${serverName}/players/${playerKey}/current_room`] = newRoomId;
          admin.database().ref().update(updates)
            .then(() => {
              message.reply(`You move east to ${snapshot.val()[newRoomId].name}.`);
            })
            .catch((error) => {
              console.error(error);
              message.reply(`Sorry, there was an error updating your current room.`);
            });
        } else {
          // There is no room to the east
          message.reply(`There is no room to the east.`);
        }
      }, error => {
        console.error(error);
        message.reply(`Sorry, there was an error accessing the database.`);
      });
    }
  });
}

 
    if (command === 'start') {
  // Get the name of the Discord server where the command was generated
  const serverName = message.guild.name;

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

// Handle the "look" command
if (command === 'look') {
  // Get the player's Discord name
  const playerName = message.author.username;
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference to the players table
  const playersRef = admin.database().ref(`test1/${serverName}/players`);

  // Check if the player exists in the database
  playersRef.orderByChild('name').equalTo(playerName).once('value', async (snapshot) => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, ${playerName}, you are not registered in the game.`);
    } else {
      // Get the player's current room ID
      const currentRoomID = snapshot.val()[Object.keys(snapshot.val())[0]].current_room;

      // Set up a Firebase Realtime Database reference to the rooms table
      const roomsRef = admin.database().ref(`test1/${message.guild.name}/rooms`);

      // Get the current room's data
      roomsRef.child(currentRoomID).once('value', async (snapshot) => {
        if (!snapshot.exists()) {
          message.reply(`Sorry, ${playerName}, the current room does not exist in the database.`);
        } else {
          // Get the current room's data
          const currentRoom = snapshot.val();

          // Create a message with the current room's name and description
          let replyMessage = `You are currently in ${currentRoom.name}. ${currentRoom.description}\n`;

          // Check each direction for an adjacent room
          const directions = ["north", "south", "east", "west"];
          for (const direction of directions) {
            if (currentRoom[direction]) {
              const neighborRoomID = currentRoom[direction];
              const neighborRoomName = (await roomsRef.child(neighborRoomID).child('name').once('value')).val();
              replyMessage += `To the ${direction}, you can see ${neighborRoomName}.\n`;
            }
          }

          // Send the message to the player
          message.reply(replyMessage);
        }
      });
    }
  });
}
const axios = require('axios');
const FormData = require('form-data');


if (command === 'map') {
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference to the rooms table
  const roomsRef = admin.database().ref(`test1/${serverName}/rooms`);

  // Get all rooms in the database
  roomsRef.once('value', async (snapshot) => {
    if (!snapshot.exists()) {
      message.reply(`Sorry, there are no rooms in the database.`);
    } else {
      // Determine the size of the grid
      const numRows = 5;
      const numCols = 3;

      // Create a two-dimensional array to store the rooms
      const grid = new Array(numRows);
      for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols).fill(null);
      }

      // Populate the grid with the rooms
      snapshot.forEach((roomSnapshot) => {
        const room = roomSnapshot.val();
        const [row, col] = getRoomPosition(room.name);
        grid[row][col] = room.name;
      });

      // Create the message with the grid
      let replyMessage = '';
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const roomName = grid[row][col];
          if (roomName) {
            replyMessage += `|${roomName}|`;
          } else {
            replyMessage += '|   |';
          }
        }
        replyMessage += '\n';
      }

      // Send the message to the player
      message.reply(replyMessage);
    }
  }, error => {
    console.error(error);
    message.reply(`Sorry, there was an error accessing the database.`);
  });
}

function getRoomPosition(roomName) {
  const match = roomName.match(/room-(\d+)-(\d+)/);
  return [parseInt(match[1]), parseInt(match[2])];
}
    
// Handle the "generate" command
if (command === 'generate') {
  // Get the name of the Discord server where the command was generated
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference
  const dbRef = admin.database().ref(`test1/${serverName}`);

  // Check if the server's database table exists, and create it if it doesn't
  dbRef.once("value", snapshot => {
    if (!snapshot.exists()) {
      // Create a new database table with 25 randomly generated rooms
      const rooms = generateRooms();
      dbRef.set({ rooms });

      message.reply(`A new database table has been created for ${serverName}.`);
    } else {
      message.reply(`The database table for ${serverName} already exists.`);
    }
  }, error => {
    console.error(error);
    message.reply(`Sorry, there was an error accessing the database.`);
  });
}


//Handle the "circle" command
if (command === 'circle') {
  // Set the canvas size
console.log("circle command");
  const canvas = createCanvas(200, 200);

// Get the 2D context
const ctx = canvas.getContext('2d');

// Draw a circle
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 50;
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
ctx.fillStyle = 'green';
ctx.fill();
ctx.lineWidth = 5;
ctx.strokeStyle = '#003300';
ctx.stroke();

// Convert the canvas to a Buffer and send it as an attachment
const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'circle.png');
message.reply({ files: [attachment] });
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

  const prompt = 'Generate a haiku about nature';
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
