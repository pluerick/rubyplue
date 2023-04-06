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
// Handle the "map" command
if (command === 'map') {
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference for the rooms
  const dbRef = admin.database().ref(`test1/${serverName}/rooms`);

  // Get the rooms data from the database
  dbRef.once('value', snapshot => {
    const rooms = snapshot.val();

    // Determine the total number of rooms in the maze
    const numRooms = Object.keys(rooms).length;

    // Set the maximum number of rooms that can fit on the map in a row or column
    const maxRoomsPerRow = 20;
    const maxRoomsPerCol = 20;

    // Calculate the size of each room based on the maximum number of rooms that can fit on the map
    const roomSize = Math.min(100, Math.floor(5000 / Math.max(maxRoomsPerRow, maxRoomsPerCol), numRooms));

    // Determine the number of rows and columns needed to fit all the rooms on the map
    const numRows = Math.ceil(Math.sqrt(numRooms));
    const numCols = Math.ceil(numRooms / numRows);

    // Determine the size of the canvas based on the number of rows and columns in the maze
    const canvasWidth = numCols * roomSize;
    const canvasHeight = numRows * roomSize;

    // Create a new canvas element
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Draw the rooms and connections on the canvas
    let roomId = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (roomId >= numRooms) {
          break;
        }

        const room = rooms[`room-${row}-${col}`];

        // Calculate the position of the room on the canvas
        const x = col * roomSize + roomSize / 2;
        const y = row * roomSize + roomSize / 2;

        // Draw the room as a square with openings where the doors are
        ctx.fillStyle = 'white';
        ctx.fillRect(x - roomSize / 2, y - roomSize / 2, roomSize, roomSize);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        if (!room.north) {
          ctx.beginPath();
          ctx.moveTo(x - roomSize / 2, y - roomSize / 2);
          ctx.lineTo(x + roomSize / 2, y - roomSize / 2);
          ctx.stroke();
        }
        if (!room.south) {
          ctx.beginPath();
          ctx.moveTo(x - roomSize / 2, y + roomSize / 2);
          ctx.lineTo(x + roomSize / 2, y + roomSize / 2);
          ctx.stroke();
        }
        if (!room.east) {
          ctx.beginPath();
          ctx.moveTo(x + roomSize / 2, y - roomSize / 2);
          ctx.lineTo(x + roomSize / 2, y + roomSize / 2);
          ctx.stroke();
        }
        if (!room.west) {
          ctx.beginPath();
          ctx.moveTo(x - roomSize / 2, y - roomSize / 2);
          ctx.lineTo(x - roomSize / 2, y + roomSize / 2);
          ctx.stroke();
        }

        // Draw the room number in the center of the room
        ctx.fillStyle = 'black';
        ctx.font = `${roomSize / 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${roomId + 1}`, x, y);

        roomId++;
      }
    }

    // Convert the canvas to a buffer and send it back to the user
    const buffer = canvas.toBuffer();
    message.reply({
      files: [{
        attachment: buffer,
        name: 'maze-map.png'
      }]
    });
  }, error => {
    console.error(error);
    message.reply(`Sorry, there was an error accessing the database.`);
  });
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

// Function to generate 25 randomized rooms
function generateRooms() {
  const rooms = {};

  // Define the dimensions of the grid
  const numRows = 5;
  const numCols = 3;

  // Create a two-dimensional array to keep track of which rooms have been visited
  const visited = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    visited[i] = new Array(numCols).fill(false);
  }

  // Define a function to recursively generate the maze
  function generateMaze(row, col) {
    // Mark the current room as visited
    visited[row][col] = true;

    // Create a new room object
    const id = `room-${row}-${col}`;
    const room = {
      name: `Room ${id}`,
      description: `This is Room ${id}`,
    };

    // Add the room to the rooms object
    rooms[id] = room;

    // Shuffle the order of directions to visit neighboring rooms
    const directions = ['north', 'south', 'east', 'west'];
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    // Visit neighboring rooms that haven't been visited yet
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

      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && !visited[newRow][newCol]) {
        // Connect the current room to the neighboring room in the current direction
        const neighborId = `room-${newRow}-${newCol}`;
        room[direction] = neighborId;
        rooms[neighborId] = rooms[neighborId] || {}; // Initialize neighbor room if not exists
        rooms[neighborId][getOppositeDirection(direction)] = id;

        // Recursively generate the maze from the neighboring room
        generateMaze(newRow, newCol);
      }
    }
  }

  // Start generating the maze from the top left room
  generateMaze(0, 0);

  // Connect the top and bottom rows
  for (let col = 0; col < numCols; col++) {
    const topRoomId = `room-0-${col}`;
    const bottomRoomId = `room-${numRows - 1}-${col}`;
    rooms[topRoomId].north = bottomRoomId;
    rooms[bottomRoomId].south = topRoomId;
  }

  // Connect the left and right columns
  for (let row = 0; row < numRows; row++) {
    const leftRoomId = `room-${row}-0`;
    const rightRoomId = `room-${row}-${numCols - 1}`;
    rooms[leftRoomId].west = rightRoomId;
    rooms[rightRoomId].east = leftRoomId;
  }

  return rooms;
}
  
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

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

}});

client.login(process.env.TOKEN);
