"use strict";

const df = require("danfojs-node");
// const tf = require("@tensorflow/tfjs-node");

class DataFrameModel {
  constructor() {}

  getDataFrame(rawData) {
    // return df.DataFrame(rawData, { columns: ["fname", "text"] });
    return new df.DataFrame(rawData);
  }

  makeToCSV(dataFrameObj, isFileDown, filePath) {
    if (isFileDown === true) {
      df.toCSV(dataFrameObj, {
        fileName: filePath,
        download: isFileDown,
      });
      return "save";
    } else {
      // csv형식의 stirng 반환
      return df.toCSV(dataFrameObj);
    }
  }

  makeToJson(dataFrameObj) {
    return df.toJSON(dataFrameObj, { format: "row" });
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
  // readFromJson(path) {
  //   df.readJSON();
  // }
}

module.exports = DataFrameModel;
