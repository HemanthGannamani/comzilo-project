/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AiGeneratorInput {
  purpose: string;
  tone?: string;
  language?: string;
  offer?: string;
  brand?: string;
  targetAudience?: string;
  category?: string;
}

export interface AiGeneratedEmail {
  subject: string;
  subjectVariations: string[];
  greeting: string;
  bodyHtml: string;
  ctaText: string;
  ctaLink: string;
  recommendedProductsHtml: string;
}

export class AiEmailGenerator {
  /**
   * Generates AI Subject Line Variations
   */
  public generateSubjectLines(purpose: string, brand = 'Comzilo Store'): string[] {
    const p = purpose.toLowerCase();
    if (p.includes('cart') || p.includes('abandon')) {
      return [
        `You left something special behind at ${brand}!`,
        `Complete your purchase today & claim your reserved items`,
        `Your shopping cart is waiting for you!`,
        `Don't miss out! Finish your order before items sell out`,
        `Did you forget something? Here is a special 10% discount!`,
      ];
    }
    if (p.includes('welcome')) {
      return [
        `Welcome to ${brand}! Here's your exclusive VIP starter perk 🎉`,
        `Glad to have you with us at ${brand}!`,
        `Discover what's new & exciting at ${brand}`,
      ];
    }
    if (p.includes('order') || p.includes('confirmation')) {
      return [
        `Order Confirmation - Thank you for shopping at ${brand}!`,
        `We've received your order! Track your items here`,
      ];
    }
    if (p.includes('shipping') || p.includes('shipped')) {
      return [
        `Good news! Your order from ${brand} has shipped! 🚚`,
        `Your package is on its way! Track delivery status`,
      ];
    }
    return [
      `Special update from ${brand}`,
      `Handpicked deals & updates just for you from ${brand}`,
      `Exclusive offer inside from ${brand}!`,
    ];
  }

