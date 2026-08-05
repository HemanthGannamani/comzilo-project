const API_BASE_URL = 'http://localhost:5000';

const PRODUCT_TYPE_DEFAULT_IMAGES: Record<string, string> = {
  physical: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  variable: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
  virtual: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
  digital: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500',
  downloadable: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
  print_on_demand: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
  bundle: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
  service: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500',
  subscription: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
  gift_card: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
  rental: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
};

const SKU_IMAGE_MAP: Record<string, string> = {
  'PHYS-TSHIRT-001': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
  'PHYS-MOUSE-002': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
  'VAR-POLO-001': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
  'VAR-SHOES-002': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  'VIRT-MEMBERSHIP-001': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
  'VIRT-CONSULT-002': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
  'DIG-FIGMA-001': 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500',
  'DIG-WP-THEME-002': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
  'DL-JAVA-PDF-001': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
  'DL-FLUTTER-CODE-002': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
  'POD-MUG-001': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
  'POD-HOODIE-002': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500',
  'BNDL-OFFICE-001': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
  'BNDL-GAMER-002': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
  'SRV-REPAIR-001': 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500',
  'SRV-CLEAN-002': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
  'SUB-ERP-MONTHLY-001': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
  'SUB-ERP-ANNUAL-002': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
  'GC-500-001': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
  'GC-1000-002': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500',
  'RNT-CAM-4K-001': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
  'RNT-PROJ-HD-002': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
};

/**
 * Returns full image URL for any product, prioritizing:
 * 1. Uploaded product images/media from backend API
 * 2. Product name keyword mapping (logo, hydizo, pant, etc.)
 * 3. SKU-based specific image mapping
 * 4. Product-type specific fallback images
 * 5. General fallback product image
 */
export const getProductImage = (prod: any): string => {
  if (typeof prod === 'string' && prod) {
    if (prod.startsWith('http://') || prod.startsWith('https://')) {
      if (!prod.includes('unsplash.com')) return prod;
    } else if (!prod.startsWith('blob:')) {
      return `${API_BASE_URL}${prod.startsWith('/') ? '' : '/'}${prod}`;
    }
  }

  const images = prod?.images || prod?.media || prod?.productImages || prod?.product_images || [];
  
  // 1. First look for real non-blob image URL
  const validImg = images.find((img: any) => {
    const url = typeof img === 'string' ? img : (img?.imageUrl || img?.url || img?.image_url || img?.thumbnail_url || img?.path);
    return url && typeof url === 'string' && !url.startsWith('blob:');
  });

  let rawUrl = typeof validImg === 'string' ? validImg : (validImg?.imageUrl || validImg?.url || validImg?.image_url || validImg?.thumbnail_url || validImg?.path || prod?.image || prod?.imageUrl || prod?.image_url);

  if (rawUrl && typeof rawUrl === 'string' && !rawUrl.startsWith('blob:')) {
    if (!rawUrl.includes('unsplash.com')) {
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        return rawUrl;
      }
      return `${API_BASE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
    }
  }

  // 2. Check product name keywords
  const lowerName = (prod?.name || '').toLowerCase();
  if (lowerName.includes('logo') || lowerName.includes('hydizo')) {
    return 'http://localhost:5000/uploads/products/product-1785931674466-722409561.png';
  }
  if (lowerName.includes('pant') || lowerName.includes('trouser') || lowerName.includes('jeans')) {
    return 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500';
  }
  if (lowerName.includes('book') || lowerName.includes('pdf') || lowerName.includes('ebook')) {
    return 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500';
  }
  if (lowerName.includes('shirt') || lowerName.includes('tshirt') || lowerName.includes('top')) {
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
  }
  if (lowerName.includes('shoe') || lowerName.includes('sneaker')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';
  }
  if (lowerName.includes('headphone') || lowerName.includes('headset') || lowerName.includes('audio')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
  }

  if (prod?.sku && SKU_IMAGE_MAP[prod.sku]) {
    return SKU_IMAGE_MAP[prod.sku];
  }

  const pType = (prod?.productType || prod?.type || '').toLowerCase();
  if (pType && PRODUCT_TYPE_DEFAULT_IMAGES[pType]) {
    return PRODUCT_TYPE_DEFAULT_IMAGES[pType];
  }

  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
};
