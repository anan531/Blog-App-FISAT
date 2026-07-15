const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const userModel=require("./models/users")
const postModel = require("./models/posts")

let app = Express()
      app.use(Express.json())
      app.use(Cors())


      Mongoose.connect("mongodb://ananya_2004:Anyamongo@ac-owpbjf1-shard-00-00.9qx1pdq.mongodb.net:27017,ac-owpbjf1-shard-00-01.9qx1pdq.mongodb.net:27017,ac-owpbjf1-shard-00-02.9qx1pdq.mongodb.net:27017/blogdb?ssl=true&replicaSet=atlas-3dap86-shard-0&authSource=admin&appName=Cluster0")

app.post("/viewmypost", async (req,res) => {
    let input= req.body
    let token=req.headers.token

    jwt.verify(token,"blogApp",async (error,decoded)=>{

            if (decoded && decoded.email){
                postModel.find(input).then(
                    (items)=>{
                        res.json(items)
                    }
                ).catch(
                    (error)=>{

                        res.json({"status":error})
                    })

            }else{

                res.json({"status":"Invalid Authentication"})
            }



})
  

})


app.post("/viewall", async (req,res) => {

    let token=req.headers.token

    jwt.verify(token,"blogApp",async (error,decoded)=>{

            if (decoded && decoded.email){
                postModel.find().then(
                    (items)=>{
                        res.json(items)
                    }
                ).catch(
                    (error)=>{

                        res.json({"status":"error"})
                    })

            }else{

                res.json({"status":"Invalid Authentication"})
            }



})
  

})

app.post("/create", async (req,res) => {
    let input= req.body

    let token=req.headers.token

    jwt.verify(token,"blogApp",async (error,decoded)=>{

            if (decoded && decoded.email){

                let result=new postModel(input)
                await result.save()

                            return res.json({status: "Post Created Successfully"})

            }else{

                res.json({"status":"Invalid Authentication"})
            }
    })


})




app.post("/signin", async (req,res) => {

    let input= req.body
    let result = userModel.find({email:req.body.email}).then(

        (items)=>{

            if(items.length>0){

                const passwordValidator=Bcrypt.compareSync(req.body.password,items[0].password)

                if (passwordValidator){

                        jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                            (error,token)=>{

                            if (error) {

                                    res.json({"status":"error","errorMessage":error})

                            } else {

                                    res.json({"status":"success","token":token,"userId":items[0]._id})

                            }
})


                } else {

                        res.json({"status":"Incorrect Password"})

                }


            } else {

                res.json({"status":"Invalid Email ID"})

            }

        }

    ).catch()


})




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