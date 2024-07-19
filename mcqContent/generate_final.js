
import fs from "fs";
import { v4 } from "uuid";
import { google } from "googleapis";
import open from "open";
import dotenv from "dotenv";

dotenv.config();

const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME;
const questions_response_path = "./mcqContent/responses_json/" + parent_json_file_name + "_responses.json";
const final_responses_path = "./mcqContent/final_responses/" + parent_json_file_name + "_final_responses.json";
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_KEYFILE_PATH = process.env.GOOGLE_KEYFILE_PATH;

const readFileAsync = async (file, options) =>
  await new Promise((resolve, reject) => {
    fs.readFile(file, options, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });

async function getPromptResponses() {
  try {
    const questions_prompts = await readFileAsync(questions_response_path, "utf8");
    const questions_prompts_json = JSON.parse(questions_prompts);
    return questions_prompts_json;
  } catch (error) {
    console.error("Error reading question prompts:", error);
    throw error;
  }
}

const difficulty_level = {
  "0": "EASY",
  "1": "MEDIUM",
  "2": "HARD"
};

const extractQuestionsData = (prompt_responses) => {
  let final_json_sheet = [];

  prompt_responses.forEach(prompt_response => {
    try{
    const topic_difficulty_level = prompt_response["difficulty_level"];
    const startIndex = prompt_response["prompt_response"].indexOf("[");
    const endIndex = prompt_response["prompt_response"].lastIndexOf("]");
    const prompt_response_json = JSON.parse(prompt_response["prompt_response"].slice(startIndex, endIndex + 1));
    const topicTag = "TOPIC_" + prompt_response["topic"].toUpperCase() + "_MCQ";
    const sourceTag = "SOURCE_" + prompt_response["resource_name"].toUpperCase();
    const subTopicTag = "SUB_TOPIC_" + prompt_response["sub_topic"].toUpperCase();
    let resources = {
      "resource_name": prompt_response["resource_name"],
      "resource_url": prompt_response["resource_url"]
    };

    prompt_response_json.forEach(response => {
      let question_data = {};
      let defaultTagNames = ["POOL_1"];
      // const blooms_difficulty_level = response["difficulty_level"];
      // const question_difficulty_level = Math.max(topic_difficulty_level, blooms_difficulty_level);
      defaultTagNames.push(topicTag);
      defaultTagNames.push(subTopicTag);
      defaultTagNames.push("DIFFICULTY_" + topic_difficulty_level.toUpperCase());
      
      defaultTagNames.push(sourceTag);

      question_data["question_id"] = v4();
      defaultTagNames.push(question_data["question_id"]);
      defaultTagNames.push("IN_OFFLINE_EXAM");
      defaultTagNames.push("COMPANY_UNKNOWN");
      question_data["question_type"] = "MULTIPLE_CHOICE";
      question_data["question_content"] = response["question_content"];
      question_data["short_text"] = "";
      question_data["multimedia_count"] = 0;
      question_data["multimedia_format"] = "";
      question_data["multimedia_url"] = "";
      question_data["thumbnail_url"] = "";
      question_data["Language"] = "ENGLISH";
      question_data["answer_count"] = 4;
      question_data["content_type"] = "TEXT";
      question_data["tag_name_count"] = 8;
      question_data["tag_names"] = "";
      question_data["answer_explanation_content"] = response["answer_explanation_content"];
      question_data["explanation_content_type"] = "TEXT";
      question_data["resource_name"] = resources["resource_name"];
      question_data["resource_url"] = resources["resource_url"];
      final_json_sheet.push(question_data);

      for (let i = 0; i < 8; i++) {
        let tags_data = {};
        tags_data["question_id"] = "";
        tags_data["question_type"] = "";
        tags_data["question_content"] = "";
        tags_data["short_text"] = "";
        tags_data["multimedia_count"] = "";
        tags_data["multimedia_format"] = "";
        tags_data["multimedia_url"] = "";
        tags_data["thumbnail_url"] = "";
        tags_data["Language"] = "";
        tags_data["answer_count"] = "";
        tags_data["content_type"] = "";
        tags_data["tag_name_count"] = "";
        tags_data["tag_names"] = defaultTagNames[i];
        tags_data["answer_explanation_content"] = "";
        tags_data["explanation_content_type"] = "";
        tags_data["resource_name"] = "";
        tags_data["resource_url"] = "";
        final_json_sheet.push(tags_data);
      }

      for (let i = 0; i < 4; i++) {
        let options_data = {};
        let option = Object.keys(response["options"])[i];
        let option_status = response["options"][Object.keys(response["options"])[i]];
        options_data["question_id"] = v4();
        options_data["question_type"] = "";
        options_data["question_content"] = option;
        options_data["short_text"] = "";
        options_data["multimedia_count"] = 0;
        options_data["multimedia_format"] = "";
        options_data["multimedia_url"] = "";
        options_data["thumbnail_url"] = "";
        options_data["Language"] = "ENGLISH";
        options_data["answer_count"] = option_status;
        options_data["content_type"] = "TEXT";
        options_data["tag_name_count"] = "";
        options_data["tag_names"] = "";
        options_data["answer_explanation_content"] = "";
        options_data["explanation_content_type"] = "";
        options_data["resource_name"] = "";
        options_data["resource_url"] = "";
        final_json_sheet.push(options_data);
      }
    });
  }catch{
    console.log(prompt_response)
  }
  });
  console.log("\nWriting into file\n");
  const jsonData = JSON.stringify(final_json_sheet);
  fs.writeFile(final_responses_path, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing the file:', err);
      return;
    }
    console.log('JSON file has been created successfully!');
  });
  return final_json_sheet; // Return the final data
}

