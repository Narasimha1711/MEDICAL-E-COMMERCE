// const mongoose = require('mongoose')

// const MedicineSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },

//     seller: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true
//     },

//     count: {
//         type : Number,
//     },
    
//     price: {
//         type: Number
//     },
//     discountedPrice: {
//         type: Number
//     },
//     discount: {
//         type: Number
//     },
//     description: {
//         type: String
//     },
//     image: {
//         type: String,
//         // required: true
//     },
//     category: {
//         type: String
//     },
//     location: {
//         type: Array,
//         required: true
//     },
    

// })

// const MedicineModel = mongoose.model('Medicines', MedicineSchema);

// module.exports = MedicineModel;

const mongoose = require('mongoose');
const chalk = require('chalk');

// Performance monitoring middleware
const performanceMiddleware = function(schema) {
    // Monitor find operations
    schema.pre('find', async function() {
        // Skip logging for explain() queries
        if (this._explain) return;
        
        // Track if this is a non-indexed search
        this._isNonIndexedSearch = this.getOptions().forceCollectionScan === true;
        this._useIndex = this.getOptions().useIndex === true;
        
        this._startTime = process.hrtime();
        this._queryInfo = {
            operation: 'find',
            query: this.getQuery(),
            collection: this.model.collection.name
        };
    });

    schema.post('find', async function(docs) {
        // Skip logging for explain() queries
        if (this._explain) return;
        
        const endTime = process.hrtime(this._startTime);
        const timeTakenMs = (endTime[0] * 1000) + (endTime[1] / 1000000);
        
        // Detailed performance logging
        const totalDocuments = await this.model.countDocuments();
        const searchTerm = this._queryInfo.query.name?.$regex || 'ALL';
        
        // Only log if it's explicitly a collection scan or using index
        if (this._isNonIndexedSearch) {
            console.log(chalk.yellow('\n🔍 Search Performance Test (WITHOUT Index)'));
            console.log(chalk.yellow(`Search term: "${searchTerm}"`));
            console.log(chalk.red('\n1. Collection Scan Results:'));
            console.log(chalk.red(`- Total Documents: ${totalDocuments}`));
            console.log(chalk.red(`- Documents Examined: ${totalDocuments}`));
            console.log(chalk.red(`- Matching Documents: ${docs.length}`));
            console.log(chalk.red(`- Execution Time: ${timeTakenMs.toFixed(2)}ms`));
        } else if (this._useIndex) {
            console.log(chalk.yellow('\n🔍 Search Performance Test (WITH Index)'));
            console.log(chalk.yellow(`Search term: "${searchTerm}"`));
            console.log(chalk.green('\n2. Index Search Results:'));
            console.log(chalk.green(`- Total Documents: ${totalDocuments}`));
            console.log(chalk.green(`- Documents Examined: ${docs.length}`));
            console.log(chalk.green(`- Matching Documents: ${docs.length}`));
            console.log(chalk.green(`- Execution Time: ${timeTakenMs.toFixed(2)}ms`));
        }
    });

    // Monitor findOne operations
    schema.pre('findOne', async function() {
        // Skip logging for explain() queries
        if (this._explain) return;
        
        // Track if this is a non-indexed search
        this._isNonIndexedSearch = this.getOptions().forceCollectionScan === true;
        this._useIndex = this.getOptions().useIndex === true;
        
        this._startTime = process.hrtime();
        this._queryInfo = {
            operation: 'findOne',
            query: this.getQuery(),
            collection: this.model.collection.name
        };
    });

    schema.post('findOne', async function(doc) {
        // Skip logging for explain() queries
        if (this._explain) return;
        
        const endTime = process.hrtime(this._startTime);
        const timeTakenMs = (endTime[0] * 1000) + (endTime[1] / 1000000);
        
        // Detailed performance logging
        const totalDocuments = await this.model.countDocuments();
        const searchTerm = this._queryInfo.query.name?.$regex || 'ALL';
        
        // Only log if it's explicitly a collection scan or using index
        if (this._isNonIndexedSearch) {
            console.log(chalk.yellow('\n🔍 Search Performance Test (WITHOUT Index)'));
            console.log(chalk.yellow(`Search term: "${searchTerm}"`));
            console.log(chalk.red('\n1. Collection Scan Results:'));
            console.log(chalk.red(`- Total Documents: ${totalDocuments}`));
            console.log(chalk.red(`- Documents Examined: ${totalDocuments}`));
            console.log(chalk.red(`- Matching Documents: ${doc ? 1 : 0}`));
            console.log(chalk.red(`- Execution Time: ${timeTakenMs.toFixed(2)}ms`));
        } else if (this._useIndex) {
            console.log(chalk.yellow('\n🔍 Search Performance Test (WITH Index)'));
            console.log(chalk.yellow(`Search term: "${searchTerm}"`));
            console.log(chalk.green('\n2. Index Search Results:'));
            console.log(chalk.green(`- Total Documents: ${totalDocuments}`));
            console.log(chalk.green(`- Documents Examined: ${doc ? 1 : 0}`));
            console.log(chalk.green(`- Matching Documents: ${doc ? 1 : 0}`));
            console.log(chalk.green(`- Execution Time: ${timeTakenMs.toFixed(2)}ms`));
        }
    });
};

const medicineSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    image: String,
    category: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    location: {
        type: Array,
        default: []
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Drop existing text indexes first (can only have one text index per collection)
medicineSchema.index({ name: 'text' }, { background: true });

// Create indexes for efficient querying
medicineSchema.index({ category: 1 });  // For category queries
medicineSchema.index({ price: 1, count: 1 });  // For price+count queries
medicineSchema.index({ seller: 1, category: 1 }); // For seller's category view
medicineSchema.index({ name: 1, seller: 1 }, { unique: true }); // Unique compound index

// Create text index with weights and language settings
medicineSchema.index(
    { name: 'text' },
    {
        weights: { name: 10 },
        name: "medicine_text_index",
        default_language: "english",
        language_override: "en"
    }
);

// Ensure indexes are built
medicineSchema.on('index', function(err) {
    if (err) console.error('Index error:', err);
    else console.log('✓ Indexes created successfully');
});

// Apply performance monitoring middleware
performanceMiddleware(medicineSchema);

const MedicineModel = mongoose.model('Medicines', medicineSchema);

module.exports = MedicineModel;
