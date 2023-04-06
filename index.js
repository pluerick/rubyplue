const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const admin = require('firebase-admin');


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
  console.log('ChatGPT bot is online!');
});

client.on('message', async message => {
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
function generateRooms() {
  const rooms = {};
  const numRows = 6; // 6 rows of rooms
  const numCols = 6; // 6 columns of rooms
  const passableRooms = []; // array to keep track of passable rooms

  // Recursive function to generate the maze
  function generateMaze(row, col) {
    const id = `room-${row}-${col}`;
    const room = {
      name: `Room ${id}`,
      description: `This is Room ${id}`,
    };

    // Determine if the room is passable or not
    const isPassable = Math.random() < 0.75; // 75% chance of being passable
    if (isPassable) {
      passableRooms.push(id); // add to passable rooms array
    } else {
      room.passable = false; // set room as impassable
    }

    // Add the room to the rooms object
    rooms[id] = room;

    // Shuffle the order of directions to visit neighboring rooms
    const directions = ['north', 'south', 'east', 'west'];
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    // Visit neighboring rooms recursively
    for (const direction of directions) {
      let newRow = row, newCol = col;
      switch (direction) {
        case 'north':
          newRow--;
          break;
        case 'south':
          newRow++;
          break;
        case 'east':
          newCol++;
          break;
        case 'west':
          newCol--;
          break;
      }

      // Check if the neighboring room is within bounds
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        const neighborId = `room-${newRow}-${newCol}`;

        // Check if the neighboring room has already been visited
        if (!rooms[neighborId]) {
          // Create a connection to the neighboring room
          room[direction] = neighborId;
          rooms[neighborId] = {};
          rooms[neighborId][getOppositeDirection(direction)] = id;
          generateMaze(newRow, newCol); // visit the neighboring room recursively
        } else if (passableRooms.includes(neighborId)) {
          // Create a connection to the neighboring room if it is passable
          room[direction] = neighborId;
          rooms[neighborId][getOppositeDirection(direction)] = id;
        }
      }
    }
  }

  // Define a function to get the opposite direction of a given direction
  function getOppositeDirection(direction) {
    switch (direction) {
      case 'north':
        return 'south';
      case 'south':
        return 'north';
      case 'east':
        return 'west';
      case 'west':
        return 'east';
    }
  }

  // Start generating the maze from the top-left room
  generateMaze(0, 0);

  // Filter out impassable rooms and save only passable rooms to the database
  const passableRoomsData = {};
  for (const id of passableRooms) {
    passableRoomsData[id] = rooms[id];
  }
  return passableRoomsData;
}

  


// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

}});

client.login(process.env.TOKEN);
