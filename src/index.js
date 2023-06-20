const express = require('express');//requiring express(framework used in node js consisting of various in built functions)
const mongoose = require('mongoose');//requiring mongoose for database
const  bodyParser=require('body-parser')
const app = express();//call to express 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://saaariik-sarul:Rahul1991*@cluster0.adxgdju.mongodb.net/test1", {//connecting mongoose to database using string
    useNewUrlParser: true // 
})
    .then(() => {//promise comes into picture  if connection to database is ok then it executed  
        console.log("mongodb is connected")
    })
    .catch((err) => {// if failed then error is catch here
        console.log(err)
    })
    app.get("/test",(async(req,res)=>{
    res.send({message:"my first api string"})
    }))
    app.post("/test",(async(req,res)=>{
        console.log(req.body)
        res.send({message:req.body})
        
        }))
        app.get("/query",(async(req,res)=>{
            console.log(req.query)
            res.send({message:req.query})
            }))
            app.post("/path/:nameId",(async(req,res)=>{
                console.log(req.params)
                res.send({message:req.params})
                
                }))
app.listen(3000, (() => { //bind with host and port and listen for connections
    console.log("server run on port 3000");
}))