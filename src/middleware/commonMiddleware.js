const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel.js");
const authorModel=require("../models/authorModel.js")
const authentication=  async  function(req,res,next){

    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, msg: "token must be present" });
    }
    let decodedToken = jwt.verify(token, "village-binjhol",
    async function(err, decodedToken) {
       if (!decodedToken){
           return res.send({ status: false, msg: "token is invalid" });
         }else if(err==null) {
            console.log(decodedToken.authorId)
            req.body.authorId=decodedToken.authorId
                  next()

               }
        });
    }
    module.exports={authentication}