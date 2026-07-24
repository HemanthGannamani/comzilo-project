import { connectDatabase } from '../../config/database';
import { Product, Store, Tenant } from '../models';

interface ProductSeedItem {
  name: string;
  sku: string;
  productType: string;
  price: number;
  costPrice: number;
  status: string;
  shortDescription: string;
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
    dynamicAttributes: { rentalRatePerDay: 999.0, depositAmount: 2500.0 },
  },
];

export const seed22Products = async () => {
  await connectDatabase();

  console.log('====================================================');
  console.log('SEEDING 22 REAL MYSQL PRODUCTS (2 PER PRODUCT TYPE)');
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
      console.log(`✅ Created Product [ID ${prod.id}] [${item.productType.toUpperCase()}]: "${item.name}" (SKU: ${item.sku}) - Price: ₹${item.price}`);
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
  }

  console.log('\n====================================================');
  console.log(`🎉 22 REAL PRODUCTS SEEDED INTO MYSQL DATABASE! (Created: ${createdCount})`);
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
