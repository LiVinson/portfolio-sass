require("dotenv").config()

import express from "express"
import bodyParser from "body-parser"
import webpack from "webpack"
import path from "path"

const port = process.env.PORT || 3001

const app = express()
const DIST_DIR = __dirname
//Sets initial index root directory
const HTML_FILE = path.join(DIST_DIR, "index.html")

app.use(express.static(DIST_DIR))

//On opening homepage, or requests to any other pages
app.get("/", (req, res) => {
  return res.sendFile(HTML_FILE)
})

app.get("*", (req,res) => {
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`starting server on port: ${port}`)
  console.log("mode: ", process.env.NODE_ENV)
})
