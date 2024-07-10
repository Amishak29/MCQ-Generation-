import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON
app.use(express.json());

// Serve the frontend HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to handle form submission
app.post('/generate', (req, res) => {
  const jsonData = req.body;
  const googleSheetId = jsonData.google_sheet_id;
  delete jsonData.google_sheet_id;

  // Write JSON data to the parent JSON file
  const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME;
  const parent_json_file_path = "./parent_json/" + parent_json_file_name + ".json";
  fs.writeFileSync(parent_json_file_path, JSON.stringify(jsonData, null, 2));

  // Set the Google Sheet ID in the environment variables
  process.env.GOOGLE_SHEET_ID = googleSheetId;


  exec('node generate_prompts.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing generate_prompts.js: ${err}`);
      return res.status(500).send('Error generating prompts.');
    }

    exec('node generate_responses.js', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing generate_responses.js: ${err}`);
        return res.status(500).send('Error generating responses.');
      }

      exec('node generate_final.js', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error executing generate_final.js: ${err}`);
          return res.status(500).send('Error generating final responses.');
        }

        // Send the final responses file to the client
        const final_responses_path = "./final_responses/" + parent_json_file_name + "_final_responses.json";
        const finalData = fs.readFileSync(final_responses_path, 'utf8');
        res.json(JSON.parse(finalData));
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
