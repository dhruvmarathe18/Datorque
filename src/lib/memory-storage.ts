export interface WebinarRegistration {
  name: string;
  email: string;
  phone: string;
  college: string;
  timestamp: string;
  source: string;
  registrationNumber?: number;
}

class MemoryStorageManager {
  private registrations: WebinarRegistration[] = [];

  // Add a new registration
  public addRegistration(registration: Omit<WebinarRegistration, 'registrationNumber'>): WebinarRegistration {
    console.log('Memory Storage: Adding registration', registration);
    const registrationNumber = this.registrations.length + 1;
    
    const newRegistration: WebinarRegistration = {
      ...registration,
      registrationNumber
    };

    this.registrations.push(newRegistration);
    console.log('Memory Storage: Registration added successfully', newRegistration);
    return newRegistration;
  }

  // Get all registrations
  public getAllRegistrations(): WebinarRegistration[] {
    return [...this.registrations];
  }

  // Get registration count
  public getRegistrationCount(): number {
    return this.registrations.length;
  }

  // Get recent registrations
  public getRecentRegistrations(limit: number = 10): WebinarRegistration[] {
    return [...this.registrations]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Check if email already exists
  public emailExists(email: string): boolean {
    return this.registrations.some(reg => 
      reg.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Get registration statistics
  public getStatistics() {
    const today = new Date();
    const todayRegistrations = this.registrations.filter(reg => {
      const regDate = new Date(reg.timestamp);
      return regDate.toDateString() === today.toDateString();
    });

    const thisWeekRegistrations = this.registrations.filter(reg => {
      const regDate = new Date(reg.timestamp);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return regDate >= weekAgo;
    });

    // Group by college
    const collegeStats = this.registrations.reduce((acc, reg) => {
      const college = reg.college || 'Unknown';
      acc[college] = (acc[college] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.registrations.length,
      today: todayRegistrations.length,
      thisWeek: thisWeekRegistrations.length,
      collegeStats,
      recentRegistrations: this.getRecentRegistrations(5)
    };
  }

  // Export to CSV
  public exportToCSV(): string {
    const csvData = [
      ['Registration Number', 'Name', 'Email', 'Phone', 'College', 'Timestamp', 'Source']
    ];

    this.registrations.forEach(reg => {
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
export const memoryStorageManager = new MemoryStorageManager();
