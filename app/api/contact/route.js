import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, honeypot } = body;

    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email via Resend
    console.log('Attempting to send email to:', 'adrianschaeferphotos@gmail.com');
    console.log('Using API key:', process.env.RESEND_API_KEY ? 'API key found' : 'API key missing');

    const data = await resend.emails.send({
      from: 'Adrian Schaefer Photography <onboarding@resend.dev>',
      to: 'adrianschaeferphotos@gmail.com',
      replyTo: email, // User's email so you can reply directly
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
          <div style="background-color: #141414; color: #ffffff; padding: 30px; border-radius: 8px;">
            <h1 style="color: #c9a961; margin-top: 0; border-bottom: 2px solid #c9a961; padding-bottom: 10px;">
              New Contact Form Submission
            </h1>

            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;">
                <strong style="color: #c9a961;">From:</strong> ${name}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #c9a961;">Email:</strong>
                <a href="mailto:${email}" style="color: #ffffff; text-decoration: none;">
                  ${email}
                </a>
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #c9a961;">Subject:</strong> ${subject}
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #2a2f3e;">
              <p style="margin-bottom: 10px;">
                <strong style="color: #c9a961;">Message:</strong>
              </p>
              <div style="background-color: #1a1f2e; padding: 20px; border-radius: 6px; border-left: 4px solid #c9a961;">
                <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #2a2f3e; font-size: 12px; color: #888;">
              <p style="margin: 0;">
                This message was sent via your photography website contact form.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully! ID:', data.id);
    console.log('Full response:', JSON.stringify(data, null, 2));

    return NextResponse.json(
      { success: true, id: data.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.', details: error.message },
      { status: 500 }
    );
  }
}
