var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = {
  item : new Schema({
    name: String,
    timestamp: { type: Date, default: Date.now },
    data: {
      price: Number,
      frequency: Number,
      coupons: [String],
      food_category: String,
      expiration: Date
    }
  }),

  user : new Schema({
    username: String,
    budget: Number,
    balance: Number,
    list: [{ type: Schema.Types.ObjectId, ref: 'Item'}],
    past_items: [{ type: Schema.Types.ObjectId, ref: 'Item'}]
  })
};


product.find({})