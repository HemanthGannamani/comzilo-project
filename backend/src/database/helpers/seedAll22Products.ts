import { connectDatabase } from '../../config/database';
import { Product, Store, Media, ProductMedia } from '../models';

interface ProductSeedItem {
  name: string;
  sku: string;
  productType: string;
  price: number;
  costPrice: number;
  status: string;
  shortDescription: string;
  imageUrl: string;
  dynamicAttributes?: any;
}

const PRODUCTS_22_LIST: ProductSeedItem[] = [
  // 1. Physical Product
  {
    name: 'Enterprise Cotton T-Shirt',
    sku: 'PHYS-TSHIRT-001',
    productType: 'physical',
    price: 499.0,
    costPrice: 200.0,
    status: 'published',
    shortDescription: '100% Premium Combed Cotton T-Shirt for Enterprise teams',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
    dynamicAttributes: { weight: 0.2, dimensions: '30x20x2 cm', warehouseId: 1 },
  },
  {
    name: 'Wireless Ergonomic Optical Mouse',
    sku: 'PHYS-MOUSE-002',
    productType: 'physical',
    price: 1299.0,
    costPrice: 600.0,
    status: 'published',
    shortDescription: '2.4GHz High Precision Optical Mouse with Silent Click',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
    dynamicAttributes: { weight: 0.15, dimensions: '12x8x5 cm', warehouseId: 1 },
  },

  // 2. Variable Product
  {
    name: 'Polo T-Shirt (Size/Color Variants)',
    sku: 'VAR-POLO-001',
    productType: 'variable',
    price: 799.0,
    costPrice: 350.0,
    status: 'published',
    shortDescription: 'Classic Fit Polo T-Shirt available in Red, Navy & Black',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
    dynamicAttributes: { attributes: ['Color', 'Size'] },
  },
  {
    name: 'Pro Running Shoes (Size Variants)',
    sku: 'VAR-SHOES-002',
    productType: 'variable',
    price: 2999.0,
    costPrice: 1400.0,
    status: 'published',
    shortDescription: 'Lightweight Breathable Mesh Running Shoes for Athletes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    dynamicAttributes: { attributes: ['Size'] },
  },

  // 3. Virtual Product
  {
    name: 'Premium Storefront Membership',
    sku: 'VIRT-MEMBERSHIP-001',
    productType: 'virtual',
    price: 1999.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'VIP Annual Storefront Membership with Free Delivery Perks',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
    dynamicAttributes: { accessDurationDays: 365 },
  },
  {
    name: '1-on-1 ERP Strategy Consultation',
    sku: 'VIRT-CONSULT-002',
    productType: 'virtual',
    price: 4999.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: '60-Minute Executive ERP Implementation & Strategy Call',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
    dynamicAttributes: { durationMinutes: 60 },
  },

  // 4. Digital Product
  {
    name: 'Figma UI Design Kit Pro',
    sku: 'DIG-FIGMA-001',
    productType: 'digital',
    price: 1499.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: '250+ Responsive Web & Mobile Components for Designers',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500',
    dynamicAttributes: { fileUrl: 'https://cdn.comzilo.com/files/ui-kit.fig', downloadLimit: 10 },
  },
  {
    name: 'WordPress E-Commerce Theme',
    sku: 'DIG-WP-THEME-002',
    productType: 'digital',
    price: 2499.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Ultra-fast SEO Optimized Multi-Vendor WooCommerce Theme',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
    dynamicAttributes: { fileUrl: 'https://cdn.comzilo.com/files/wptheme.zip', downloadLimit: 5 },
  },

  // 5. Downloadable Product
  {
    name: 'Java Microservices Architecture Course PDF',
    sku: 'DL-JAVA-PDF-001',
    productType: 'downloadable',
    price: 399.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Comprehensive Guide to Spring Boot & Microservices PDF eBook',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    dynamicAttributes: { fileUrl: 'https://cdn.comzilo.com/files/java-ebook.pdf', downloadExpiryDays: 30 },
  },
  {
    name: 'Flutter Complete App Source Code',
    sku: 'DL-FLUTTER-CODE-002',
    productType: 'downloadable',
    price: 1999.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Full Stack Cross-Platform Mobile Shopping App Codebase',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
    dynamicAttributes: { fileUrl: 'https://cdn.comzilo.com/files/flutter-src.zip', downloadExpiryDays: 60 },
  },

  // 6. Print On Demand
  {
    name: 'Custom Matte Ceramic Coffee Mug',
    sku: 'POD-MUG-001',
    productType: 'print_on_demand',
    price: 349.0,
    costPrice: 120.0,
    status: 'published',
    shortDescription: '11oz High Quality Ceramic Mug with Custom Logo Printing',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
    dynamicAttributes: { podProvider: 'Gelato', templateId: 'MUG-11OZ' },
  },
  {
    name: 'Custom Printed Fleece Pullover Hoodie',
    sku: 'POD-HOODIE-002',
    productType: 'print_on_demand',
    price: 1799.0,
    costPrice: 800.0,
    status: 'published',
    shortDescription: 'Heavyweight Unisex Fleece Hoodie with Front & Back Print',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500',
    dynamicAttributes: { podProvider: 'Printify', templateId: 'HOOD-FL-01' },
  },

  // 7. Bundle Product
  {
    name: 'Executive Office Starter Bundle',
    sku: 'BNDL-OFFICE-001',
    productType: 'bundle',
    price: 3499.0,
    costPrice: 1500.0,
    status: 'published',
    shortDescription: 'Includes Ergonomic Mouse, Desk Pad, Mug & Notebook',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    dynamicAttributes: { bundledItemsCount: 4 },
  },
  {
    name: 'Pro Gamer RGB Gear Combo Pack',
    sku: 'BNDL-GAMER-002',
    productType: 'bundle',
    price: 4999.0,
    costPrice: 2200.0,
    status: 'published',
    shortDescription: 'RGB Mechanical Keyboard, Gaming Mouse & Extended Mousepad',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
    dynamicAttributes: { bundledItemsCount: 3 },
  },

  // 8. Service Product
  {
    name: 'Hardware Repair & Diagnostics Service',
    sku: 'SRV-REPAIR-001',
    productType: 'service',
    price: 999.0,
    costPrice: 300.0,
    status: 'published',
    shortDescription: 'Doorstep Laptop & PC Diagnostic Check and Repair Service',
    imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500',
    dynamicAttributes: { durationMinutes: 120, serviceAreaPincodes: '500001, 500002, 500003' },
  },
  {
    name: 'Professional Deep Home Cleaning Service',
    sku: 'SRV-CLEAN-002',
    productType: 'service',
    price: 2499.0,
    costPrice: 1000.0,
    status: 'published',
    shortDescription: 'Full 3BHK Deep Home Sanitization & Steam Cleaning',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
    dynamicAttributes: { durationMinutes: 240, serviceAreaPincodes: '500001, 500004' },
  },

  // 9. Subscription Product
  {
    name: 'Monthly SaaS ERP Pro License Plan',
    sku: 'SUB-ERP-MONTHLY-001',
    productType: 'subscription',
    price: 1499.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Monthly Recurring Multi-Store SaaS ERP Access for Businesses',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
    dynamicAttributes: { billingCycle: 'monthly', trialDays: 14, renewalPrice: 1499.0 },
  },
  {
    name: 'Annual ERP Enterprise Cloud Plan',
    sku: 'SUB-ERP-ANNUAL-002',
    productType: 'subscription',
    price: 14999.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Annual Discounted SaaS ERP License with Priority VIP Support',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
    dynamicAttributes: { billingCycle: 'annual', trialDays: 30, renewalPrice: 14999.0 },
  },

  // 10. Gift Card
  {
    name: '₹500 Store Digital Gift Voucher Card',
    sku: 'GC-500-001',
    productType: 'gift_card',
    price: 500.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Digital Shopping Gift Card Voucher Code worth ₹500',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
    dynamicAttributes: { voucherAmount: 500, expiryMonths: 12 },
  },
  {
    name: '₹1000 Store Digital Gift Voucher Card',
    sku: 'GC-1000-002',
    productType: 'gift_card',
    price: 1000.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Digital Shopping Gift Card Voucher Code worth ₹1000',
    imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500',
    dynamicAttributes: { voucherAmount: 1000, expiryMonths: 12 },
  },

  // 11. Rental Product
  {
    name: '4K Cinema Camera Equipment Rental',
    sku: 'RNT-CAM-4K-001',
    productType: 'rental',
    price: 1999.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'Daily 4K Professional Camera Rental with Lens Kit',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    dynamicAttributes: { rentalRatePerDay: 1999.0, depositAmount: 5000.0 },
  },
  {
    name: 'High Lumens HD Projector Rental',
    sku: 'RNT-PROJ-HD-002',
    productType: 'rental',
    price: 999.0,
    costPrice: 0.0,
    status: 'published',
    shortDescription: 'HD Conference & Cinema Projector Daily Rental',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
    dynamicAttributes: { rentalRatePerDay: 999.0, depositAmount: 2500.0 },
  },
];

