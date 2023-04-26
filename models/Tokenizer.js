"use strict";

// const max_token = 500;
// const maxToken = 4000;
const assert = require("node:assert");
const { get_encoding, encoding_for_model } = require("@dqbd/tiktoken");
// const encoder = encodingForModel("gpt-3.5-turbo");

class Tokenizer {
  constructor() {
    this.tokenizer = get_encoding("cl100k_base");
    this.df = "";
  }

  async setDataForTokenizer(data) {
    this.df = pd.DataFrame(data, (columns = ["fname", "text"]));
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

    for (sentence in sentences) {
      nTokens.push(this.tokenizer.encode(" " + sentence).length);
    }

    for (let i = 0; i < nTokens.length; i++) {
      if (token_so_far + nTokens[i] > max_token) {
        chunks.push("" + chunk);
        chunk = [];
        token_so_far = 0;
      }
      if (nTokens[i] > max_token) {
        continue;
      }

      chunk.push(sentence[i]);
      token_so_far += nTokens[i] + 1;
    }

    chunks.push("" + chunk);
    return chunks;
  }

  async getTokenData(max_tokens) {
    let shortened = [];

    // 반복
    for (let i = 0; i < this.df.shape[0]; i++) {
      // let person = {};
      // person.name = df.iloc({rows: [i]})["Nome"].values[0];
      // person.email = df.iloc({rows: [i]})["Email"].values[0];
      // person.phone = df.iloc({rows: [i]})["Telefone"].values[0];
      // person.created_at = df.iloc({rows: [i]})["Data"].values[0];
      if (!df.iloc({ rows: [i] })["text"].values[0]) continue;

      if (df.iloc({ rows: [i] })["n_tokens"].values[0] > max_tokens)
        shortened.push(
          ...this._splitStrIntoMany(df.iloc({ rows: [i] })["text"].values[0])
        );
      else shortened.push(df.iloc({ rows: [i] })["text"].values[0]);
    }

    return shortened;
  }
}

module.exports = Tokenizer;
