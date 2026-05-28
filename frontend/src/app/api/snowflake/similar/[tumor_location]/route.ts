import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tumor_location: string }> }
) {
  try {
    const resolvedParams = await params;
    const tumorLocation = resolvedParams.tumor_location;
    
    // Parse query params (limit)
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    // Replicate similar cases mock data
    const similarCases = [
      {
        "case_id": "demo-001",
        "tumor_location": tumorLocation || "right_frontal_lobe",
        "tumor_volume": 7.8,
        "max_displacement": 4.2,
        "avg_stress": 1.15
      },
      {
        "case_id": "demo-002",
        "tumor_location": tumorLocation || "right_frontal_lobe",
        "tumor_volume": 9.1,
        "max_displacement": 5.1,
        "avg_stress": 1.42
      },
      {
        "case_id": "demo-003",
        "tumor_location": tumorLocation || "frontal_lobe",
        "tumor_volume": 6.5,
        "max_displacement": 3.8,
        "avg_stress": 0.98
      }
    ].slice(0, limit);
    
    return NextResponse.json({
      similar_cases: similarCases,
      count: similarCases.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Snowflake query failed' }, { status: 500 });
  }
}
