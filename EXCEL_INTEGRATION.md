# Excel Integration for Webinar Registrations

## 📊 Overview

The webinar registration system now saves all student data to a physical Excel file instead of Google Sheets. This provides better data control and offline access to registration information.

## 🗂️ File Structure

```
datorque-website/
├── data/
│   └── webinar-registrations.xlsx  # Main Excel file (auto-created)
├── src/
│   ├── lib/
│   │   └── excel-utils.ts          # Excel management utilities
│   ├── app/
│   │   ├── api/
│   │   │   └── webinar-registration/
│   │   │       └── route.ts        # API endpoint for registrations
│   │   └── admin/
│   │       └── page.tsx            # Admin dashboard
│   └── ...
```

## 🚀 Features

### ✅ Excel File Management
- **Auto-creation**: Excel file is created automatically on first registration
- **Auto-updates**: File is updated every time a student registers
- **Data validation**: Email format, phone number, and duplicate checking
- **Registration numbers**: Sequential numbering for each registration

### ✅ Data Storage
- **Location**: `data/webinar-registrations.xlsx`
- **Format**: Professional Excel format with proper column widths
- **Headers**: Registration Number, Name, Email, Phone, College, Timestamp, Source
- **Backup**: File persists between server restarts

### ✅ Admin Dashboard
- **URL**: `/admin` (accessible at your-domain.com/admin)
- **Real-time stats**: Total, today, and weekly registration counts
- **College breakdown**: See registrations by college/university
- **Recent registrations**: View latest registrations in a table
- **Export CSV**: Download data for external analysis

## 📋 Excel File Columns

| Column | Description | Example |
|--------|-------------|---------|
| Registration Number | Sequential ID | 1, 2, 3... |
| Name | Student's full name | John Doe |
| Email | Email address | john@example.com |
| Phone | Phone/WhatsApp number | +1234567890 |
| College | University/College name | MIT |
| Timestamp | Registration date/time | 2024-01-15T10:30:00Z |
| Source | Registration source | webinar-landing-page |

## 🛠️ How It Works

### 1. Student Registration
1. Student fills out the webinar form
2. Data is validated (email format, phone format, duplicates)
3. Registration is saved to Excel file
4. Student receives confirmation
5. Admin dashboard updates automatically

### 2. Excel File Updates
- File is created automatically if it doesn't exist
- New registrations are appended to the file
- Data is properly formatted and organized
- Column widths are optimized for readability

### 3. Admin Access
- Visit `/admin` to view all registrations
- See real-time statistics and trends
- Export data as CSV for analysis
- Refresh data to see latest registrations

## 📊 API Endpoints

### POST `/api/webinar-registration`
Registers a new student for the webinar.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "college": "MIT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful!",
  "data": {
    "registrationNumber": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "college": "MIT",
    "timestamp": "2024-01-15T10:30:00Z",
    "source": "webinar-landing-page",
    "totalRegistrations": 1
  }
}
```

### GET `/api/webinar-registration`
Gets registration statistics and recent registrations.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "today": 12,
    "thisWeek": 45,
    "collegeStats": {
      "MIT": 25,
      "Stanford": 20,
      "Harvard": 15
    },
    "recentRegistrations": [...]
  }
}
```

## 🔧 Configuration

### Excel File Location
The Excel file is stored in the `data/` directory. You can change this by modifying the `filePath` in `src/lib/excel-utils.ts`:

```typescript
this.filePath = path.join(process.cwd(), 'data', 'webinar-registrations.xlsx');
```

### Data Validation
Email and phone validation can be customized in `src/app/api/webinar-registration/route.ts`:

```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
```

## 📈 Benefits Over Google Sheets

1. **No API Limits**: No rate limiting or quota restrictions
2. **Offline Access**: Excel file works without internet
3. **Data Privacy**: Data stays on your server
4. **Custom Formatting**: Full control over Excel formatting
5. **No Dependencies**: No external service required
6. **Backup Control**: Easy to backup and version control
7. **Performance**: Faster than API calls to Google Sheets

## 🚨 Important Notes

1. **File Permissions**: Ensure the `data/` directory has write permissions
2. **Backup**: Regularly backup the Excel file
3. **Server Restart**: File persists between server restarts
4. **Concurrent Access**: File is locked during writes to prevent corruption
5. **Error Handling**: Failed registrations are logged and handled gracefully

## 🔍 Troubleshooting

### Excel File Not Created
- Check if `data/` directory exists and has write permissions
- Look at server console for error messages
- Ensure XLSX library is properly installed

### Registration Fails
- Check form validation errors
- Verify email format and phone number format
- Check for duplicate email addresses
- Look at server logs for detailed error messages

### Admin Dashboard Issues
- Ensure API endpoints are working
- Check browser console for JavaScript errors
- Verify data directory permissions

## 📞 Support

If you encounter any issues with the Excel integration:

1. Check the server console for error messages
2. Verify file permissions in the `data/` directory
3. Test the API endpoints directly
4. Check the admin dashboard for data display issues

The system is designed to be robust and handle errors gracefully, but proper server configuration is essential for smooth operation.
