const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
  service: String,
  price: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Order", OrderSchema)
