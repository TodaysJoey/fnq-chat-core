"use strict";

const { Configuration, OpenAIApi } = require("openai");
const dfd = require("danfojs-node");
const tf = require("@tensorflow/tfjs-node");

const configuration = new Configuration({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// const completion = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "Hello world",
// });

// console.log(completion.data.choices[0].text);

const embedRun = async () => {
  let t1 =
    '<body ev:onpageload="scwin.onpageload"><xf:group class="sub_contents" id="" style=""><xf:group class="ws_example_grp_desc" id="" style=""><w2:textbox escape="false" id="" label="Input의 이벤트 oneditfull 예제입니다.&lt;br/&gt;이벤트 oneditfull는 입력값이 속성 maxByteLength의 설정값과 동일할 때 발생합니다.&lt;br/&gt;이 기능은 입력값이 영문, 숫자이고, 속성 maxByteLength이 설정된 경우만 동작합니다." style=""></w2:textbox></xf:group><xf:group class="example_div_tb_style_wrap" id=""><xf:group class="example_div_tr_style" id="" style=""><w2:textbox class="example_div_th_style" escape="false" id="" label="이벤트 oneditfull 설정" style=""/><xf:group class="example_div_td_style" id="" style=""><w2:textbox class="ws5_example_txt_normal" escape="false" id="" label="입력값이 영문, 숫자이고,&lt;br/&gt;입력값이 4byte에 도달하면 발생됩니다." style=""></w2:textbox><xf:input class="" id="ibx_exam1" style="min-width:120px;" maxByteLength="4" placeholder="maxByteLength : 4" ev:oneditfull="scwin.ibx_exam1_oneditfull"></xf:input></xf:group></xf:group><xf:group class="example_div_tr_style" id="" style=""><xf:group class="example_div_th_style" id="" style=""><w2:span class="mr_def txt_blue" id="" label="로그 확인" style=""/><xf:trigger class="com_example_btn_log_clear" ev:onclick="scwin.btn_clearLog_onclick" id="btn_clearLog" style="" title="로그 삭제" type="button"><xf:label><![CDATA[검색 취소]]></xf:label></xf:trigger></xf:group><xf:group class="example_div_td_style" id="" style=""><xf:textarea class="com_example_txa_log" id="txa_log" spellcheck="false" style="width: 100%;height: 140px;"/></xf:group></xf:group></xf:group></xf:group></body>';

  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: [t1],
  });

  console.log(response);
};

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
