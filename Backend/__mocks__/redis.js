const client = {
    get: jest.fn().mockResolvedValue(null), // Simulate cache miss
    setEx: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    isOpen: true,
    connect: jest.fn().mockResolvedValue(),
    quit: jest.fn().mockResolvedValue(),
    on: jest.fn(), // Mock event listeners
  };
  
  module.exports = {
    createClient: () => client,
  };