const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    username: {
        type : String,
        required: true,
    },
    password: {
        type : String,
        required: true,
    },
    location: {
        type: Array,
        required: true
    },
    cart: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
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
        discountedPrice: {
            type: Number
        },
        discount: {
            type: Number
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        count: {
            type: Number,
            required: true,
            default: 1
        }
        // Add other fields as needed
    }],
    booked: [{
        // _id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true
        // },
        // name: {
        //     type: String,
        //     required: true
        // },
        // seller: {
        //     type: String,
        //     required: true
        // },
        // price: {
        //     type: Number,
        //     required: true
        // },
        // description: {
        //     type: String,
        //     required: true
        // },
        // image: {
        //     type: String,
        // },
        // count: {
        //     type: Number,
        //     required: true
        // }
        // Add other fields as needed
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    }],
    received: [{
        // _id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true
        // },
        // name: {
        //     type: String,
        //     required: true
        // },
        // seller: {
        //     type: String,
        //     required: true
        // },
        // price: {
        //     type: Number,
        //     required: true
        // },
        // description: {
        //     type: String,
        //     required: true
        // },
        // image: {
        //     type: String,
        // }
        // Add other fields as needed

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    }]

}, {
    timestamps: true
}
)

// Add indexes for frequently queried fields
UserSchema.index({ email: 1 }, { unique: true }); // Unique index for email (login)
UserSchema.index({ username: 1 }); // Index for username searches
UserSchema.index({ 'cart._id': 1 }); // Index for cart item lookups
UserSchema.index({ 'booked.orderId': 1 }); // Index for order lookups
UserSchema.index({ 'received.orderId': 1 }); // Index for received orders

// Add query performance logging in development
if (process.env.NODE_ENV === 'development') {
    UserSchema.pre(['find', 'findOne'], function() {
        console.time(`UserQuery-${this.op}`);
    });
    
    UserSchema.post(['find', 'findOne'], function() {
        console.timeEnd(`UserQuery-${this.op}`);
    });
}

const UserModel = mongoose.model('UserSchema', UserSchema);

module.exports = UserModel;



