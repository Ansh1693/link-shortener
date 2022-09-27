//jshint esversion:6

const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const short = require("shortid");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/short");

const shortUrl = mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: short.generate,
  },
  clicks: {
    type: Number,
    default: 0,
  },
});

const shorturl = mongoose.model("shortUrl", shortUrl);

app.get("/", (req, res) => {
  var allData;

  shorturl.find(function (err, task) {
    if (!err) res.render("index", { shortUrls: task });
    else console.log(err);
  });
  // console.log(allData);
  // res.render("index", { shortUrls: allData });
});

app.get("/short", (req, res) => {
  res.send("Short!!");
});

app.post("/short", async (req, res) => {
  const fullUrl = new shorturl({ full: req.body.fullUrl });
  const a1 = await fullUrl.save();
  console.log(a1);
  res.redirect("/");
});

app.get("/:shortId", (req, res) => {
  const short = req.params.shortId;

  shorturl.findOne({ short: short }, async (err, long) => {
    if (!err) {
      if (long) {
        long.clicks += 1;
        const a = await long.save();
        console.log(a);
        res.redirect(long.full);
      } else {
        res.sendStatus(404);
      }
    }
  });
});

app.listen(3000, () => {});
