const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to user
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Inventory", InventorySchema);