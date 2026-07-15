const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const userModel=require("./models/users")

let app = Express()
      app.use(Express.json())
      app.use(Cors())


      Mongoose.connect("mongodb://ananya_2004:Anyamongo@ac-owpbjf1-shard-00-00.9qx1pdq.mongodb.net:27017,ac-owpbjf1-shard-00-01.9qx1pdq.mongodb.net:27017,ac-owpbjf1-shard-00-02.9qx1pdq.mongodb.net:27017/blogdb?ssl=true&replicaSet=atlas-3dap86-shard-0&authSource=admin&appName=Cluster0")

app.post("/signup", async (req,res) => {

    let input= req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassword)
    req.body.password=hashedPassword

        userModel.find({email:req.body.email}).then(

            (items)=> {

                       if (items.length>0) {

            res.json({"status":"Email ID already exists"})

        } else {

                let result=new userModel(input)
                result.save()
                res.json({"Status":"Success"})

        }


            }

        ).catch(

            (error)=>{}

        )

})

app.listen(3030, () => {

    console.log("Server started")

})