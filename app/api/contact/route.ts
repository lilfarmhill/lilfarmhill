import { NextResponse } from 'next/server';
import { sendAdminEmail, sendUserConfirmationEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.parentName || !data.email) {
      return NextResponse.json(
        { error: 'Parent name and email are required' },
        { status: 400 }
      );
    }

    // Validate children information
    if (!data.children || !Array.isArray(data.children) || data.children.length === 0) {
      return NextResponse.json(
        { error: 'At least one child\'s information is required' },
        { status: 400 }
      );
    }

    // Check that each child has name and birthday
    for (const child of data.children) {
      if (!child.name || !child.birthday) {
        return NextResponse.json(
          { error: 'Each child must have a name and birthday' },
          { status: 400 }
        );
      }
    }

    // Send admin notification email
    try {
      await sendAdminEmail(data);
    } catch (emailError: any) {
      console.error('Detailed admin email error:', {
        message: emailError.message,
        code: emailError.Code,
        type: emailError.Type,
        metadata: emailError.$metadata
      });
      throw emailError;
    }

    // Send user confirmation email
    try {
      await sendUserConfirmationEmail(data);
    } catch (emailError: any) {
      console.error('Detailed user email error:', {
        message: emailError.message,
        code: emailError.Code,
        type: emailError.Type,
        metadata: emailError.$metadata
      });
      throw emailError;
    }

    return NextResponse.json(
      { message: 'Thank you! Your enrollment inquiry has been sent successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Enrollment form submission error:', {
      message: error.message,
      code: error.Code,
      type: error.Type,
      metadata: error.$metadata
    });
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }
} 
