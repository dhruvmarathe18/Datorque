export interface WebinarRegistration {
  name: string;
  email: string;
  phone: string;
  college: string;
  timestamp: string;
  source: string;
  registrationNumber?: number;
}

class PersistentStorageManager {
  private registrations: WebinarRegistration[] = [];
  private initialized: boolean = false;

  // Initialize storage (load from external source if available)
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Try to load from external API or fallback to empty array
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/load-registrations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.registrations = data.registrations || [];
        console.log('Persistent Storage: Loaded', this.registrations.length, 'registrations');
      } else {
        console.log('Persistent Storage: No existing data, starting fresh');
        this.registrations = [];
      }
    } catch (error) {
      console.log('Persistent Storage: Failed to load data, starting fresh', error);
      this.registrations = [];
    }

    this.initialized = true;
  }

  // Save registrations to external storage
  private async saveRegistrations(): Promise<void> {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/save-registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrations: this.registrations }),
      });
      console.log('Persistent Storage: Saved', this.registrations.length, 'registrations');
    } catch (error) {
      console.error('Persistent Storage: Failed to save data', error);
    }
  }

  // Add a new registration
  public async addRegistration(registration: Omit<WebinarRegistration, 'registrationNumber'>): Promise<WebinarRegistration> {
    await this.initialize();
    
    console.log('Persistent Storage: Adding registration', registration);
    const registrationNumber = this.registrations.length + 1;
    
    const newRegistration: WebinarRegistration = {
      ...registration,
      registrationNumber
    };

    this.registrations.push(newRegistration);
    
    // Save to external storage
    await this.saveRegistrations();
    
    console.log('Persistent Storage: Registration added successfully', newRegistration);
    return newRegistration;
  }

  // Get all registrations
  public async getAllRegistrations(): Promise<WebinarRegistration[]> {
    await this.initialize();
    return [...this.registrations];
  }

  // Get registration count
  public async getRegistrationCount(): Promise<number> {
    await this.initialize();
    return this.registrations.length;
  }

  // Get recent registrations
  public async getRecentRegistrations(limit: number = 10): Promise<WebinarRegistration[]> {
    await this.initialize();
    return [...this.registrations]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Check if email already exists
  public async emailExists(email: string): Promise<boolean> {
    await this.initialize();
    return this.registrations.some(reg => 
      reg.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Get registration statistics
  public async getStatistics() {
    await this.initialize();
    
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
      recentRegistrations: await this.getRecentRegistrations(5)
    };
  }

  // Export to CSV
  public async exportToCSV(): Promise<string> {
    await this.initialize();
    
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
export const persistentStorageManager = new PersistentStorageManager();
