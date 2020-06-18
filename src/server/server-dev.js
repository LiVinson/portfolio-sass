require("dotenv").config()
import nodemailer from "nodemailer"
import express from "express"
import bodyParser from "body-parser"
import webpack from "webpack"
import path from "path"
import config from "../../webpack.dev.config.js"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import validateInput from "../javascript/validation"

const port = process.env.PORT || 3000

const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, "index.html"),
  compiler = webpack(config)

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
)

app.use(
  webpackHotMiddleware(compiler, {
    log: false,
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000,
  })
)

//required to parse req.body in post request
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set("content-type", "text/html")
    res.sendStatus(result)
    res.end()
  })
})

app.post("/contact", confirmInput, sendEmail)

//verifies that all form data is valid before calling sendEmail
function confirmInput(req, res, next){
  try {
    const { name, email, message } = req.body
    if(validateInput("name", name) && validateInput("email", email) && validateInput("message", message)){
      console.log("input valid")
      next()
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(error.responseCode || 500)    
  } 
}

//Called if form input is valid. Gets email and pw from .env and sends form data w/ nodemailer
async function sendEmail(req, res) {
  console.log("send email")
  try {
    //Create an instance of transporter object
    console.log(req.body)
    const { name, email, message } = req.body
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME, //
        pass: process.env.EMAIL_PASSWORD, //
      },
    })

    const mailOptions = {
      from: email, // sender address
      to: process.env.EMAIL_USERNAME, // list of receivers
      subject: `${name} visited your portfolio!`, // Subject line
      text: email + " sent the following: \n" + message, // plain text body
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId)
    res.sendStatus(200)
  } catch (error) {
    console.log("error")
    console.log(error)
    console.log(error.response)
    res.sendStatus(error.responseCode || 500)
  }
}

app.listen(port, () => {
  console.log(`starting server on port: ${port}`)
  console.log("mode: ", process.env.NODE_ENV)
})
