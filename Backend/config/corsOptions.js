
// const allowedOrigins = ['http://localhost:5173']

// const corsOptions = {
//     credentials: true,
//     origin: allowedOrigins[0]
// }

// module.exports = corsOptions;

const allowedOrigins = [
    'http://localhost:5173',
    // 'https://medical-e-commerce.vercel.app'
      
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  };
  
  module.exports = corsOptions;
  