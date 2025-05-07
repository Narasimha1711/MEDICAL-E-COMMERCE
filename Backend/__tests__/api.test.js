 


// __tests__/api.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
jest.mock('redis'); // Mock redis module
jest.mock('mongoose'); // Mock mongoose


let mongoServer;

beforeAll(async () => {
  jest.setTimeout(30000); // Increase timeout to 30 seconds for beforeAll
  await mongoose.connection.close();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000); // Set timeout for the hook

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('GET /', () => {

  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  // Add test for /addToCart if needed
// it('should get cart items', async () => {
//     const res = await request(app)
//       .get('/addToCart')
//       .set('Cookie', 'token=thisissecret'); // Replace with valid token
//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('added to cart');
//   });

//   it('should get cart items', async () => {
//     // Mock Mongoose query for UserDoc.findOne
//     const mockUser = {
//       cart: [{ _id: 'mocked-object-id', name: 'Medicine' }],
//     };
//     require('mongoose').model().findOne.mockResolvedValue(mockUser);

//     // Mock Mongoose query for MedicineModel.findById
//     const mockMedicine = { count: 10 };
//     require('mongoose').model().findById.mockResolvedValue(mockMedicine);

//     const res = await request(app)
//       .get('/addToCart')
//       .set('Cookie', 'token=thisissecret'); // Replace with valid token or mock JWT
//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('added to cart');
//     expect(res.body.items).toEqual(mockUser.cart);
//     expect(res.body.itemsCount).toEqual([10]);
//   });

  
});


// jest.mock('mongoose');
// jest.mock('redis');
// jest.mock('jsonwebtoken');
// const request = require('supertest');
// const app = require('../server'); // Adjust path to server.js

// describe('API Tests', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return 200 OK for root route', async () => {
//     const res = await request(app).get('/');
//     expect(res.status).toBe(200);
//   });

//   it('should get cart items', async () => {
//     // Mock JWT verification
//     require('jsonwebtoken').verify.mockImplementation((token, secret, options, callback) => {
//       callback(null, { email: 'test@example.com' });
//     });

//     // Mock Mongoose queries
//     const mockUser = {
//       cart: [{ _id: 'mocked-object-id', name: 'Medicine' }],
//     };
//     const mockMedicine = { count: 10 };
//     require('mongoose').model().findOne.mockResolvedValue(mockUser);
//     require('mongoose').model().findById.mockResolvedValue(mockMedicine);

//     const res = await request(app)
//       .get('/addToCart')
//       .set('Cookie', 'token=mocked-jwt-token');
//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('added to cart');
//     expect(res.body.items).toEqual(mockUser.cart);
//     expect(res.body.itemsCount).toEqual([10]);
//   });
// });