  /**
   * Generates Product Recommendations (Cross-sell / Upsell)
   * Example: Shoes -> Socks, Shoe Cleaner, Laces with bundle discount
   */
  public generateProductRecommendations(cartItemsText = 'Shoes'): string {
    const items = cartItemsText.toLowerCase();
    let recs = [
      { name: 'Premium Cotton Cushion Socks (Pack of 3)', price: '₹399', original: '₹599', discount: '33% OFF' },
      { name: 'All-In-One Shoe Cleaner & Polish Kit', price: '₹299', original: '₹499', discount: '40% OFF' },
      { name: 'Reflective Durable Laces Set', price: '₹149', original: '₹249', discount: '40% OFF' },
    ];

    if (items.includes('phone') || items.includes('mobile') || items.includes('laptop') || items.includes('electronics')) {
      recs = [
        { name: 'Ultra-Fast GaN 65W Charger', price: '₹999', original: '₹1,499', discount: '33% OFF' },
        { name: 'Tempered Glass Screen Protector', price: '₹299', original: '₹599', discount: '50% OFF' },
        { name: 'Shockproof Matte Armor Case', price: '₹499', original: '₹799', discount: '37% OFF' },
      ];
    }

    return `
      <div style="margin-top: 25px; padding: 20px; background-color: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
        <h3 style="margin-top: 0; color: #111827; font-size: 16px; font-weight: 700;">Recommended Items to Complete Your Look & Save Extra:</h3>
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
          ${recs.map(r => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; padding: 10px 14px; border-radius: 6px; border: 1px solid #E5E7EB;">
              <div>
                <strong style="font-size: 14px; color: #1F2937;">${r.name}</strong>
                <div style="font-size: 12px; color: #059669; font-weight: 600;">Bundle Special (${r.discount})</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 14px; font-weight: 700; color: #4F46E5;">${r.price}</span>
                <span style="font-size: 11px; text-decoration: line-through; color: #9CA3AF; margin-left: 4px;">${r.original}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Generates Complete AI Email Template
   */
  public generateTemplate(input: AiGeneratorInput): AiGeneratedEmail {
    const brand = input.brand || '{{store_name}}';
    const purpose = input.purpose || 'Abandoned Cart Reminder';
    const tone = input.tone || 'Friendly & Persuasive';
    const offer = input.offer || '10% OFF with code {{coupon_code}}';
    const subjects = this.generateSubjectLines(purpose, brand);
    const chosenSubject = subjects[0];
    const recsHtml = this.generateProductRecommendations('Shoes');

    let bodyContent = `
      <p style="font-size: 15px; color: #374151; line-height: 1.6;">
        You left some incredible items waiting in your shopping cart! We have temporarily reserved them for you, but they are selling fast.
      </p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
        <h4 style="margin: 0 0 8px 0; color: #111827;">Your Reserved Cart Items:</h4>
        <div style="font-size: 14px; color: #4B5563; font-weight: 600;">{{cart_items}}</div>
        <div style="margin-top: 10px; font-size: 15px; color: #111827;"><strong>Total Amount:</strong> {{total_price}}</div>
      </div>
      <p style="font-size: 14px; color: #059669; font-weight: 600;">
        🎁 Special Offer: Use coupon code <span style="background: #D1FAE5; padding: 2px 8px; border-radius: 4px; font-family: monospace;">{{coupon_code}}</span> at checkout to get {{discount}}!
      </p>
    `;

    if (purpose.toLowerCase().includes('welcome')) {
      bodyContent = `
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Welcome to the family! We are thrilled to have you onboard with <strong>${brand}</strong>. Discover curated products, exclusive deals, and fast delivery built just for you.
        </p>
        <p style="font-size: 14px; color: #4F46E5; font-weight: 600;">
          As a special welcome gift, enjoy {{discount}} on your very first order using code: <strong>{{coupon_code}}</strong>.
        </p>
      `;
    } else if (purpose.toLowerCase().includes('order') || purpose.toLowerCase().includes('confirmation')) {
      bodyContent = `
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Thank you for your order! We have successfully received your order <strong>#{{order_number}}</strong> and are preparing it for shipment.
        </p>
        <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; color: #111827;">Order Details:</h4>
          <p style="margin: 0; font-size: 14px; color: #4B5563;">Order Number: {{order_number}}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #4B5563;">Items Purchased: {{cart_items}}</p>
        </div>
      `;
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${chosenSubject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F4F5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F5F7; padding: 30px 10px;">
          <tr>
            <td align="center">
              <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #4F46E5; padding: 24px; text-align: center;">
                    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 800; tracking: -0.5px;">${brand}</h1>
                  </td>
                </tr>
                <!-- Body Content -->
                <tr>
                  <td style="padding: 32px 24px;">
                    <h2 style="margin-top: 0; color: #111827; font-size: 18px;">Hi {{customer_name}},</h2>
                    ${bodyContent}
                    
                    <!-- Call To Action -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="{{checkout_link}}" target="_blank" style="background-color: #4F46E5; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);">
                        Complete Your Order Now &rarr;
                      </a>
                    </div>

                    ${recsHtml}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 20px 24px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0; font-size: 12px; color: #9CA3AF;">Sent automatically by ${brand}. You received this email because of your recent activity.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return {
      subject: chosenSubject,
      subjectVariations: subjects,
      greeting: 'Hi {{customer_name}},',
      bodyHtml: fullHtml,
      ctaText: 'Complete Your Order Now',
      ctaLink: '{{checkout_link}}',
      recommendedProductsHtml: recsHtml,
    };
  }

  /**
   * Interpolate Dynamic Placeholders in Template Body & Subject
   */
  public interpolatePlaceholders(templateStr: string, data: Record<string, any>): string {
    if (!templateStr) return '';
    let result = templateStr;

    const placeholders: Record<string, string> = {
      customer_name: data.customerName || data.name || 'Valued Customer',
      customer_email: data.customerEmail || data.email || '',
      store_name: data.storeName || 'Comzilo Store',
      cart_items: data.cartItems || data.itemsText || 'Selected Items',
      total_price: data.totalPrice || data.total || '₹0.00',
      checkout_link: data.checkoutLink || 'http://localhost:5173/checkout',
      order_number: data.orderNumber || data.orderId || 'ORD-1001',
      tracking_link: data.trackingLink || 'http://localhost:5173/orders/track',
      coupon_code: data.couponCode || 'SAVE10',
      discount: data.discount || '10% OFF',
      recommended_products: data.recommendedProductsHtml || '',
    };

    for (const [key, value] of Object.entries(placeholders)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    }

    return result;
  }
}
