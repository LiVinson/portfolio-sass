require("dotenv").config()
import nodemailer from "nodemailer";
import express from "express";
import webpack from "webpack";
import path from "path";
import config from "../../webpack.dev.config.js";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

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

app.use(webpackHotMiddleware(compiler, {
  'log': false, 
  'path': '/__webpack_hmr', 
  'heartbeat': 10 * 1000
}))

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

app.post("/contact", function (req, res) {
  console.log("form submitted")
  console.log(req.body)
  sendEmail(req.body)
    .then((data) => {
      console.log("email finished")
      res.json({ status: 200 })
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

async function sendEmail({ name, email, message }) {
  //Create an instance of transporter object
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, //
      pass: process.env.EMAIL_PASSWORD, //
    },
  })

  const mailOptions = {
    from: email, // sender address
    to: process.env.EMAIL, // list of receivers
    subject: `${name} visited your portfolio!`, // Subject line
    text: email + " sent the following: \n" + message, // plain text body
  }

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)
  console.log("Message sent: %s", info.messageId)
  return info
}

app.listen(port, () => {
  console.log(`starting server on port: ${port}`)
  console.log("mode: ", process.env.NODE_ENV)
})
