// const redis = require('redis');

// const client = redis.createClient({
//   url: 'redis://localhost:6379',
//   socket: {
//     reconnectStrategy: (retries) => {
//       if (retries > 5) {
//         console.error('Redis: Max retries reached, giving up.');
//         return new Error('Max retries reached');
//       }
//       return Math.min(retries * 100, 3000); // Retry every 100ms, max 3s
//     },
//   },
// });

// client.on('error', (err) => {
//   console.error('Redis Client Error:', err.message);
// });

// client.connect().catch((err) => {
//   console.error('Failed to connect to Redis:', err.message);
// });

// module.exports = client;


const redis = require('redis');

const client = redis.createClient({
  url: 'redis://redis:6379', // Use Docker service name 'redis' instead of 'localhost'
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error('Redis: Max retries reached, giving up.');
        return new Error('Max retries reached');
      }
      return Math.min(retries * 100, 3000); // Retry every 100ms, max 3s
    },
  },
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('ready', () => {
  console.log('Redis client ready');
});

client.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err.message);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down Redis client');
  await client.quit();
});

module.exports = client;