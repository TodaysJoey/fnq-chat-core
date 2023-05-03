// const { Builder, By, Key, until } = require("selenium-webdriver");
// const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const reulstFileName = "result.txt";

var resultContents = {};

var express = require("express");
var app = express();

// const route = require("./routes");

const Crawler = require("./models/Crawler");
const DataFrame = require("./models/DataFrameModel");
const Tokenizer = require("./models/Tokenizer");
const Embedding = require("./models/Embedding");
const Completion = require("./models/Completion");
const Util = require("./utils/utils");

var dfd;
var tempEmbedDataArr;
var embedder;

//app.use(express.static(__dirname + "/ws-guide/build"));
app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded 파싱
// app.use("/", route);

app.get("/", (req, res) => {
  // res.sendFile("index.html"); // static 폴더로, react 프로젝트 내 build 디렉토리를 잡아주었으므로, 경로 생략 가능
  res.send("helloworld");
});

/**
 * @path {POST} http://localhost:3000/chat/call
 * @description POST Method
 *
 * @request {message: string}
 * @response {message: string}
 *
 */
app.post("/chat/call", async (req, res) => {
  console.log("here");
  console.log(req);
  //req.body.message;
  const { message } = req.body;

  try {
    let replyStr = await createReply(message);
    res.json({ message: replyStr });
  } catch (err) {
    res.status(406).json({
      message: err.message,
    });
  }
});

/**
 * @path {POST} http://localhost:3000/chat/call/code
 * @description POST Method
 *
 * @request {path: string}
 * @response {message: string, path: string}
 *
 */
app.post("/chat/call/code", (req, res) => {
  const { path } = req.body;

  //TODO 파일저장로직
  res.status(200);
});

app.listen(3000, "0.0.0.0", async () => {
  console.log("Server is running : port 3000");

  // TODO 파일이 없거나, 존재하지만 아무것도 없는 빈 파일일 경우에 대한 예외처리 필요
  // 일단 기동되면 크롤링부터 시작한다.
  // 데이터가 없으면 크롤링, 있으면 하지 않고 임베딩.
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
  dfd = dfCreator.getDataFrame(resultContents); // 여기에 크롤링 결과인 json 데이터를 전달
  console.log("Success Create DataFrame.");

  // Tokenizer 처리 임시 주석
  let tokenCreator = new Tokenizer();
  dfd = await tokenCreator.setDataForTokenizer(resultContents);
  let tokenedData = await tokenCreator.getTokenData(dfd, 500);

  console.log("Success Create Tokened Data.");

  embedder = new Embedding();
  tempEmbedDataArr = await embedder.runEmbedding(tokenedData);

  dfd.addColumn("embeddings", tempEmbedDataArr, {
    inplace: true,
  });

  dfCreator.makeToCSV(dfd, true, "./processed/embeddings.csv"); // TODO 동작 확인

  console.log("Embedding Result ----------------------------");
  dfd.head(3).print(); // 확인용

  // let question = "";

  // rl.on("line", (line) => {
  //   console.log("input: ", line);
  //   question = line;
  //   rl.close();
  // });

  // rl.on("close", () => {
  //   process.exit();
  // });

  // let qEmbedding = await embedder.getEmbedding(question);
  // let similarities = [];

  // for (let embed of tempEmbedDataArr) {
  //   let similarity = Util.cosineSimilarity(
  //     // dfd.iloc({ rows: [i] })["embeddings"].values[0],
  //     embed,
  //     qEmbedding
  //   );
  //   similarities.push(similarity);
  // }

  // dfd.addColumn("similarities", similarities, {
  //   inplace: true,
  // });

  // dfd.sortValues("similarities", { ascending: false, inplace: true });
  // let res = dfd.head(3);
  // res.print(); // 확인용

  // let topScoreText = res.iloc({ rows: [0] })["text"].values[0];
  // let resCompl = new Completion(question, topScoreText);
  // let resComplResult = await resCompl.getCompletionRes();
  // console.log(resComplResult.data.choices[0].text); // 최종 답변
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

const createReply = async (question) => {
  let qEmbedding = await embedder.getEmbedding(question);
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

  return resComplResult.data.choices[0].text;
};

module.exports = { createReply };
