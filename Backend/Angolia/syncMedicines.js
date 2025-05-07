const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const MedicineModel = require('./models/MedicineModel'); // Adjust path to your MedicineModel

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medical-ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Algolia client
const client = algoliasearch('N7ADFVXWHO', '5c66334238d6abf77f4666de16982a21');
const index = client.initIndex('medicines');

// Sync medicines to Algolia
async function syncMedicines() {
  try {
    const medicines = await MedicineModel.find();
    const algoliaObjects = medicines.map(medicine => ({
      objectID: medicine._id.toString(), // Algolia requires a unique objectID
      name: medicine.name,
      description: medicine.description,
      category: medicine.category,
      price: medicine.price,
      discountedPrice: medicine.discountedPrice,
      discount: medicine.discount,
      count: medicine.count,
      location: medicine.location,
      seller: medicine.seller.toString(),
      image: medicine.image
    }));

    await index.saveObjects(algoliaObjects);
    console.log('Medicines successfully indexed in Algolia');
  } catch (error) {
    console.error('Error indexing medicines:', error);
  } finally {
    mongoose.connection.close();
  }
}

syncMedicines();