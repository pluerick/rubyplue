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
