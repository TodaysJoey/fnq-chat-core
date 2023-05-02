"use strict";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class Completion {
  constructor(q, a) {
    let idx = a.indexOf("예제 소스");
    if (idx > -1) {
      a = a.substring(0, idx + 1);
    }

    this.lastSentence =
      "Summarize in Korean. Do not speak in a summarized tone, but speak as if answering a question. Please speak kindly.";

    this.questionFormat = {
      question: q + "\n",
      answer: a.replace(/\n/g, "") + "\n",
    };
  }

  async getCompletionRes() {
    let promptStr =
      "question:" +
      this.questionFormat.question +
      "answer:" +
      this.questionFormat.answer +
      this.lastSentence;
    console.log(promptStr);
    let response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: promptStr,
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(response);
    return response;
    //
  }
}
module.exports = Completion;
