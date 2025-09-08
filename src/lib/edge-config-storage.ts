import { get } from '@vercel/edge-config';

export interface WebinarRegistration {
  name: string;
  email: string;
  phone: string;
  college: string;
  timestamp: string;
  source: string;
  registrationNumber?: number;
}

class EdgeConfigStorageManager {
  // Get all registrations from Edge Config
  private async getRegistrations(): Promise<WebinarRegistration[]> {
    try {
      // Check if Edge Config is available
      if (!process.env.EDGE_CONFIG) {
        console.log('Edge Config not configured, using memory storage only');
        return [];
      }
      
      const registrations = await get('webinar_registrations');
      return Array.isArray(registrations) ? registrations : [];
    } catch (error) {
      console.error('Error reading from Edge Config:', error);
      return [];
    }
  }

  // Add a new registration (using memory storage as primary)
  public async addRegistration(registration: Omit<WebinarRegistration, 'registrationNumber'>): Promise<WebinarRegistration> {
    console.log('Edge Config Storage: Adding registration', registration);
    
    // Get existing registrations from Edge Config
    const edgeRegistrations = await this.getRegistrations();
    
    // Get memory registrations
    if (typeof window === 'undefined') {
      if (!global.webinarRegistrations) {
        global.webinarRegistrations = [];
      }
    }
    
    const memoryRegistrations = (typeof window === 'undefined' && global.webinarRegistrations) 
      ? global.webinarRegistrations as WebinarRegistration[] 
      : [];
    
    // Combine all registrations
    const allRegistrations = [...edgeRegistrations, ...memoryRegistrations];
    const registrationNumber = allRegistrations.length + 1;
    
    const newRegistration: WebinarRegistration = {
      ...registration,
      registrationNumber
    };

    // Store in memory (primary storage)
    if (typeof window === 'undefined') {
      global.webinarRegistrations.push(newRegistration);
    }

    console.log('Edge Config Storage: Registration added successfully', newRegistration);
    return newRegistration;
  }

  // Get all registrations
  public async getAllRegistrations(): Promise<WebinarRegistration[]> {
    const edgeRegistrations = await this.getRegistrations();
    
    // Get memory registrations
    const memoryRegistrations = (typeof window === 'undefined' && global.webinarRegistrations) 
      ? global.webinarRegistrations as WebinarRegistration[] 
      : [];
    
    // Combine and deduplicate
    const allRegistrations = [...edgeRegistrations, ...memoryRegistrations];
    const uniqueRegistrations = allRegistrations.filter((reg, index, self) => 
      index === self.findIndex(r => r.email === reg.email)
    );
    
    return uniqueRegistrations;
  }

  // Get registration count
  public async getRegistrationCount(): Promise<number> {
    const registrations = await this.getAllRegistrations();
    return registrations.length;
  }

  // Get recent registrations
  public async getRecentRegistrations(limit: number = 10): Promise<WebinarRegistration[]> {
    const registrations = await this.getAllRegistrations();
    return registrations
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Check if email already exists
  public async emailExists(email: string): Promise<boolean> {
    const registrations = await this.getAllRegistrations();
    return registrations.some(reg => 
      reg.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Get registration statistics
  public async getStatistics() {
    const registrations = await this.getAllRegistrations();
    
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
      recentRegistrations: await this.getRecentRegistrations(5)
    };
  }

  // Export to CSV
  public async exportToCSV(): Promise<string> {
    const registrations = await this.getAllRegistrations();
    
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
export const edgeConfigStorageManager = new EdgeConfigStorageManager();