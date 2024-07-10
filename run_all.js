import { exec } from 'child_process';

function runScript(script, callback) {
  exec(`node ${script}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${script}:`, error);
      return callback(error);
    }
    console.log(`Output of ${script}:`, stdout);
    if (stderr) {
      console.error(`Error output of ${script}:`, stderr);
    }
    callback(null);
  });
}

const scripts = [
  'generate_prompts.js',
  'generate_responses.js',
  'generate_final.js'
];

function runAllScripts(scripts) {
  if (scripts.length === 0) {
    console.log('All scripts executed successfully.');
    return;
  }

  const script = scripts.shift();
  runScript(script, (err) => {
    if (err) {
      console.error(`Stopping execution due to error in ${script}.`);
    } else {
      runAllScripts(scripts);
    }
  });
}

runAllScripts(scripts.slice());
