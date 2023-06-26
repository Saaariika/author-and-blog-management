const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const middleware = require("../middleware/commonMiddleware.js")



router.post("/createAuthor", authorController.createAuthor)
router.post("/loginAuthor", authorController.loginAuthor)
router.post("/createBlog", middleware.authentication, blogController.createBlog)
router.get("/getBlog",blogController.getBlog)
router.put("/updateBlog/:blogId", middleware.authentication, blogController.updateBlog)
router.delete("/deleteBlog/:blogId", middleware.authentication, blogController.deleteBlog)




module.exports = router;
