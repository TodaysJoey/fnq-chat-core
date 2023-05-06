"use strict";

const df = require("danfojs-node");
// const tf = require("@tensorflow/tfjs-node");

class DataFrameModel {
  constructor() {}

  getDataFrame(rawData) {
    // return df.DataFrame(rawData, { columns: ["fname", "text"] });
    let idx = [];
    let cols = ["fname", "text", "code"];
    let dtypes = ["string", "string", "string"];
    let dfObj = new df.DataFrame(rawData, { idx, cols, dtypes });
    return dfObj;
  }

  getSeries(rawData) {
    return new df.Series(rawData);
  }

  makeToCSV(dataFrameObj, isFileDown, path) {
    if (isFileDown === true) {
      df.toCSV(dataFrameObj, {
        filePath: path,
        header: true,
      });
      return "save";
    } else {
      // csv형식의 stirng 반환
      return df.toCSV(dataFrameObj);
    }
  }

  async makeToJson(dataFrameObj, isDown, path) {
    if (isDown === true) {
      df.toJSON(dataFrameObj, {
        filePath: path,
        format: "row",
      });
      return "save";
    } else {
      let jsonDf = await df.toJSON(dataFrameObj, { format: "row" });
      return jsonDf;
    }
  }

  readFromCSV(path) {
    df.readCSV(path)
      .then((_df) => {
        _df.head().print();
        return _df;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
  // 일단 필요 없을 듯..
  readFromJson(path) {
    df.readJSON(path)
      .then((_df) => {
        _df.head().print();
        return _df;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}

module.exports = DataFrameModel;
