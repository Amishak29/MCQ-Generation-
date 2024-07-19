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

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mcqContent', 'index.html'));
});

app.get('/codeAnalysis/code_analysis.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'codeAnalysis', 'code_analysis.html'));
});

app.get('/codeAnalysis/download_ca', (req, res) => {
  const file = path.join(__dirname, 'codeAnalysis', 'output_zip_files', 'test.zip');
  res.download(file);
});

app.post('/generate', (req, res) => {
  const jsonData = req.body;
  const googleSheetId = jsonData.google_sheet_id;
  delete jsonData.google_sheet_id;

  const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME;
  const parent_json_file_path = path.join(__dirname, 'mcqContent', 'parent_json', `${parent_json_file_name}.json`);
  fs.writeFileSync(parent_json_file_path, JSON.stringify(jsonData, null, 2));

  // Set the Google Sheet ID in the environment variables
  process.env.GOOGLE_SHEET_ID = googleSheetId;

  exec('node mcqContent/generate_prompts.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing generate_prompts.js: ${err}`);
      return res.status(500).send('Error generating prompts.');
    }
    console.log('-----------[GENERATE_PROMPTS]----------')
    exec('node mcqContent/generate_responses.js', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing generate_responses.js: ${err}`);
        return res.status(500).send('Error generating responses.');
      }
      console.log('-----------[GENERATE_RESPONSES]----------')
      exec('node mcqContent/generate_final.js', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error executing generate_final.js: ${err}`);
          return res.status(500).send('Error generating final responses.');
        }
        console.log('-----------[GENERATE_FINAL]----------')
        const final_responses_path = path.join(__dirname, 'mcqContent', 'final_responses', `${parent_json_file_name}_final_responses.json`);
        const finalData = fs.readFileSync(final_responses_path, 'utf8');
        res.json(JSON.parse(finalData));
      });
    });
  });
});

app.post('/generate-prompts', (req, res) => {
  console.log('--------------------[RECEIVED]---------------------------');
  const jsonData = req.body;
  const googleSheetId = jsonData.google_sheet_id;
  delete jsonData.google_sheet_id;

  // Write JSON data to the parent JSON file
  const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME_CA;
  const parent_json_file_path = path.join(__dirname, 'codeAnalysis/parent_json', `${parent_json_file_name}.json`);
  fs.writeFileSync(parent_json_file_path, JSON.stringify(jsonData, null, 2));

  // Set the Google Sheet ID in the environment variables
  process.env.GOOGLE_SHEET_ID = googleSheetId;

  exec('node codeAnalysis/generate_prompts.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing generate_prompts.js: ${err}`);
      return res.status(500).send('Error generating prompts.');
    }
    console.log("[generate_prompts.js]");
    exec('node codeAnalysis/generate_responses.js', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing generate_responses.js: ${err}`);
        return res.status(500).send('Error generating responses.');
      }
      console.log("[generate_responses.js]");

      exec('node codeAnalysis/generate_final.js', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error executing generate_final.js: ${err}`);
          return res.status(500).send('Error generating final responses.');
        }
        console.log("[generate_final.js]");

        exec('node codeAnalysis/generate_ca.js', (err, stdout, stderr) => {
          if (err) {
            console.error(`Error executing generate_ca.js: ${err}`);
            return res.status(500).send('Error generating code analysis.');
          }
          console.log("[generate_ca.js]");
        
          exec('node codeAnalysis/generate_zip.js', (err, stdout, stderr) => {
            if (err) {
              console.log(`Error executing generate_zip.js: ${err}`);
              return res.status(500).send('Error generating ZIP file.');
            }
            console.log("[generate_zip.js]");
          
            const final_responses_path = path.join(__dirname, 'codeAnalysis/ca_responses', `${parent_json_file_name}_ca.json`);
            const finalData = fs.readFileSync(final_responses_path, 'utf8');
            res.json(JSON.parse(finalData));
          });
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
