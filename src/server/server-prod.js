require("dotenv").config()
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
import validateInput from "../javascript/validation"

const port = process.env.PORT || 3000

const app = express()
const  DIST_DIR = __dirname
//Sets initial index root directory
const HTML_FILE = path.join(DIST_DIR, 'index.html')
            
app.use(express.static(DIST_DIR));
//required to parse req.body in post request
app.use(bodyParser.urlencoded({ extended: true }))

//On opening homepage, or requests to any other pages
app.get("/", (req, res) => {   
    return res.sendFile(HTML_FILE)
})

// //When user submits contact form, confirm data again, and send email
// app.post("/contact", confirmInput, sendEmail)

// //Temporary: Any 'other' routes - redirect back to the main page. Will add 404 later.
// app.get("*", (req,res) => {
//   res.redirect("/")
// })

// //verifies that all form data is valid before calling sendEmail
// function confirmInput(req, res, next){

//   try {
//     const { name, email, message } = req.body
//     if(validateInput("name", name) && validateInput("email", email) && validateInput("message", message)){
//       next()
//     } else {
//       res.sendStatus(400)
//     }
//   } catch (error) {
//     res.sendStatus(error.responseCode || 500)    
//   } 
// }


// //Called if form input is valid. Gets email and pw from .env and sends form data w/ nodemailer
// async function sendEmail(req, res) {
//   try {
//     //Create an instance of transporter object
//     const { name, email, message } = req.body
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USERNAME, //
//         pass: process.env.EMAIL_PASSWORD, //
//       },
//     })

//     const mailOptions = {
//       from: email, // sender address
//       to: process.env.EMAIL_USERNAME, // list of receivers
//       subject: `${name} visited your portfolio!`, // Subject line
//       text: email + " sent the following: \n" + message, // plain text body
//     }

//     // send mail with defined transport object
//     let info = await transporter.sendMail(mailOptions)
//     res.sendStatus(200)
//   } catch (error) {

//     res.sendStatus(error.responseCode || 500)
//   }
// }

app.listen(port, () => { 
  console.log("mode: ", process.env.NODE_ENV)
})
