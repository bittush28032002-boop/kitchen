import fs from 'fs';
import { INITIAL_PRODUCTS } from '../src/data/products';

const categories = [
  { id: '11111111-1111-4111-a111-111111111101', name: 'Crockery', slug: 'crockery', description: 'Artisanal stoneware, dining plates, bowls and ceramic sets fired for lifetime beauty.', image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80' },
  { id: '11111111-1111-4111-a111-111111111102', name: 'Cookware', slug: 'cookware', description: 'Tri-ply stainless steel, seasoned cast iron skillets, Dutch ovens and non-stick pans.', image_url: 'https://images.unsplash.com/photo-1584990347449-399a5e8489be?auto=format&fit=crop&w=800&q=80' },
  { id: '11111111-1111-4111-a111-111111111103', name: 'Kitchen Tools', slug: 'kitchen-tools', description: 'Precision chef knives, teak cutting boards, silicone spatulas and culinary essentials.', image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80' },
  { id: '11111111-1111-4111-a111-111111111104', name: 'Storage', slug: 'storage', description: 'Airtight borosilicate glass jars, stainless steel containers and spice organizers.', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { id: '11111111-1111-4111-a111-111111111105', name: 'Dining & Accessories', slug: 'dining-accessories', description: 'Bamboo serving platters, pure linen tea towels and handcrafted table accessories.', image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80' },
  { id: '11111111-1111-4111-a111-111111111106', name: 'Drinkware', slug: 'drinkware', description: 'Double-wall insulated glassware, ceramic coffee mugs and crystal water carafes.', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' }
];

let sql = `-- ====================================================================
-- KitchenCraft 50-Product Database Seed Script
-- Populates categories, 50 catalog products, product variants, inventory, and coupons
-- ====================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, is_active)
VALUES
` + categories.map(c => `  ('${c.id}', '${c.name}', '${c.slug}', '${c.description.replace(/'/g, "''")}', '${c.image_url}', true)`).join(',\n') + `
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- 2. Insert Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, minimum_order_amount, maximum_discount, usage_limit, used_count, expiry_date, is_active)
VALUES
  ('NAMASTE10', '10% off on orders above ₹1,999 for our Indian customers', 'percentage', 10, 1999, 1000, 10000, 48, NOW() + INTERVAL '365 days', true),
  ('FESTIVE15', '15% off festive celebration discount on orders above ₹2,999', 'percentage', 15, 2999, 1500, 5000, 112, NOW() + INTERVAL '365 days', true),
  ('FIRSTCRAFT', '₹300 flat discount on your inaugural KitchenCraft order above ₹2,499', 'fixed', 300, 2499, 300, 10000, 89, NOW() + INTERVAL '365 days', true),
  ('KITCHEN200', '₹200 instant discount on cookware and dinnerware sets above ₹1,799', 'fixed', 200, 1799, 200, 5000, 34, NOW() + INTERVAL '365 days', true)
ON CONFLICT (code) DO NOTHING;

-- 3. Insert Products, Images, Variants and Inventory
`;

INITIAL_PRODUCTS.forEach((p, idx) => {
  const cat = categories.find(c => c.name.toLowerCase() === p.category.toLowerCase()) || categories[0];
  const prodUuid = `22222222-2222-4222-b222-${String(idx + 1).padStart(12, '0')}`;
  const sku = p.id.toUpperCase().replace('KC-PROD-', 'KC-SKU-');
  const nameSafe = p.name.replace(/'/g, "''");
  const descSafe = p.description.replace(/'/g, "''");
  const shortDescSafe = p.shortDescription.replace(/'/g, "''");
  const matSafe = p.material.replace(/'/g, "''");
  const colorSafe = p.color.replace(/'/g, "''");
  const sizeSafe = (p.size || '').replace(/'/g, "''");
  const primaryImgSafe = p.primaryImage.replace(/'/g, "''");

  sql += `
-- Product ${idx + 1}: ${p.name}
INSERT INTO public.products (
  id, category_id, name, slug, description, short_description, price, compare_at_price,
  sku, material, color, size, rating, review_count, stock_quantity,
  is_featured, is_bestseller, is_new, is_active
) VALUES (
  '${prodUuid}', '${cat.id}', '${nameSafe}', '${p.slug}', '${descSafe}', '${shortDescSafe}',
  ${p.price}, ${p.originalPrice || p.price}, '${sku}', '${matSafe}', '${colorSafe}', '${sizeSafe}',
  ${p.rating || 5.0}, ${p.reviewCount || 0}, ${p.inventoryCount || 40},
  ${p.isFeatured ? 'true' : 'false'}, ${p.isBestseller ? 'true' : 'false'}, ${p.isNewArrival ? 'true' : 'false'}, true
) ON CONFLICT (sku) DO UPDATE SET
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  stock_quantity = EXCLUDED.stock_quantity;

-- Images for Product ${idx + 1}
INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order, is_primary)
VALUES
  ('${prodUuid}', '${primaryImgSafe}', '${nameSafe} - Primary', 0, true)`;

  if (p.galleryImages && p.galleryImages.length > 0) {
    p.galleryImages.forEach((img, gIdx) => {
      const gImgSafe = img.replace(/'/g, "''");
      sql += `,
  ('${prodUuid}', '${gImgSafe}', '${nameSafe} - Gallery ${gIdx + 1}', ${gIdx + 1}, false)`;
    });
  }
  sql += `;\n`;

  // Color variants
  if (p.colorsAvailable && p.colorsAvailable.length > 0) {
    p.colorsAvailable.forEach((col, cIdx) => {
      const varSku = `${sku}-COL-${cIdx + 1}`;
      const varUuid = `33333333-3333-4333-c333-${String((idx * 10) + cIdx + 1).padStart(12, '0')}`;
      const colSafe = col.name.replace(/'/g, "''");
      sql += `INSERT INTO public.product_variants (id, product_id, name, value, price, sku, stock_quantity, is_active)
VALUES ('${varUuid}', '${prodUuid}', 'Color', '${colSafe}', ${p.price}, '${varSku}', 15, true)
ON CONFLICT (sku) DO NOTHING;\n`;
    });
  }

  // Base inventory
  sql += `INSERT INTO public.inventory (product_id, quantity, reserved_quantity, low_stock_threshold)
VALUES ('${prodUuid}', ${p.inventoryCount || 40}, 0, 5)
ON CONFLICT (product_id, variant_id) DO UPDATE SET quantity = EXCLUDED.quantity;\n`;
});

fs.writeFileSync('./supabase/seed.sql', sql, 'utf8');
console.log('Successfully wrote ./supabase/seed.sql with products count:', INITIAL_PRODUCTS.length);
