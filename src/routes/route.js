const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")

router.post("/createAuthor",authorController.createAuthor)




module.exports = router;
