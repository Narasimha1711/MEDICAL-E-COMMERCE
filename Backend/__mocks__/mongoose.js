console.log('Mongoose mock loaded');

const Schema = jest.fn(function (schemaDefinition) {
  const schema = {
    schemaDefinition,
    methods: {},
    statics: {},
    pre: jest.fn(),
    post: jest.fn(),
    index: jest.fn(), // ← ADD THIS LINE
    on: jest.fn(), // ← ADD THIS LINE
    plugin: jest.fn(), // ← ADD THIS LINE
  };
  Object.setPrototypeOf(schema, Schema.prototype);
  return schema;
});

Schema.prototype = Object.create(Object.prototype);
Schema.Types = {
  ObjectId: jest.fn().mockImplementation((id) => id || 'mocked-object-id'),
};

const mongoose = {
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue(),
  connection: {
    close: jest.fn(),
    readyState: 1,
  },
  Schema,
  model: jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    collection: {
        getIndexes: jest.fn().mockResolvedValue({}), // return dummy indexes
        createIndex: jest.fn().mockResolvedValue('mock-index-created')
      }
  }),
  Types: {
    ObjectId: jest.fn().mockImplementation((id) => id || 'mocked-object-id'),
  },
};

module.exports = mongoose;
