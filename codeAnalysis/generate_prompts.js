import fs from "fs";

import { remark } from "remark";

import dotenv from "dotenv";
dotenv.config()

const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME_CA;
const parent_json_file_path = "./codeAnalysis/parent_json/" + parent_json_file_name + ".json";
const prompts_file_path = "./codeAnalysis/prompts_json/" + parent_json_file_name + "_prompts.json";

fs.readFile(parent_json_file_path, "utf8", (readErr, questions_data) => {
  if (readErr) {
    console.error("Error reading the file:", readErr);
    return;
  }

  let questions_data_json = JSON.parse(questions_data);

  fs.readFile("./codeAnalysis/prompt.md", "utf8", (err, prompt) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    questions_data_json.forEach((questionObj) => {
      let subject = questionObj["subject"];
      let no_of_questions=questionObj["no_of_questions"];
      let topic = questionObj["topic"];
      let difficulty_level = questionObj["difficulty_level"];
     
      // let number_of_questions = questionObj["number_of_questions"];

      let description = "";

      let context_prompt = prompt.replace("{{subject}}", subject);
      context_prompt = context_prompt.replace("{{no_of_questions}}", no_of_questions);
      context_prompt = context_prompt.replace("{{topic}}", topic);
      context_prompt=context_prompt.replace("{{difficulty_level}}",difficulty_level);
      context_prompt = context_prompt.replace("{{subject}}", subject);
      // console.log(context_prompt);
      remark().process(context_prompt, (err, file) => {
        if (err) throw err;
        description = String(file);
      });

      questionObj.prompt = context_prompt;
    });

    const updatedJsonData = JSON.stringify(questions_data_json, null, 2);

    fs.writeFile(prompts_file_path, updatedJsonData, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }

      console.log("Questions With Prompts JSON file updated successfully");
    });
  });
});
