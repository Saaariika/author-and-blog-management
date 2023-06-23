const blogModel = require('../models/blogModel.js')
const authorModel = require('../models/authorModel.js')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

const createBlog = async function (req, res) {
    try {
        if (req.body.title == undefined || req.body.title == null || req.body.title == "" || !req.body.title) {
            return res.status(400).send({ message: "tilte is required" })
        }
        if (req.body.body == undefined || req.body.body == null || req.body.body == "" || !req.body.body) {
            return res.status(400).send({ message: "body is required" })
        }
        if (req.body.authorId == undefined || req.body.authorId == null || req.body.authorId == "" || !req.body.authorId) {
            return res.status(400).send({ message: "authorid  is required" })
        }
        if (req.body.tags == undefined || req.body.tags == null || req.body.tags == "" || !req.body.tags) {
            return res.status(400).send({ message: "tags is required" })
        } if (req.body.category == undefined || req.body.category == null || req.body.category == "" || !req.body.category) {
            return res.status(400).send({ message: "category is required" })
        } if (req.body.subCategory == undefined || req.body.subCategory == null || req.body.subCategory == "" || !req.body.subCategory) {
            return res.status(400).send({ message: "sub-Category  is required" })
        }
        if (mongoose.Types.ObjectId.isValid(req.body.authorId) == false) return res.status(400).send({ staus: false, Error: "Author Id is Invalid" })
         if(req.body.isDeleted==true){
            req.body.deletedAt=new Date()
         }
         if(req.body.isPublished==true){
            req.body.publishedAt=new Date()
         }
         console.log(req.body)
         let authorData=await authorModel.findById({_id:req.body.authorId})
         let blogData=req.body
         let createdBlogData=await blogModel.create(blogData)
         if(createdBlogData){
            return res.status(201).send({message:"blog created successfully",data:createdBlogData})
         }
    }
    catch (err) { return res.status(500).send({ Error: "Server not responding", error: err.message }); }
}
module.exports = { createBlog }