const jwt = require('jsonwebtoken')
const authorModel = require('../models/authorModel.js')
const createAuthor = async function (req, res) {
    try {
        const body = req.body

        let emailId = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email);
        if (!emailId) {
            return res.status(400).send({ message: "invalid email id" })
        }
        let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(req.body.password);
        if (!password) {
            return res.status(400).send({ message: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long" })
        }

        if (body.firstName == undefined || body.firstName == "") {
            return res.status(400).send({ message: "invalid first name" })
        }

        if (body.lastName == undefined || body.lastName == "") {
            return res.status(400).send({ message: "invalid last name" })
        }
        if (body.email == undefined || body.email == "") {
            return res.status(400).send({ message: "invalid email" })
        }
        if (body.password == undefined || body.password == "") {
            return res.status(400).send({ message: "invalid password" })
        }
        if (!['Mr', 'Mrs', 'Miss'].includes(body.title)) {
            return res.status(400).send({ message: "invalid title" })
        }

        const checkExistingUser = await authorModel.findOne({ email: body.email })
        // console.log(checkExistingUser)
        if (checkExistingUser) {
            return res.status(409).send({ message: "user already exists" })
        }

        const userData = await authorModel.create(body)
        if (userData) {
            return res.status(201).send({ status: true, message: "author successfully created", data: userData })
        }
    }
    catch (err) { return res.status(500).send({ Error: "Server not responding", error: err.message }); }
}
const loginAuthor = async function (req, res) {
    try {
        const emailId = req.body.email
        const password = req.body.password
        // console.log(emailId)
        //console.log(password)
        if (emailId == undefined || emailId == null || emailId == "") {
            return res.status(400).send({ message: "email id is required for login" })
        }
        if (password == undefined || password == null || password == "") {
            return res.status(400).send({ message: "password is  required for login" })
        }
        const authorData = await authorModel.findOne({
            email: emailId, password: password
        })
        if (!authorData) {
            return res.status(404).send({ message: " author donot exist" })
        }

        //console.log(authorData)
        let token = jwt.sign(
            {
                authorId: authorData._id.toString(),

            },
            "village-binjhol",
            { expiresIn: "24h" }
        );
        res.setHeader("x-api-key", token);
        return res.status(200).send({ message: "login successful", tokenData: token })
    }
    catch (err) { return res.status(500).send({ Error: "Server not responding", error: err.message }); }
}
module.exports = { createAuthor, loginAuthor }

