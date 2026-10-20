import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, bookingRef, groomName, brideName } = await req.json();

    if (!phone || !bookingRef) {
      return NextResponse.json(
        { success: false, message: 'Phone and Booking Ref required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FAST2SMS_API_KEY;

    // Couple Name Format
    const couple = groomName && brideName ? `${groomName} & ${brideName}` : 'Valued Client';
    const message = `✨ VK CREATION STUDIO ✨\n\nCongratulations ${couple}! 🎉\nAapka Wedding Proposal receive ho gaya hai.\n\n🔑 VIP Booking Ref: ${bookingRef}\n\nIs Reference ID se apna VIP Portal access karein:\nhttps://vk-creation-platform.vercel.app/booking`;

    // Fast2SMS Call
    const response = await fetch(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(
        message
      )}&flash=0&numbers=${phone}`
    );

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('SMS Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}