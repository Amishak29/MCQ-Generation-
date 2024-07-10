import express from 'express';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.post('/submit-data', (req, res) => {
  // Save data to parent_json
  const data = req.body;
  const fileName = `./parent_json/${process.env.PARENT_JSON_FILE_NAME}.json`;

  fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error saving data');
    }

    // Run the scripts
    exec('node run_all.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing run_all.js:`, error);
        return res.status(500).send('Error processing data');
      }
      console.log(`Output of run_all.js:`, stdout);
      if (stderr) {
        console.error(`Error output of run_all.js:`, stderr);
      }
      res.send('Data processed successfully');
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
