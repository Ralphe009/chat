
require('dotenv').config()
const { OpenAI} = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

// module.exports.getResponse =

async function get(code){
try {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages:[{role:"user",content:`${code} in json format`}],
    temperature:0,
    max_tokens:1024
  });
  const y = completion.choices;
  const data = completion.choices[0].message.content;
  const x = `${data}`;
  const json = JSON.parse(x);
  console.log(y);
	return json
} catch (error) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.log(error.message);
  }
}
}

module.exports.myTutor = async function get(code){
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:[
            {role: "system", content: "You are a tutor. Your goal is to foster independent learning. You want to help students get the right answer without actually telling them what the answer is. "},
            {role:"user", content:`${code}, Respond in json format of { answer:""}`}
        ],
        temperature:0,
        max_tokens:1024
      });
      const data = completion.choices[0].message;
      const x = `${data}`;
      console.log(data)
;      const json = JSON.parse(x);
      console.log(json);
        return json
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
    }

// get('Whats the best coding language?')


module.exports.getGPT = async function get(code){
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages:[{role:"user",content:`${code}`}],
      temperature:0,
      max_tokens:1024
    });
    const y = completion.choices;
    const data = completion.choices[0].message;
    console.log(y);
    return data
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
  }