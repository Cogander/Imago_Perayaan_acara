require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.use("/api/orders", require("./routes/orderRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))

app.listen(5000, ()=>console.log("Server running on port 5000"))
