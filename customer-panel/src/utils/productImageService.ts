export const API_BASE_URL = 'http://localhost:5000';

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
 * 2. SKU-based specific image mapping
 * 3. Product-type specific fallback images
 * 4. General fallback product image
 */
export const getProductImage = (prod: any): string => {
  if (!prod) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
  }

  // 1. Gather all potential image sources
  const images = Array.isArray(prod?.images) ? prod.images : Array.isArray(prod?.media) ? prod.media : [];

  // Find real server upload URLs first (/uploads/... or http://...)
  const serverImg = images.find((img: any) => {
    const u = img?.imageUrl || img?.url || (typeof img === 'string' ? img : '');
    return u && typeof u === 'string' && (u.includes('/uploads/') || (u.startsWith('http') && !u.startsWith('blob:')));
  });

  // Next fallback to any non-blob image entry
  const anyNonBlobImg = images.find((img: any) => {
    const u = img?.imageUrl || img?.url || (typeof img === 'string' ? img : '');
    return u && typeof u === 'string' && !u.startsWith('blob:');
  });

  // Next fallback to any image entry including single image property
  const fallbackSingleImg = typeof prod?.image === 'string' ? prod.image : prod?.image?.imageUrl || prod?.image?.url;

  const targetImgObj = serverImg || anyNonBlobImg;
  let rawUrl = targetImgObj ? targetImgObj.imageUrl || targetImgObj.url || (typeof targetImgObj === 'string' ? targetImgObj : '') : fallbackSingleImg;

  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('blob:')) {
      return trimmed;
    }
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${API_BASE_URL}${cleanPath}`;
  }

  // Fallback placeholder image list if no image was uploaded for this product
  const fallbackList = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
  ];
  const charCodeSum = (prod?.name || prod?.sku || 'product').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const index = (Number(prod?.id || 0) + charCodeSum) % fallbackList.length;

  return fallbackList[index];
};
