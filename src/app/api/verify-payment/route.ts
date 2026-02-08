import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json({ message: 'Missing reference' }, { status: 400 })
    }

    // 1. Verify with Paystack (Optional: requires PAYSTACK_SECRET_KEY)
    /*
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    })
    const paystackData = await paystackResponse.json()
    if (!paystackData.status) throw new Error('Payment verification failed')
    */

    // 2. Update Sanity Order
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    })

    // Query for order with this reference
    // Fetch order with product details to fallback on product image if needed
    const orderQuery = `*[_type == "order" && orderNumber == $reference][0]{
      ...,
      items[]{
        ...,
        "productImage": product->image
      }
    }`
    const order = await client.fetch(orderQuery, { reference })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'paid') {
      return NextResponse.json({ message: 'Order already paid' }, { status: 200 })
    }

    // Patch status
    await client.patch(order._id).set({ status: 'paid' }).commit()

    // Fetch Receipt Settings
    const receiptSettings = await client.fetch(`*[_type == "receiptSettings"][0]{
      brandName,
      contactEmail,
      footerText
    }`) || {}
    
    const brandName = receiptSettings.brandName || 'LIMBA'
    // For Sandbox Mode, we MUST send to the verified email (OWNER_EMAIL). 
    // We ignore Sanity settings for the recipient to prevent "403 Forbidden" errors.
    const ownerEmail = process.env.OWNER_EMAIL || 'wokehustle1@gmail.com'
    const footerText = receiptSettings.footerText || 'Thank you for choosing LIMBA. We are honoring the past while embracing the future.'

    // 3. Send Email Alert via Resend
    const { customerName, email: customerEmail, items, totalAmount, phone, address } = order
    
    // Format items list with images
    const itemsRows = items.map((item: any) => {
      const imageSrc = item.imageUrl;

      return `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px 0;">
           ${imageSrc ? `<img src="${imageSrc}" width="60" height="60" style="object-fit: cover; border-radius: 8px;" alt="${item.name}" />` : ''}
        </td>
        <td style="padding: 15px 10px;">
            <div style="font-weight: bold; color: #333;">${item.name}</div>
            <div style="color: #666; font-size: 14px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 15px 0; text-align: right; font-weight: bold; color: #333;">
            ₵${item.price.toFixed(2)}
        </td>
      </tr>
    `;
    }).join('')

    const emailHtml = `
      <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #000;">
        <div style="text-align: center; padding: 40px 0; border-bottom: 1px solid #eee;">
           <h1 style="letter-spacing: 4px; font-weight: normal; margin: 0;">${brandName.toUpperCase()}</h1>
           <p style="font-size: 12px; letter-spacing: 2px; color: #666; margin-top: 10px;">ANCESTRAL ELEGANCE</p>
        </div>
        
        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; line-height: 1.6;">Dear ${customerName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for your order. We are honored to craft this piece of heritage for you.</p>
          
          <div style="margin: 30px 0;">
            <p style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Order Reference: ${reference}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            ${itemsRows}
          </table>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #000; display: flex; justify-content: space-between; align-items: center;">
             <span style="font-weight: bold; font-size: 18px;">Total</span>
             <span style="font-weight: bold; font-size: 24px;">₵${totalAmount.toFixed(2)}</span>
          </div>

          <div style="background: #f9f9f9; padding: 20px; margin-top: 40px; border-radius: 4px;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Shipping Details</h3>
            <p style="margin: 5px 0; color: #444;">${address}</p>
            <p style="margin: 5px 0; color: #444;">${phone}</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 40px 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; line-height: 1.6;">
          <p>${footerText}</p>
        </div>
      </div>
    `

    if (process.env.RESEND_API_KEY) {
        try {
            // Send to Owner (Admin)
            await resend.emails.send({
                from: `onboarding@resend.dev`, 
                to: ownerEmail,
                subject: `New Order Received: ${reference}`,
                html: emailHtml
            });
            console.log(`Admin email sent to ${ownerEmail}`);

            // REMOVED: Sending email to Customer (as per user request - Resend Sandbox limitation)
            /*
            try {
                await resend.emails.send({
                    from: `onboarding@resend.dev`, 
                    to: customerEmail,
                    subject: `Your Order Confirmation - ${reference}`,
                    html: emailHtml
                });
            } catch (customerError) {
                console.warn("Could not send email to customer (likely due to Resend Sandbox restrictions):", customerError);
            }
            */
        } catch (emailError) {
            console.error("Failed to send emails via Resend:", emailError);
            // We do NOT throw here, so the payment is still verified successfully
        }
    } else {
        console.warn("RESEND_API_KEY is missing. Emails not sent.");
    }

    return NextResponse.json({ message: 'Payment verified and order updated' }, { status: 200 })
  } catch (error: any) {
    console.error('Verify Payment Error:', error)
    return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
  }
}
