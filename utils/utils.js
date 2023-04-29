function normalize(vector) {
  // 벡터 정규화 공식
  let sum_square = 0;
  for (let i in vector) {
    sum_square += vector[i] * vector[i];
  }

  return Math.sqrt(sum_square);
}

// function cosine_similarity(df) {
//   //this.df.iloc({ rows: [i] })["text"].values[0]
//   //0번 문서와 다른 모든 문서를 비교해서 코사인 유사도를 구함
//   let cos_sim = [];
//   let zero_row = tfidf.row[1] - tfidf.row[0];
//   let zero_col = [];
//   let zero_data = [];
//   for (let i = 0; i < zero_row; i++) {
//     // 0번 문서의 colmun과 data를 추출
//     zero_col.push(tfidf.col[i]);
//     zero_data.push(tfidf.data[i]);
//   }

//   zero_col.push(df.iloc({ rows: [i] })["text"].values[0]);
//   zero_data.push(tfidf.data[i]);

//   let normalized_zero = normalize(zero_data);

//   for (let i = 0; i < tfidf.numberOfDocuments; i++) {
//     // 전체 문서에 대해
//     let scalar_product = 0;
//     let comp_row = tfidf.row[i + 1];
//     let comp_col = [];
//     let comp_data = [];
//     for (let j = tfidf.row[i]; j < comp_row; j++) {
//       // i번 문서의 colmun과 data를 추출
//       comp_col.push(tfidf.col[j]);
//       comp_data.push(tfidf.data[j]);
//     }

//     // 스칼라곱 구하기 투포인터
//     let zero_poiner = 0;
//     let comp_pointer = 0;
//     let zero_end = zero_data.length - 1;
//     let comp_end = comp_data.length - 1;
//     while (1) {
//       if (zero_poiner > zero_end || comp_pointer > comp_end) {
//         break;
//       }

//       if (zero_col[zero_poiner] === comp_col[comp_pointer]) {
//         scalar_product += zero_data[zero_poiner] * comp_data[comp_pointer];
//         zero_poiner++;
//         comp_pointer++;
//       } else if (zero_col[zero_poiner] < comp_col[comp_pointer]) {
//         zero_poiner++;
//       } else if (comp_col[comp_pointer] < zero_col[zero_poiner]) {
//         comp_pointer++;
//       }
//     }

//     let cos_sim_temp = 0;
//     if (scalar_product === 0) {
//       // 스칼라곱이 0이면 코사인 유사도는 0
//       cos_sim_temp = 0;
//     } else {
//       // 스칼라곱이 0이 아니면 코사인 유사도 공식 사용
//       cos_sim_temp = scalar_product / (normalized_zero * normalize(comp_data));
//       cos_sim_temp = Number(cos_sim_temp.toFixed(4));
//     }

//     let cos_sim_obj = {
//       id: i,
//       similarity: cos_sim_temp,
//     };
//     cos_sim.push(cos_sim_obj);
//   }

//   // 유사도 오름차순 정렬
//   cos_sim.sort(function (a, b) {
//     return b.similarity - a.similarity;
//   });

//   // 상위 5개의 bid만 추출
//   let top5_cos_sim_id = [];
//   for (let i = 1; i < 6; i++) {
//     console.log(cos_sim[i]);
//     top5_cos_sim_id.push(cos_sim[i].id);
//   }

//   return top5_cos_sim_id;
// }

function dotp(x, y) {
  function dotp_sum(a, b) {
    return a + b;
  }
  function dotp_times(a, i) {
    return x[i] * y[i];
  }
  return x.map(dotp_times).reduce(dotp_sum, 0);
}

function cosineSimilarity(A, B) {
  var similarity = dotp(A, B) / (Math.sqrt(dotp(A, A)) * Math.sqrt(dotp(B, B)));
  return similarity;
}

// var array1 = [1,2,2,1];
// var array2 = [1,3,2,0];

// var p = cosineSimilarity(array1,array2);

module.exports = {
  // cosine_similarity,
  cosineSimilarity,
};
