"use strict";

const { Configuration, OpenAIApi } = require("openai");
const dfd = require("danfojs-node");
const tf = require("@tensorflow/tfjs-node");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class Embedding {
  constructor() {}

  // const completion = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: "Hello world",
  // });

  // console.log(completion.data.choices[0].text);

  async runEmbedding(shortenedData) {
    console.log("RUN EMBEDDING");
    let response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: shortenedData,
    });

    console.log(response.data);
    return response;
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
