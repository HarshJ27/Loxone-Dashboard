const LxCommunicator = require('lxcommunicator');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Validate environment variables
if (!process.env.LOXONE_IP || !process.env.LOXONE_USERNAME || !process.env.LOXONE_PASSWORD) {
  console.error('Missing environment variables. Check LOXONE_IP, LOXONE_USERNAME, and LOXONE_PASSWORD.');
  process.exit(1); // Exit the application if variables are missing
}

// Construct WebSocket URL
const wsUrl = `wss://dns.loxonecloud.com/504F94D04BEF/ws/rfc6455`;
console.log('WebSocket URL:', wsUrl);

const connection = new LxCommunicator.WebSocket(
  wsUrl,
  process.env.LOXONE_USERNAME,
  process.env.LOXONE_PASSWORD
);

// connection.setMaxListeners(20); // Increase the limit as needed

connection.open()
  .then(() => {
    console.log('Connected to Loxone Miniserver');

    // Toggle light function
    async function toggleLight() {
      try {
        const command = 'jdev/sps/io/light/toggle';
        await connection.send(command);
        console.log('Light toggled');
      } catch (error) {
        console.error('Error toggling light:', error);
      }
    }

    // Get light status function
    async function getLightStatus() {
      try {
        const status = await connection.send('jdev/sps/io/light/status');
        console.log('Light status:', status);
        return status;
      } catch (error) {
        console.error('Error getting light status:', error);
      }
    }

    // API endpoints
    app.get('/toggle', (req, res) => {
      toggleLight();
      res.send('Light toggled');
    });

    app.get('/status', async (req, res) => {
      const status = await getLightStatus();
      res.send(`Light status: ${status}`);
    });

    app.use(express.static('public'));

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Connection failed:', error);
  });
