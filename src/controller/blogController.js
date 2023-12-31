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
        if (req.body.isDeleted == true) {
            req.body.deletedAt = new Date()
        }
        if (req.body.isPublished == true) {
            req.body.publishedAt = new Date()
        }
        console.log(req.body)
        let authorData = await authorModel.findById({ _id: req.body.authorId })
        let blogData = req.body
        let createdBlogData = await blogModel.create(blogData)
        if (createdBlogData) {
            return res.status(201).send({ message: "blog created successfully", data: createdBlogData })
        }
    }
    catch (err) { return res.status(500).send({ Error: "Server not responding", error: err.message }); }
}

const getBlog = async function (req, res) {
    try {

        console.log(req.query)
        if (!req.query.category && !req.query.subCategory && !req.query.tags && !req.query.authorId) {
            let allBlog = await blogModel.find({
                ispublished: true, isDeleted: false
            })
            return res.status(200).send({ message: "succesfully retrived", data: allBlog })
        }
        if (mongoose.Types.ObjectId.isValid(req.query.authorId) == false) return res.status(400).send({ staus: false, Error: "Author Id is Invalid" })
        let filteredBlog = await blogModel.find({
            $or: [
                { authorId: req.query.authorId },
                { category: req.query.category },
                { subCategory: req.query.subCategory },
                { tags: req.query.tags },
            ], isDeleted: false, ispublished: true
        });
        if (filteredBlog.length == 0) {
            return res.status(404).send({ message: "not found", status: false })
        }
        else {
            return res.status(200).send({ message: "blogs found successfully", data: filteredBlog, status: true })
        }


    }
    catch (err) { return res.status(500).send({ Error: "server not responding", error: err.message }); }
}

const updateBlog = async function (req, res) {
    try {
        let authorId = req.body.authorId
        const blogId = req.params.blogId
        if (mongoose.Types.ObjectId.isValid(blogId) == false) { return res.status(400).send({ status: false, message: "invalid blogId" }) }
        if (mongoose.Types.ObjectId.isValid(authorId) == false) { return res.status(400).send({ status: false, message: "invalid authorId" }) }

        let oldBlogData = await blogModel.findOne({ _id: blogId })
        if (!oldBlogData) { return res.status(404).send({ message: "blog not found" }) }

        if (authorId !== (oldBlogData.authorId).toString()) {
            return res.status(401).send({ message: "not authorised" })
        }
        let dataToUpdate = req.body
        if (req.body.ispublished != undefined && req.body.ispublished == true) {
            req.body.publishedAt = new Date()
        }
        let updatedData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: dataToUpdate }, { new: true })
        if (!updatedData) { return res.status(404).send({ status: false, message: "blog is deleted " }) }
        if (updatedData) { return res.status(200).send({ status: true, message: "data updated successfully", data: updatedData }) }

    } catch (err) { return res.status(500).send({ Error: "server not responding", message: err.message }); }

}

const deleteBlog = async function (req, res) {
    try {
        const authorId = req.body.authorId;
        const blogId = req.params.blogId;
        if (mongoose.Types.ObjectId.isValid(blogId) == false) { return res.status(400).send({ status: false, message: "invalid blogId" }) }
        if (mongoose.Types.ObjectId.isValid(authorId) == false) { return res.status(400).send({ status: false, message: "invalid authorId" }) }

        const oldBlogData = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!oldBlogData) { return res.status(404).send({ status: false, message: "blog not found" }) }
        console.log(oldBlogData)

        if (authorId !== oldBlogData.authorId.toString()) { return res.status(401).send({ status: false, message: "not authorized" }) }
        let deletedData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (deletedData) { return res.status(200).send({ status: true, message: "blog deleted successfully", data: deletedData }) }
    }


    catch (err) { return res.status(500).send({ Error: "internal server error", message: err.message }) }
}
module.exports = { createBlog, getBlog, updateBlog, deleteBlog }

