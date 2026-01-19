const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String }, // store only filename like "jordan4.jpg"
  seeded: Boolean
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
