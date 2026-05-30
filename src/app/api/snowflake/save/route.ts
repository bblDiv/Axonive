import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // In production, you would connect to Snowflake here.
    // For demo/Vercel serverless deployment, we return success.
    return NextResponse.json({
      status: "success",
      message: "Simulation data saved",
      case_id: data.case_id || 'sample-case'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Snowflake save failed' }, { status: 500 });
  }
}