export const seed22Products = async () => {
  await connectDatabase();

  console.log('====================================================');
  console.log('SEEDING 22 REAL MYSQL PRODUCTS WITH ACCURATE IMAGES');
  console.log('====================================================');

  const defaultStore = await Store.findOne({ where: { status: 'active' } });
  const tenantId = defaultStore ? defaultStore.tenantId : 1;
  const storeId = defaultStore ? defaultStore.id : 1;

  let createdCount = 0;
  for (const item of PRODUCTS_22_LIST) {
    let prod = await Product.findOne({ where: { sku: item.sku } });
    if (!prod) {
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      prod = await Product.create({
        tenantId,
        storeId,
        productType: item.productType,
        name: item.name,
        slug,
        sku: item.sku,
        price: item.price,
        cost: item.costPrice,
        status: 'published',
        visibility: 'public',
        shortDescription: item.shortDescription,
        seoTitle: item.name,
        seoDescription: item.shortDescription,
      });
      createdCount++;
      console.log(`✅ Created Product [ID ${prod.id}] [${item.productType.toUpperCase()}]: "${item.name}"`);
    } else {
      await prod.update({
        productType: item.productType,
        price: item.price,
        status: 'published',
        name: item.name,
        shortDescription: item.shortDescription,
      });
      console.log(`ℹ️ Updated Product [ID ${prod.id}] [${item.productType.toUpperCase()}]: "${item.name}"`);
    }

    // Attach Media Image
    let media = await Media.findOne({ where: { tenantId, url: item.imageUrl } });
    if (!media) {
      media = await Media.create({
        tenantId,
        filename: `${item.sku}.jpg`,
        originalName: `${item.name}.jpg`,
        mimeType: 'image/jpeg',
        size: 50000,
        url: item.imageUrl,
        path: item.imageUrl,
        storageProvider: 's3',
      });
    }

    const existingPM = await ProductMedia.findOne({ where: { productId: prod.id, mediaId: media.id } });
    if (!existingPM) {
      await ProductMedia.create({
        tenantId,
        productId: prod.id,
        mediaId: media.id,
        isPrimary: true,
        sortOrder: 0,
      });
      console.log(`   📸 Linked Media [ID ${media.id}] to Product [ID ${prod.id}]`);
    }
  }

  console.log('\n====================================================');
  console.log(`🎉 22 REAL PRODUCTS & ACCURATE MEDIA SEEDED INTO MYSQL!`);
  console.log('====================================================');
};

if (require.main === module) {
  seed22Products()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
