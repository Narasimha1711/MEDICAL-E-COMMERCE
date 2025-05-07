const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    deliveryDate: {
      type: Date,
    },
    products: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        discountedPrice: { type: Number, required: true },
        count: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "Current",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.plugin(AutoIncrement, { inc_field: "orderId", start_seq: 1000 });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
