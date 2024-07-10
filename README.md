### Initialization
Installation of nodeJs software from [node](https://nodejs.org/en/download)  
Open this directory in terminal and run `npm install` or `npm i`.    
After the installation of dependencies, run `npm run setup`.  

### Pre-requisities
- After downloading your csv file from your spreadsheet, convert your csv into json file [csv_to_json](https://data.page/csv/json)

### Conditions
- Topic Names to be given as per following convention only:  
for JavaScript - JS  
for Java       - JAVA  
for SQL        - SQL  
for ReactJS    - REACT  
for NodeJS     - NODE  
for HTML       - HTML  
for CSS        - CSS  
for Python     - PYTHON  

### Steps
Step-1:- Now save your obtained json file in **parent_json** directory.  
Step-2:- Replace **parent_json_file_name** variable in .env file.
### To integrate with Google Sheets using the Google Sheets API, you need to set up credentials and access information. Below are the steps to obtain your `GOOGLE_SHEET_ID`, `keyFile`, and `scopes`.

### Step 1: Enable Google Sheets API

1. Go to the [Google Cloud Console](https://console.developers.google.com/).
2. Create a new project (or select an existing one).
3. Enable the **Google Sheets API** for your project:
   - Go to the **API Library** and search for "Google Sheets API".
   - Click on it and then click the "Enable" button.

### Step 2: Create Service Account and Generate Key File

1. In the Google Cloud Console, go to the **Credentials** page:

   - Navigate to `APIs & Services > Credentials`.

2. Create a new service account:

   - Click on **Create credentials** and select **Service account**.
   - Fill in the required details and click **Create**.

3. Assign a role to the service account:

   - Choose **Editor** or **Owner** role, which will allow the service account to read and write to your Google Sheets.

4. Create a JSON key file:
   - Once the service account is created, click on it in the **Service accounts** list.
   - Go to the **Keys** tab and click **Add Key > Create new key**.
   - Select **JSON** format. The JSON file will be downloaded automatically. Save it to a secure location, and note the file path.

### Step 3: Share the Google Sheet with the Service Account

1. Open your Google Sheet.
2. Click on the **Share** button.
3. Add the email of the service account (you can find this in the JSON key file, under the `client_email` field).
4. Give the service account permission to edit the sheet.

### Step 4: Get Your Google Sheet ID

1. Open your Google Sheet in a browser.
2. The URL of the sheet looks like this: `https://docs.google.com/spreadsheets/d/GOOGLE_SHEET_ID/edit#gid=0`.
3. Copy the `GOOGLE_SHEET_ID` part from the URL.

### Step 5: Update Your .env File

Create or update your `.env` file to include the following environment variables:

```
PARENT_JSON_FILE_NAME=your_json_file_name
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_API_KEY=your_azure_api_key
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_KEYFILE_PATH=path/to/your/credentials.json
```

Replace `your_json_file_name`, `your_azure_openai_endpoint`, `your_azure_api_key`, `your_google_sheet_id`, and `path/to/your/credentials.json` with the actual values.

Step 3:- In package.json file under scripts add the "run-all": "node run_all.js" statement.
Step-4:- Run the following command in terminal: ` npm run run-all `.   
Step-5:- You can view your final code in the sheet 

### Post-Works
- Now convert your json into csv file [json_to_csv](https://data.page/json/csv) for Step-6 & 7.  
- Store the csv file (mentioned in Step-6) into **Prompts & Responses (csv)** folder in g-drive.
- Store the csv file (mentioned in Step-7) into **Curation** folder as **SHEET_1** in g-drive.
