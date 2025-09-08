import { NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, this would connect to a real database
// eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
let storedRegistrations: any[] = [];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      registrations: storedRegistrations
    });
  } catch (error) {
    console.error('Error loading registrations:', error);
    return NextResponse.json(
      { error: 'Failed to load registrations' },
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
