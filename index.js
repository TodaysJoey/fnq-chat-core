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
const Completion = require("./models/Completion");
const Util = require("./utils/utils");

// 임시로 콘솔에서 입력받기 위해 import
const readline = require("readline");

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

  // TODO 파일읽기 외에 크롤링으로 읽어왔을 때 고려해야 함
  let codeFileStr = fs.readFileSync("result_copy.txt", "utf-8");
  let codeContents = JSON.parse(codeFileStr);

  resultContents["code"] = [];

  for (let i = 0; i < resultContents["fname"].length; i++) {
    let codeStr = "";
    let _idx = codeContents["fname"].indexOf(resultContents["fname"][i]);
    if (_idx > -1) {
      codeStr = codeContents["text"][_idx].replace("Original Source\n", "");
    }

    resultContents["code"].push(codeStr);
  }

  const dfCreator = new DataFrame();
  let dfd = dfCreator.getDataFrame(resultContents); // 여기에 크롤링 결과인 json 데이터를 전달
  console.log("Success Create DataFrame.");

  // Tokenizer 처리 임시 주석
  let tokenCreator = new Tokenizer();
  dfd = await tokenCreator.setDataForTokenizer(resultContents);
  let tokenedData = await tokenCreator.getTokenData(dfd, 500);

  console.log("Success Create Tokened Data.");

  let embedder = new Embedding();
  let tempEmbedDataArr = await embedder.runEmbedding(tokenedData);
  // console.log(embedRes.data.data);

  //embedRes["data"]["data"][0] < 오브젝트 배열
  //오브젝트 배열 내 embedding 만 배열로 뽑아서 add

  // let tempEmbedDataArr = embedRes.map((el) => {
  //   return el.embedding;
  // });

  dfd.addColumn("embeddings", tempEmbedDataArr, {
    inplace: true,
  });
  dfCreator.makeToCSV(dfd, true, "./processed/embeddings.csv");

  console.log("확인용");
  dfd.head(3).print(); // 확인용

  // 임베딩이 포함된 파일을 dataframe화
  // dfd = dfCreator.readFromCSV("./processed/embeddings.csv");

  console.log("done");

  // 질문 입력 받기
  // FIXME 화면에서 입력받도록 수정
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let question = "";

  rl.on("line", (line) => {
    console.log("input: ", line);
    question = line;
    rl.close();
  });

  rl.on("close", () => {
    process.exit();
  });

  let qEmbedding = await embeddgetEmbedding(question);
  let similarities = [];

  for (let embed of tempEmbedDataArr) {
    let similarity = Util.cosineSimilarity(
      // dfd.iloc({ rows: [i] })["embeddings"].values[0],
      embed,
      qEmbedding
    );
    similarities.push(similarity);
  }

  dfd.addColumn("similarities", similarities, {
    inplace: true,
  });

  dfd.sortValues("similarities", { ascending: false, inplace: true });
  let res = dfd.head(3);
  res.print(); // 확인용

  let topScoreText = res.iloc({ rows: [0] })["text"].values[0];
  let resCompl = new Completion(question, topScoreText);
  let resComplResult = await resCompl.getCompletionRes();
  console.log(resComplResult.data.choices[0].text); // 최종 답변
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
