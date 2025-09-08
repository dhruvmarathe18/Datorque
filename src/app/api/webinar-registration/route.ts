import { NextRequest, NextResponse } from 'next/server';
import { persistentStorageManager, WebinarRegistration } from '@/lib/persistent-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('Webinar registration API called');
    const body = await request.json();
    console.log('Request body:', body);
    const { name, email, phone, college } = body;

    // Validate required fields
    if (!name || !email || !phone || !college) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Create registration object
    const registration: Omit<WebinarRegistration, 'registrationNumber'> = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      college: college.trim(),
      timestamp: new Date().toISOString(),
      source: 'webinar-landing-page'
    };

    // Check if email already exists
    if (await persistentStorageManager.emailExists(email)) {
      return NextResponse.json(
        { error: 'This email is already registered for the webinar' },
        { status: 409 }
      );
    }

    // Add registration using persistent storage
    const newRegistration = await persistentStorageManager.addRegistration(registration);
    const totalRegistrations = await persistentStorageManager.getRegistrationCount();

    console.log('New webinar registration:', newRegistration);
    console.log('Total registrations:', totalRegistrations);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful!',
        data: {
          ...newRegistration,
          totalRegistrations
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webinar registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration. Please try again.' },
      { status: 500 }
    );
  }
}

// Get registration statistics
export async function GET() {
  try {
    const stats = await persistentStorageManager.getStatistics();
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        storageType: 'Persistent Storage (Cross-Session)'
      }
    });
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration data' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
