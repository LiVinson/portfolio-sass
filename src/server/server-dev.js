require("dotenv").config()
import nodemailer from "nodemailer"
import express from "express"
import bodyParser from "body-parser"
import webpack from "webpack"
import path from "path"
import config from "../../webpack.dev.config.js"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"

const port = process.env.PORT || 3001

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

app.post("/contact", sendEmail)

async function sendEmail(req, res) {
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
