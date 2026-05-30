import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }
    
    const caseId = crypto.randomUUID();
    const filename = files.length > 1 ? `${files.length} files` : files[0].name;
    const firstFilename = files[0].name.toLowerCase();
    
    let status = 'uploaded';
    if (firstFilename.endsWith('.dcm')) {
      status = `uploaded_${files.length}_dicom_slices`;
    }
    
    return NextResponse.json({
      case_id: caseId,
      filename,
      status
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
