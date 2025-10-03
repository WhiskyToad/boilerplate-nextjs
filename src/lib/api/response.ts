import { NextResponse } from 'next/server';

export function apiResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status: number = 400, details?: any) {
  return NextResponse.json(
    { 
      error: message, 
      details,
      timestamp: new Date().toISOString() 
    }, 
    { status }
  );
}