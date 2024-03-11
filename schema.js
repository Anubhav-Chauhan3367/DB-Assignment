// schema.js

const mongoose = require('mongoose');

// Define the ProductCategory schema
const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  desc: { type: String },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});

// Define the Discount schema
const discountSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  desc: { type: String },
  discount_percent: { type: Number, required: true },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});

// Define the Inventory schema
const inventorySchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});

// Define the Product schema with validation for category_id

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String },
  SKU: { type: String, unique: true },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ProductCategory' // Reference the ProductCategory model
  },
  inventory_id: { 
	  type: mongoose.Schema.Types.ObjectId,
	  required: true,
	  ref: 'Inventory'  // Reference the Inventory model
  },
  price: { type: Number, required: true },
  discount_id: { 
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Discount'
  },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});

//  pre-save middleware to validate category existence
productSchema.pre('save', async function(next) {
  const ProductCategory = mongoose.model('ProductCategory');
  const validCategory = await ProductCategory.findById(this.category_id);
  if (!validCategory) {
    throw new Error('Invalid category ID');
  }
  next();
});

module.exports = {
  ProductCategory: mongoose.model('ProductCategory', productCategorySchema),
  Product: mongoose.model('Product', productSchema),
  Discount: mongoose.model('Discount', discountSchema),
  Inventory: mongoose.model('Inventory', inventorySchema)
};
