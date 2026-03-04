const router = require("express").Router()
const Order = require("../models/Order")

router.post("/", async (req,res)=>{
  const { service, price } = req.body
  const newOrder = new Order({ service, price })
  await newOrder.save()
  res.json({ message:"Order Saved" })
})

router.get("/", async (req,res)=>{
  const orders = await Order.find().sort({date:-1})
  res.json(orders)
})

module.exports = router
