const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

let animationMode = 0; // 0 - off, 1 - animation running
let animationInterval; // To store the interval for stopping animation

// Serve static files in the "public" directory
app.use(express.static('public'));

// Serve the index.html page on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home_page.html'));
});

// LED control routes
app.get('/led/green', (req, res) => {
  stopAnimation(); // Stop animation when changing LED color
  exec('python controlLEDs.py 0 1 0', handleExecResponse(res, 'LED turned Green'));
});

app.get('/led/red', (req, res) => {
  stopAnimation();
  exec('python controlLEDs.py 1 0 0', handleExecResponse(res, 'LED turned Red'));
});

app.get('/led/blue', (req, res) => {
  stopAnimation();
  exec('python controlLEDs.py 0 0 1', handleExecResponse(res, 'LED turned Blue'));
});

app.get('/led/yellow', (req, res) => {
  stopAnimation();
  exec('python controlLEDs.py 1 1 0', handleExecResponse(res, 'LED turned Yellow'));
});

app.get('/led/purple', (req, res) => {
  stopAnimation();
  exec('python controlLEDs.py 1 0 1', handleExecResponse(res, 'LED turned Purple'));
});

app.get('/led/cian', (req, res) => {
  stopAnimation();
  exec('python controlLEDs.py 0 1 1', handleExecResponse(res, 'LED turned Cian'));
});

app.get('/led/off', (req, res) => {
  stopAnimation();
  exec('python controlLEDs.py 0 0 0', handleExecResponse(res, 'LED turned Off'));
});

// Start LED animation
app.get('/led/animation', (req, res) => {
  if (animationMode === 1) {
    return res.send('Animation is already running.'); // Prevent multiple animations
  }

  animationMode = 1; // Set animation mode to on
  res.send('LED animation started');

  const commands = [
    'python controlLEDs.py 1 1 1', // RGB on
    'python controlLEDs.py 0 1 1', // Yellow
    'python controlLEDs.py 1 0 1', // Magenta
    'python controlLEDs.py 0 0 1', // Red
    'python controlLEDs.py 1 1 0', // Cyan
    'python controlLEDs.py 0 1 0', // Green
    'python controlLEDs.py 1 0 0', // Blue
  ];

  let index = 0; // Track the current command

  // Function to execute the next command in the animation
  const executeNextCommand = () => {
    if (animationMode === 1) { // Keep running if animation is still active
      exec(commands[index], (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          return; // Stop if there's an error
        }
        if (stderr) {
          console.error(`Command stderr: ${stderr}`);
          return; // Stop if there's an error
        }
        console.log(`Command output: ${stdout}`);
        
        index = (index + 1) % commands.length; // Loop back to the start
        animationInterval = setTimeout(executeNextCommand, 1000); // Wait 1 second before executing the next command
      });
    }
  };

  executeNextCommand(); // Start executing commands
});

// Stop LED animation
app.get('/led/stop-animation', (req, res) => {
  stopAnimation(); // Stop the animation and clear the timeout
  res.send('LED animation stopped');
});

// Function to handle exec response
const handleExecResponse = (res, successMessage) => {
  return (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return res.status(500).send(`Error: ${successMessage}`);
    }
    if (stderr) {
      console.error(`Python script stderr: ${stderr}`);
      return res.status(500).send('Error in Python script');
    }
    console.log(`Python script output: ${stdout}`);
    res.send(successMessage);
  };
};

// Function to stop the animation
const stopAnimation = () => {
  animationMode = 0; // Set animation mode to off
  clearTimeout(animationInterval); // Clear the interval
};

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
