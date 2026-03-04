const router = require("express").Router()
const jwt = require("jsonwebtoken")

const ADMIN_USER = "admin"
const ADMIN_PASS = "imago123"

router.post("/login",(req,res)=>{
  const { username, password } = req.body

  if(username===ADMIN_USER && password===ADMIN_PASS){
    const token = jwt.sign({username}, process.env.JWT_SECRET)
    res.json({ token })
  } else {
    res.status(401).json({ message:"Login gagal" })
  }
})

module.exports = router
