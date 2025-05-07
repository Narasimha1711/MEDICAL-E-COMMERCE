// const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const OrderSchema = new mongoose.Schema({
//     orderId: {
//         type: Number,
//         unique: true
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true
//     },
//     deliveryDate: { 
//         type: Date 
//     },
//     products: [{
//         _id: { type: mongoose.Schema.Types.ObjectId, required: true },
//         name: { type: String, required: true },
//         discountedPrice: { type: Number, required: true },
//         count: { type: Number, required: true },
//     }],
//     totalAmount: { 
//         type: Number,
//         required: true
//     },
//     orderStatus: {
//         type: String,
//         default: 'Current',
//     },
// },
// {
//     timestamps: true
// }) 

// OrderSchema.plugin(AutoIncrement, { inc_field: 'orderId', start_seq: 1000});

// const Order = mongoose.model("Order", OrderSchema)
// module.exports = Order

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const chalk = require('chalk');

// Performance monitoring middleware
const performanceMiddleware = function(schema) {
    // Monitor find operations
    schema.pre('find', async function() {
        // Skip logging for explain() queries or when skipPerformanceLog is set
        if (this._explain || this.getOptions().skipPerformanceLog) return;
        
        this._startTime = Date.now();
        this._queryInfo = {
            operation: 'find',
            query: this.getQuery(),
            collection: this.model.collection.name,
            isNonIndexed: this._conditions.$hint && this._conditions.$hint.$natural === 1
        };
    });

    schema.post('find', async function() {
        // Skip logging for explain() queries or when skipPerformanceLog is set
        if (this._explain || this.getOptions().skipPerformanceLog) return;
        
        const endTime = Date.now();
        const timeTaken = endTime - this._startTime;
        
        if (this._queryInfo.isNonIndexed) {
            console.log(chalk.red('\n📊 Database Operation Stats (WITHOUT INDEX):'));
        } else {
            console.log(chalk.green('\n📊 Database Operation Stats (WITH INDEX):'));
        }
        console.log(chalk.blue('Collection:'), chalk.yellow(this._queryInfo.collection));
        console.log(chalk.blue('Operation:'), chalk.yellow(this._queryInfo.operation));
        console.log(chalk.blue('Query:'), chalk.yellow(JSON.stringify(this._queryInfo.query, null, 2)));
        console.log(chalk.blue('Execution Time:'), 
            this._queryInfo.isNonIndexed ? 
            chalk.red(`${timeTaken}ms`) : 
            chalk.green(`${timeTaken}ms`)
        );
    });

    // Monitor findOne operations
    schema.pre('findOne', async function() {
        // Skip logging for explain() queries or when skipPerformanceLog is set
        if (this._explain || this.getOptions().skipPerformanceLog) return;
        
        this._startTime = Date.now();
        this._queryInfo = {
            operation: 'findOne',
            query: this.getQuery(),
            collection: this.model.collection.name,
            isNonIndexed: this._conditions.$hint && this._conditions.$hint.$natural === 1
        };
    });

    schema.post('findOne', async function() {
        // Skip logging for explain() queries or when skipPerformanceLog is set
        if (this._explain || this.getOptions().skipPerformanceLog) return;
        
        const endTime = Date.now();
        const timeTaken = endTime - this._startTime;
        
        if (this._queryInfo.isNonIndexed) {
            console.log(chalk.red('\n📊 Database Operation Stats (WITHOUT INDEX):'));
        } else {
            console.log(chalk.green('\n📊 Database Operation Stats (WITH INDEX):'));
        }
        console.log(chalk.blue('Collection:'), chalk.yellow(this._queryInfo.collection));
        console.log(chalk.blue('Operation:'), chalk.yellow(this._queryInfo.operation));
        console.log(chalk.blue('Query:'), chalk.yellow(JSON.stringify(this._queryInfo.query, null, 2)));
        console.log(chalk.blue('Execution Time:'), 
            this._queryInfo.isNonIndexed ? 
            chalk.red(`${timeTaken}ms`) : 
            chalk.green(`${timeTaken}ms`)
        );
    });
};

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    deliveryDate: { 
        type: Date 
    },
    products: [{
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        discountedPrice: { type: Number, required: true },
        count: { type: Number, required: true },
    }],
    totalAmount: { 
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        default: 'Current',
        index: true
    },
},
{
    timestamps: true,
    indexes: [
        { userId: 1, orderStatus: 1 },
        { createdAt: -1 }
    ]
}) 

// Create compound indexes for common queries
OrderSchema.index({ userId: 1, orderStatus: 1 }); // For user's current/past orders
OrderSchema.index({ orderStatus: 1, createdAt: 1 }); // For order history

// Apply performance monitoring middleware
performanceMiddleware(OrderSchema);

OrderSchema.plugin(AutoIncrement, { inc_field: 'orderId', start_seq: 1000});

const Order = mongoose.model("Order", OrderSchema)
module.exports = Order