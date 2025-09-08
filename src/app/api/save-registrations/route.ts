import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, this would connect to a real database
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
let storedRegistrations: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrations } = body;

    if (Array.isArray(registrations)) {
      storedRegistrations = registrations;
      console.log('Saved', registrations.length, 'registrations');
      
      return NextResponse.json({
        success: true,
        message: `Saved ${registrations.length} registrations`
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid registrations data' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error saving registrations:', error);
    return NextResponse.json(
      { error: 'Failed to save registrations' },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
