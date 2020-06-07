require("dotenv").config()
const nodemailer = require("nodemailer");
const express = require("express");
const webpack = require("webpack");
const bodyParser = require("body-parser");
const path = require("path");
import config from "../../webpack.dev.config.js"
import WebpackDevMiddleware from "webpack-dev-middleware";

const port = process.env.PORT || 3000

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.static(DIST_DIR));
app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

app.get("/", (req, res, next) => {
    console.log("home");
    compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
        if(err) {
            return next(err)
        }
        res.set("content-type", "text/html")
        res.sendStatus(result)
        res.end()
    })

    return res.sendFile(HTML_FILE)
})

app.post("/contact", function(req,res) {
    console.log("form submitted")
    console.log(req.body)
    sendEmail(req.body)
    .then((data) => {
        console.log("email finished");
        res.json({"status": 200});
    })
    .catch(err => {
        console.log(err)
        res.json(err)
    })       
})

async function sendEmail({ name, email, message}) {


    //Create an instance of transporter object 
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME, // 
          pass: process.env.EMAIL_PASSWORD // 
        },
    });

    const mailOptions = {
        from: email, // sender address
        to: process.env.EMAIL, // list of receivers
        subject: `${name} visited your portfolio!`, // Subject line
        text: email + " sent the following: \n" + message, // plain text body
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info
}

app.listen(port, () => {
    console.log(`starting server on port: ${port}`)
    console.log("mode: ", process.env.NODE_ENV)
})