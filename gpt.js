require('dotenv').config()
const { OpenAI} = require("openai");
const {readline} = require("readline");
const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


  prompt("What is your name?");
// const userInterface = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

// userInterface.prompt()
// userInterface.on("line", async input => {
//   const response = await openAi.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: input }],
//   })
//   console.log(response.data.choices[0].message.content)
//   userInterface.prompt()
// })