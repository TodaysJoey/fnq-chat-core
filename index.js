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

  // TODO 파일이 없거나, 존재하지만 아무것도 없는 빈 파일일 경우에 대한 예외처리 필요
  let tempContents = fs.readFileSync(reulstFileName, "utf-8");
  resultContents = JSON.parse(tempContents);
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
  await tokenCreator.setDataForTokenizer(resultContents);
  let tokenedData = await tokenCreator.getTokenData(500);

  console.log("Success Create Tokened Data.");
  //   # import openai

  // # df_ko['embeddings'] = df_ko.text.apply(lambda x: openai.Embedding.create(input=x, engine='text-embedding-ada-002')['data'][0]['embedding'])
  // # df_ko.to_csv('processed/embeddings_ko.csv')
  // # df_ko.head()

  // 토크나이저 처리 된 데이터를 임베딩하기 전 dataframe에 저장 (우선 보류)
  function changeText(col) {
    return col;
  }
  dfd.apply(() => {}, { axis: 0 });

  let embedder = new Embedding();
  let embedRes = await embedder.runEmbedding(tokenedData);
  // console.log(embedRes.data.data);

  //embedRes["data"]["data"][0] < 오브젝트 배열
  //오브젝트 배열 내 embedding 만 배열로 뽑아서 add

  let tempEmbedDataArr = embedRes.map((el) => {
    return el.embedding;
  });

  // console.log(tempEmbedDataArr);
  let embedDataSeries = dfCreator.getSeries(tempEmbedDataArr);
  dfd.print();

  dfd.addColumn("embeddings", tempEmbedDataArr, {
    inplace: true,
  });
  dfCreator.makeToCSV(dfd, true, "processed/embeddings.csv");

  console.log("확인용");
  dfd.head(3).print(); // 확인용

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
