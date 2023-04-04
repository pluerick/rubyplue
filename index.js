// Handle the "map" command
if (command === 'map') {
  // Get the name of the Discord server where the command was generated
  const serverName = message.guild.name;

  // Set up a Firebase Realtime Database reference
  const dbRef = admin.database().ref(`test1/${serverName}/rooms`);

  // Get the list of rooms from the database
  dbRef.once("value", snapshot => {
    const rooms = snapshot.val();

    // Define the room size and grid size
    const roomSize = 50;
    const gridSize = 5;
    const gridSpacing = 100;

    // Calculate the canvas size based on the grid size and spacing
    const canvasWidth = (gridSize + 1) * gridSpacing;
    const canvasHeight = (Math.ceil(Object.keys(rooms).length / gridSize) + 1) * gridSpacing;

    // Create a new canvas
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw each room and its connections
    let i = 0;
    for (const roomId in rooms) {
      const room = rooms[roomId];

      // Calculate the room position based on the grid
      const x = ((i % gridSize) + 1) * gridSpacing;
      const y = (Math.floor(i / gridSize) + 1) * gridSpacing;

      // Draw the room circle
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x, y, roomSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw the room label
      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(room.name, x, y);

      // Draw the connections to neighboring rooms
      for (const direction of directions) {
        const neighborId = room[direction];
        if (neighborId) {
          const neighborRoom = rooms[neighborId];

          // Calculate the neighbor room position based on the grid
          const neighborIndex = Object.keys(rooms).indexOf(neighborId);
          const neighborX = ((neighborIndex % gridSize) + 1) * gridSpacing;
          const neighborY = (Math.floor(neighborIndex / gridSize) + 1) * gridSpacing;

          // Draw the connection line
          ctx.strokeStyle = '#000';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(neighborX, neighborY);
          ctx.stroke();

          // Draw the neighbor room label
          ctx.fillStyle = '#000';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(neighborRoom.name, neighborX, neighborY);
        }
      }
      
      i++;
    }

    // Convert the canvas to a buffer and send it to Discord
    const buffer = canvas.toBuffer();
    message.reply({ files: [buffer] });
  }, error => {
    console.error(error);
    message.reply(`Sorry, there was an error accessing the database.`);
  });
}
