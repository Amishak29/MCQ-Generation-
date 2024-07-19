### Initialization
Installation of nodeJs software from [node](https://nodejs.org/en/download)  
Open this directory in terminal and run `npm install` or `npm i`.    
After the installation of dependencies, run `npm run setup`.  


### Step 1: Update Your .env File

Create or update your `.env` file to include the following environment variables if not present in all the folders:

```
API_KEY = "INPUT_API_KEY_HERE"
PARENT_JSON_FILE_NAME = "abc" //if file name is changed then update accordingly 
PARENT_JSON_FILE_NAME_CA = "test" //if file name is changed then update accordingly
AZURE_OPENAI_ENDPOINT="INPUT_YOUR_ENDPOINT_HERE"

```

Replace `your_json_file_name`, `your_azure_openai_endpoint`, `your_azure_api_key`.

Step 1:- In this directory run 'node server.js'.
Step 2:- If not opened automatically then open http://localhost:3000/ to run locally



