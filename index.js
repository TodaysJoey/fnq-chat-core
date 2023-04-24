// const { Builder, By, Key, until } = require("selenium-webdriver");
// const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const reulstFileName = "result.txt";
var resultContents = new Map();

var express = require("express");
var app = express();

const Crawler = require("./models/Crawler");

// app.use(express.static(__dirname + "/ws-guide/build"));

// app.get("/", (req, res) => {
//   res.sendFile("index.html"); // static 폴더로, react 프로젝트 내 build 디렉토리를 잡아주었으므로, 경로 생략 가능
// });

// app.listen(3000, "0.0.0.0", () => {
//   console.log("Server is running : port 3000");
//   let tempMap = resultContents.entries();

//   if (!tempMap.next().value) {
//     runCrawler();
//   }
// });

let runCrawler = () => {
  const crawler = new Crawler(reulstFileName);
  let result = crawler.run();

  if (!!result) {
  } else {
  }
};

// run();
runCrawler();