async function createNewSheet(auth) {
  const sheets = google.sheets({ version: "v4", auth });

  const request = {
    spreadsheetId: GOOGLE_SHEET_ID,
    resource: {
      requests: [{
        addSheet: {
          properties: {
            title: `Responses ${new Date().toLocaleDateString()}`,
          }
        }
      }]
    }
  };

  try {
    const response = await sheets.spreadsheets.batchUpdate(request);
    const newSheetId = response.data.replies[0].addSheet.properties.sheetId;
    console.log("New sheet created with ID:", newSheetId);
    return newSheetId;
  } catch (error) {
    console.error("Error creating new sheet:", error);
    throw error;
  }
}

async function saveResponsesToGoogleSheet(auth, sheetId, responses) {
  const sheets = google.sheets({ version: "v4", auth });

  const headers = [
    
    "question_id", "question_type", "question_content", "short_text", "multimedia_count",
    "multimedia_format", "multimedia_url", "thumbnail_url", "Language", "answer_count",
    "content_type", "tag_name_count", "tag_names", "answer_explanation_content",
    "explanation_content_type"]

  const values = responses.map(response => headers.map(header => response[header]));

  const resource = {
    values: [headers, ...values],  // Include headers in the values array
  };

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `Responses ${new Date().toLocaleDateString()}!A1`,
      valueInputOption: "RAW",
      resource: resource,  // Use the resource variable here
    });

    console.log("Responses saved to Google Sheet successfully.");
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    throw error;
  }
}

async function start() {
  try {
    const prompt_responses = await getPromptResponses();
    const final_json_sheet = extractQuestionsData(prompt_responses);

    const auth = new google.auth.GoogleAuth({
      keyFile: GOOGLE_KEYFILE_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();

    const newSheetId = await createNewSheet(authClient);
    await saveResponsesToGoogleSheet(authClient, newSheetId, final_json_sheet);

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit#gid=${newSheetId}`;
    await open(sheetUrl);

  } catch (error) {
    console.error("Error during processing:", error);
  }
}
start();

