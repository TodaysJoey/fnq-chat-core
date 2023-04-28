"use strict";

const { Configuration, OpenAIApi } = require("openai");
const dfd = require("danfojs-node");
const tf = require("@tensorflow/tfjs-node");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const fs = require("fs"); // 임베딩 된 결과가 적힌 파일을 읽기 위해

class Embedding {
  constructor() {}

  async runEmbedding(shortenedData) {
    console.log("RUN EMBEDDING");
    // 응답 시간이 오래걸리니, 이전에 응답 받아두었던 내용이 있는 파일을 읽어서 보낸다.

    // let response = await openai.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input: shortenedData,
    // });

    const jsonFile = fs.readFileSync("./new_embed.json", "utf-8");
    let response = JSON.parse(jsonFile);

    // console.log(response.data[0]);
    // return response.data[0];    // 실제로는 이렇게 넘기면 되는데.
    return response.data.data; // 파일 읽는 건 이렇게 넘기도록 파일을 구성해둠.

    // response format
    //   {
    //     "object": "list",
    //     "data": [
    //       {
    //         "object": "embedding",
    //         "embedding": [
    //           0.0023064255,
    //           -0.009327292,
    //           .... (1536 floats total for ada-002)
    //           -0.0028842222,
    //         ],
    //         "index": 0
    //       }
    //     ],
    //     "model": "text-embedding-ada-002",
    //     "usage": {
    //       "prompt_tokens": 8,
    //       "total_tokens": 8
    //     }
    //   }
  }
}

module.exports = Embedding;
