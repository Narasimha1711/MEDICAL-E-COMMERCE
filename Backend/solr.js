const mongoose = require('mongoose');
const MedicineModel = require('./models/Medicines');
const SellerModel = require('./models/SellerSchema');
const solr = require('solr-client');
require('dotenv').config()

// MongoDB connection (reuse your existing connection logic)
// const connection = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/your_database_name', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   }
// };

const connection = async (uri = process.env.MONGODB_CONNECTION) => {
    try {
      await mongoose.connect(uri);
      if (process.env.NODE_ENV !== 'test') {
        console.log('Database Connection Established');
      }
    } catch (err) {
      console.error('Database Connection Error:', err);
      throw err;
    }
  };

// Solr client
const solrClient = solr.createClient({
  host: 'localhost',
  port: 8983,
  core: 'medicines',
  protocol: 'http',
});

// Index medicines
const indexMedicines = async () => {
  try {
    await connection();

    // Fetch all medicines from MongoDB
    const medicines = await MedicineModel.find().populate('seller');

    // Transform documents for Solr
    const solrDocs = medicines.map((med) => ({
      id: med._id.toString(), // Convert ObjectId to string
      name: med.name,
      seller: med.seller ? med.seller.shopName : 'Unknown', // Use shopName from SellerModel
      count: med.count || 0,
      price: med.price || 0.0,
      discountedPrice: med.discountedPrice || 0.0,
      discount: med.discount || 0.0,
      description: med.description || '',
      image: med.image ? `/uploads/${med.image}` : '', // Adjust path for frontend
      category: med.category || '',
      location: med.location || [],
    }));

    // Clear existing Solr index (optional, comment out if incremental indexing)
    await solrClient.deleteByQuery('*:*');
    await solrClient.commit();

    // Index documents in batches
    const batchSize = 100;
    for (let i = 0; i < solrDocs.length; i += batchSize) {
      const batch = solrDocs.slice(i, i + batchSize);
      await solrClient.add(batch);
      console.log(`Indexed ${i + batch.length} of ${solrDocs.length} documents`);
    }

    // Commit changes
    await solrClient.commit();
    console.log('Indexing complete');

    // Close MongoDB connection
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error indexing medicines:', err);
  }
};

// Run indexing
indexMedicines();