require("dotenv").config()

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

//required to parse req.body in post request
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      console.log(err)
      return next(err)
    }
    res.set("content-type", "text/html")
    res.sendStatus(result)
    res.end()
  })
})

app.listen(port, () => {
    console.log(`starting server on port: ${port}`)
    console.log("mode: ", process.env.NODE_ENV)
  })
