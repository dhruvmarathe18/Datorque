// Google Apps Script code for Webinar Registration Form
// Copy this code into a new Google Apps Script project and deploy as a web app

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (create one if it doesn't exist)
    const sheet = getOrCreateSheet();
    
    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Name', 'Email', 'Phone', 'College', 'Timestamp']
      ]);
    }
    
    // Add the new registration data
    const newRow = [
      data.name,
      data.email,
      data.phone,
      data.college,
      new Date().toISOString()
    ];
    
    sheet.appendRow(newRow);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration successful!',
        rowNumber: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  // Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheets ID
  const spreadsheetId = 'YOUR_SPREADSHEET_ID';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName('Webinar Registrations');
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Webinar Registrations');
    }
    
    return sheet;
  } catch (error) {
    // If spreadsheet doesn't exist, create a new one
    const newSpreadsheet = SpreadsheetApp.create('Webinar Registrations');
    const sheet = newSpreadsheet.getActiveSheet();
    
    // Log the new spreadsheet ID so you can update the code
    console.log('New spreadsheet created with ID: ' + newSpreadsheet.getId());
    
    return sheet;
  }
}

// Optional: Function to get registration count
function getRegistrationCount() {
  const sheet = getOrCreateSheet();
  return sheet.getLastRow() - 1; // Subtract 1 for header row
}

// Optional: Function to get recent registrations
function getRecentRegistrations(limit = 10) {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  const startRow = Math.max(2, lastRow - limit + 1);
  
  if (lastRow < 2) return [];
  
  const data = sheet.getRange(startRow, 1, lastRow - startRow + 1, 5).getValues();
  return data.map(row => ({
    name: row[0],
    email: row[1],
    phone: row[2],
    college: row[3],
    timestamp: row[4]
  }));
}

/*
SETUP INSTRUCTIONS:

1. Go to https://script.google.com/
2. Create a new project
3. Replace the default code with this code
4. Update 'YOUR_SPREADSHEET_ID' with your actual Google Sheets ID
5. Save the project
6. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Choose "Web app" as the type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
7. Copy the web app URL
8. Update your Next.js API route to use this URL instead of the mock implementation

The web app URL will look like:
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

Use this URL in your fetch request in the webinar page.
*/
