import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export interface WebinarRegistration {
  name: string;
  email: string;
  phone: string;
  college: string;
  timestamp: string;
  source: string;
  registrationNumber?: number;
}

class ExcelManager {
  private filePath: string;
  private sheetName = 'Webinar Registrations';

  constructor() {
    // Create data directory if it doesn't exist
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      this.filePath = path.join(dataDir, 'webinar-registrations.xlsx');
    } catch (error) {
      console.error('Error setting up data directory:', error);
      // Fallback to a simple path
      this.filePath = path.join(process.cwd(), 'webinar-registrations.xlsx');
    }
  }

  // Initialize Excel file with headers if it doesn't exist
  private initializeFile(): void {
    try {
      if (!fs.existsSync(this.filePath)) {
        const headers = [
          'Registration Number',
          'Name',
          'Email',
          'Phone',
          'College',
          'Timestamp',
          'Source'
        ];

        const worksheet = XLSX.utils.aoa_to_sheet([headers]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, this.sheetName);
        
        // Set column widths
        const colWidths = [
          { wch: 15 }, // Registration Number
          { wch: 25 }, // Name
          { wch: 30 }, // Email
          { wch: 15 }, // Phone
          { wch: 30 }, // College
          { wch: 20 }, // Timestamp
          { wch: 20 }  // Source
        ];
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, this.filePath);
        console.log('Excel file created:', this.filePath);
      }
    } catch (error) {
      console.error('Error initializing Excel file:', error);
      throw new Error('Failed to initialize Excel file');
    }
  }

  // Read existing registrations from Excel file
  private readRegistrations(): WebinarRegistration[] {
    try {
      this.initializeFile();
      
      const workbook = XLSX.readFile(this.filePath);
      const worksheet = workbook.Sheets[this.sheetName];
      
      if (!worksheet) {
        return [];
      }

      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Skip header row and convert to registration objects
      const registrations: WebinarRegistration[] = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i] as unknown[];
        if (row && row.length >= 6) {
          registrations.push({
            registrationNumber: Number(row[0]) || 0,
            name: String(row[1] || ''),
            email: String(row[2] || ''),
            phone: String(row[3] || ''),
            college: String(row[4] || ''),
            timestamp: String(row[5] || ''),
            source: String(row[6] || '')
          });
        }
      }

      return registrations;
    } catch (error) {
      console.error('Error reading Excel file:', error);
      return [];
    }
  }

  // Write registrations back to Excel file
  private writeRegistrations(registrations: WebinarRegistration[]): void {
    try {
      // Prepare data for Excel
      const excelData = [
        ['Registration Number', 'Name', 'Email', 'Phone', 'College', 'Timestamp', 'Source']
      ];

      registrations.forEach(reg => {
        excelData.push([
          reg.registrationNumber || '',
          reg.name,
          reg.email,
          reg.phone,
          reg.college,
          reg.timestamp,
          reg.source
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, this.sheetName);

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Registration Number
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 30 }, // College
        { wch: 20 }, // Timestamp
        { wch: 20 }  // Source
      ];
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(workbook, this.filePath);
      console.log('Excel file updated:', this.filePath);
    } catch (error) {
      console.error('Error writing to Excel file:', error);
      throw error;
    }
  }

  // Add a new registration
  public addRegistration(registration: Omit<WebinarRegistration, 'registrationNumber'>): WebinarRegistration {
    this.initializeFile();
    
    const existingRegistrations = this.readRegistrations();
    const registrationNumber = existingRegistrations.length + 1;
    
    const newRegistration: WebinarRegistration = {
      ...registration,
      registrationNumber
    };

    const updatedRegistrations = [...existingRegistrations, newRegistration];
    this.writeRegistrations(updatedRegistrations);

    return newRegistration;
  }

  // Get all registrations
  public getAllRegistrations(): WebinarRegistration[] {
    this.initializeFile();
    return this.readRegistrations();
  }

  // Get registration count
  public getRegistrationCount(): number {
    this.initializeFile();
    return this.readRegistrations().length;
  }

  // Get recent registrations
  public getRecentRegistrations(limit: number = 10): WebinarRegistration[] {
    this.initializeFile();
    const allRegistrations = this.readRegistrations();
    return allRegistrations
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Check if email already exists
  public emailExists(email: string): boolean {
    this.initializeFile();
    const registrations = this.readRegistrations();
    return registrations.some(reg => 
      reg.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Get registration statistics
  public getStatistics() {
    this.initializeFile();
    const registrations = this.readRegistrations();
    
    const today = new Date();
    const todayRegistrations = registrations.filter(reg => {
      const regDate = new Date(reg.timestamp);
      return regDate.toDateString() === today.toDateString();
    });

    const thisWeekRegistrations = registrations.filter(reg => {
      const regDate = new Date(reg.timestamp);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return regDate >= weekAgo;
    });

    // Group by college
    const collegeStats = registrations.reduce((acc, reg) => {
      const college = reg.college || 'Unknown';
      acc[college] = (acc[college] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: registrations.length,
      today: todayRegistrations.length,
      thisWeek: thisWeekRegistrations.length,
      collegeStats,
      recentRegistrations: this.getRecentRegistrations(5)
    };
  }

  // Export to CSV
  public exportToCSV(): string {
    this.initializeFile();
    const registrations = this.readRegistrations();
    
    const csvData = [
      ['Registration Number', 'Name', 'Email', 'Phone', 'College', 'Timestamp', 'Source']
    ];

    registrations.forEach(reg => {
      csvData.push([
        reg.registrationNumber?.toString() || '',
        reg.name,
        reg.email,
        reg.phone,
        reg.college,
        reg.timestamp,
        reg.source
      ]);
    });

    return csvData.map(row => row.join(',')).join('\n');
  }
}

// Export singleton instance
export const excelManager = new ExcelManager();
