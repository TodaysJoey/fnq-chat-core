"use strict";

// const max_token = 500;
// const maxToken = 4000;
const assert = require("node:assert");
const { get_encoding, encoding_for_model } = require("@dqbd/tiktoken");
const dfd = require("danfojs-node");

// const encoder = encodingForModel("gpt-3.5-turbo");

class Tokenizer {
  constructor() {
    this.tokenizer = get_encoding("cl100k_base");
    this.df = "";
  }

  async setDataForTokenizer(data) {
    let idx = [];
    let cols = ["fname", "text"];
    let dtypes = ["string", "string"];

    this.df = new dfd.DataFrame(data, { idx, cols, dtypes });
    //this.tokenizer.encode()
    let n_tokens = [];

    for (let i = 0; i < this.df.shape[0]; i++) {
      // if (!this.df.iloc({ rows: [i] })["text"].values[0]) n_tokens.push(0)
      n_tokens.push(
        this.tokenizer.encode(this.df.iloc({ rows: [i] })["text"].values[0])
          .length
      );
    }
    this.df.addColumn("n_tokens", n_tokens, {
      inplace: true,
    });

    return this.df;
  }

  getDataForTokenizer() {
    return this.df;
  }

  async _splitStrIntoMany(text, max_token) {
    let sentences = text.split("\\.\n");
    let nTokens = [];
    let chunks = [];
    let token_so_far = 0;
    let chunk = [];

    for (let sentence in sentences) {
      nTokens.push(this.tokenizer.encode(" " + sentence).length);
    }

    for (let i = 0; i < nTokens.length; i++) {
      if (token_so_far + nTokens[i] > max_token) {
        chunks.push(". " + chunk + ".");
        chunk = [];
        token_so_far = 0;
      }
      if (nTokens[i] > max_token) {
        continue;
      }

      chunk.push(sentences[i]);
      token_so_far += nTokens[i] + 1;
    }

    chunks.push(". " + chunk + ".");
    return chunks;
  }

  async getTokenData(dfd, max_tokens) {
    this.df = dfd;

    let shortened = [];

    // 반복
    for (let i = 0; i < this.df.shape[0]; i++) {
      // if (!this.df.iloc({ rows: [i] })["text"].values[0]) continue;

      if (this.df.iloc({ rows: [i] })["n_tokens"].values[0] > max_tokens) {
        let temp = await this._splitStrIntoMany(
          this.df.iloc({ rows: [i] })["text"].values[0]
        );

        shortened.push(...temp);
      } else {
        shortened.push(this.df.iloc({ rows: [i] })["text"].values[0]);
      }
    }

    return shortened;
  }
}

module.exports = Tokenizer;
