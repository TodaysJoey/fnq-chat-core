// const { Builder, By, Key, until } = require("selenium-webdriver");
// const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const reulstFileName = "result.txt";
var resultContents = {};

var express = require("express");
var app = express();

const Crawler = require("./models/Crawler");
const DataFrame = require("./models/DataFrameModel");
const Tokenizer = require("./models/Tokenizer");
const Embedding = require("./models/Embedding");

app.use(express.static(__dirname + "/ws-guide/build"));

app.get("/", (req, res) => {
  res.sendFile("index.html"); // static 폴더로, react 프로젝트 내 build 디렉토리를 잡아주었으므로, 경로 생략 가능
});

app.listen(3000, "0.0.0.0", async () => {
  console.log("Server is running : port 3000");
  let tempContents = fs.readFileSync(reulstFileName);
  resultContents = JSON.parse(tempContents.toString());
  let tempResKeyArr = Object.keys(resultContents);

  if (tempResKeyArr.length == 0) {
    let rawData = await runCrawler();
    if (rawData === false) {
      console.log("데이터 크롤링에 실패하였습니다.");
      return;
    } else {
      resultContents = rawData;
    }
  }

  const dfCreator = new DataFrame();
  let dfd = dfCreator.getDataFrame(resultContents); // 여기에 크롤링 결과인 json 데이터를 전달

  let tokenCreator = new Tokenizer();
  await tokenCreator.setDataForTokenizer(dfd);
  let tokenedData = await tokenCreator.getTokenData(4000);
  console.log("tokenedData------------------------------");
  console.log(tokenedData);

  dfd = dfCreator.getDataFrame(tokenedData); // 토크나이저 처리 된 데이터를 임베딩하기 전 dataframe화 시킨다
  let embedder = new Embedding();
  let embedRes = await embedder.runEmbedding(tokenedData);

  dfd.addColumn("embeddings", embedRes["data"][0]["embedding"], {
    inplace: true,
  });
  dfCreator.makeToCSV(dfd, true, "processed/embeddings.csv");

  let confirmDf = dfd.head();
  confirmDf.print(); // 확인용

  // 임베딩이 포함된 파일을 dataframe화
  dfd = dfCreator.readFromCSV("./processed/embeddings.csv");

  console.log("done");
});

let runCrawler = async () => {
  const crawler = new Crawler(reulstFileName);
  let crawlerResObj = await crawler.run();

  let resKeyArr = Object.keys(crawlerResObj);
  if (resKeyArr.length != 0) {
    return crawlerResObj;
  } else {
    return false;
  }
};
