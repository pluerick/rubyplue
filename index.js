const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const admin = require('firebase-admin');

// Parse the service account key JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize the Firebase Admin SDK with the service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rubyplue-a4332-default-rtdb.firebaseio.com"
});

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

    
    
    
    if (command === 'north') {
  // Get the player's Discord name
  const playerName = message.author.username;

  // Set up a Firebase Realtime Database reference for the player
  const dbRefPlayer = admin.database().ref(`test1/players/${playerName}`);

  // Get the player's current room ID from the database
  dbRefPlayer.child('current_room').once("value", snapshot => {
    const currentRoomId = snapshot.val();

    // Set up a Firebase Realtime Database reference for the current room
    const dbRefRoom = admin.database().ref(`test1/rooms/room-${currentRoomId}`);

    // Get the current room's data from the database
    dbRefRoom.once("value", roomSnapshot => {
      const northRoomId = roomSnapshot.child('north').val();

      if (northRoomId) {
        // Set the player's current room ID to the room to the north
        dbRefPlayer.update({ current_room: northRoomId })
          .then(() => {
            // Set up a Firebase Realtime Database reference for the new room
            const dbRefNewRoom = admin.database().ref(`test1/rooms/${northRoomId}`);

            // Get the new room's data from the database
            dbRefNewRoom.once("value", newRoomSnapshot => {
              const newRoomName = newRoomSnapshot.child('name').val();
              const newRoomDescription = newRoomSnapshot.child('description').val();

              message.reply(`You move north to ${newRoomName}. ${newRoomDescription}`);
            });
          })
          .catch((error) => {
            console.error(error);
            message.reply(`Sorry, there was an error updating your current room in the database.`);
          });
      } else {
        message.reply(`There is no room to the north.`);
      }
    });
  });
}
    
    
    
    
    // Handle the "start" command
if (command === 'start') {
  // Get the player's Discord name
  const playerName = message.author.username;

  // Get the Discord server ID
  const serverId = message.guild.id;

  // Set up a Firebase Realtime Database reference for the server
  const dbRefServer = admin.database().ref(`test1/servers/${serverId}`);

  // Check if the server's database table exists, and create it if it doesn't
  dbRefServer.once("value", serverSnapshot => {
    const serverExists = serverSnapshot.exists();
    const roomId = serverExists ? serverSnapshot.child('current_room').val() : 0;
    const roomRef = admin.database().ref(`test1/rooms/room-${roomId}`);

    // Set up a Firebase Realtime Database reference for the player
    const dbRefPlayer = admin.database().ref(`test1/players/${playerName}`);

    // Add the player's name and current room to the database
    dbRefPlayer.set({ name: playerName, current_room: roomId })
      .then(() => {
        if (!serverExists) {
          // Create a new database table for the server with a default room ID
          dbRefServer.set({ current_room: 1 });
          roomRef.once("value", roomSnapshot => {
            if (roomSnapshot.exists()) {
              message.reply(`Welcome to the game, ${playerName}! A new database table has been created for this server, and you have been added to it with a current room of ${roomId}.`);
            } else {
              message.reply(`Sorry, there was an error creating the initial room for the game.`);
            }
          });
        } else {
          message.reply(`Welcome back, ${playerName}! Your name and current room have been added to the database.`);
        }
      })
      .catch((error) => {
        console.error(error);
        message.reply(`Sorry, there was an error adding your name and current room to the database.`);
      });
  }, error => {
    console.error(error);
    message.reply(`Sorry, there was an error accessing the database for this server.`);
  });
}


    // Handle the "look" command
    if (command === 'look') {
      // Do something when the "look" command is used
      message.reply('You look around and see nothing of interest.');
    }
    
    // Handle the "generate" command
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

// Function to generate 25 randomized rooms
function generateRooms() {
  const rooms = {};

  // Define the cardinal directions
  const directions = ["north", "south", "east", "west"];

  // Generate 25 rooms
  for (let i = 1; i <= 25; i++) {
    const id = `room-${i}`;
    const room = {
      name: `Room ${i}`,
      description: `This is Room ${i}`,
    };

    // Connect the room to random neighboring rooms
    for (const direction of directions) {
      const neighborId = `room-${getRandomInt(1, 25)}`;
      room[direction] = neighborId;
    }

    // Add the room to the rooms object
    rooms[id] = room;
  }

  return rooms;
}

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
}});

client.login(process.env.TOKEN);
