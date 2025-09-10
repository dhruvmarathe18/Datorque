import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, whatsapp } = body;

    // Validate required fields
    if (!name || !email || !whatsapp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate WhatsApp number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(whatsapp.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid WhatsApp number' },
        { status: 400 }
      );
    }

    // Here you would integrate with Google Sheets API
    // For now, we'll simulate a successful response
    const registrationData = {
      name,
      email,
      whatsapp,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // TODO: Integrate with Google Sheets API
    // Example integration would be:
    // 1. Set up Google Sheets API credentials
    // 2. Use the googleapis library to append data to a sheet
    // 3. Handle authentication and error cases

    console.log('New sales partner registration:', registrationData);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful! We will contact you within 24 hours.',
        data: registrationData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
