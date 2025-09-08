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

class JSONStorageManager {
  private filePath: string;

  constructor() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      this.filePath = path.join(dataDir, 'webinar-registrations.json');
    } catch (error) {
      console.error('Error setting up data directory:', error);
      this.filePath = path.join(process.cwd(), 'webinar-registrations.json');
    }
  }

  // Read existing registrations from JSON file
  private readRegistrations(): WebinarRegistration[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }

      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return [];
    }
  }

  // Write registrations to JSON file
  private writeRegistrations(registrations: WebinarRegistration[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(registrations, null, 2));
      console.log('JSON file updated:', this.filePath);
    } catch (error) {
      console.error('Error writing to JSON file:', error);
      throw error;
    }
  }

  // Add a new registration
  public addRegistration(registration: Omit<WebinarRegistration, 'registrationNumber'>): WebinarRegistration {
    console.log('JSON Storage: Adding registration', registration);
    const existingRegistrations = this.readRegistrations();
    const registrationNumber = existingRegistrations.length + 1;
    
    const newRegistration: WebinarRegistration = {
      ...registration,
      registrationNumber
    };

    const updatedRegistrations = [...existingRegistrations, newRegistration];
    this.writeRegistrations(updatedRegistrations);

    console.log('JSON Storage: Registration added successfully', newRegistration);
    return newRegistration;
  }

  // Get all registrations
  public getAllRegistrations(): WebinarRegistration[] {
    return this.readRegistrations();
  }

  // Get registration count
  public getRegistrationCount(): number {
    return this.readRegistrations().length;
  }

  // Get recent registrations
  public getRecentRegistrations(limit: number = 10): WebinarRegistration[] {
    const allRegistrations = this.readRegistrations();
    return allRegistrations
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Check if email already exists
  public emailExists(email: string): boolean {
    const registrations = this.readRegistrations();
    return registrations.some(reg => 
      reg.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Get registration statistics
  public getStatistics() {
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
export const jsonStorageManager = new JSONStorageManager();
