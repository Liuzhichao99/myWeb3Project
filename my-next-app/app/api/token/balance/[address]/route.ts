import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/token/balance/${params.address}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
} 