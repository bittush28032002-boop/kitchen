-- ====================================================================
-- KitchenCraft Supabase Database Schema
-- Complete PostgreSQL schema for KitchenCraft Premium Kitchenware
-- ====================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. PROFILES (Customers & Admins linked to Supabase Auth)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role and email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ====================================================================
-- 3. CATEGORIES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 4. PRODUCTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= price),
    discount_percentage INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN compare_at_price > price THEN ROUND(((compare_at_price - price) / compare_at_price) * 100)::INTEGER
            ELSE 0 
        END
    ) STORED,
    sku TEXT NOT NULL UNIQUE,
    material TEXT NOT NULL,
    color TEXT NOT NULL,
    size TEXT,
    weight TEXT,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_new BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON public.products(is_bestseller);

-- ====================================================================
-- 5. PRODUCT IMAGES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- ====================================================================
-- 6. PRODUCT VARIANTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,        -- e.g. 'Color' or 'Size'
    value TEXT NOT NULL,       -- e.g. 'Forest Green', 'Ivory Cream', '10.5 inch'
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    sku TEXT NOT NULL UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);

-- ====================================================================
-- 7. INVENTORY (Real-time stock tracking with reservation)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_variant_inventory UNIQUE (product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON public.inventory(product_id);

-- ====================================================================
-- 8. SHOPPING CARTS & CART ITEMS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carts_user ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session ON public.carts(session_id);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_cart_item UNIQUE (cart_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);

-- ====================================================================
-- 9. WISHLISTS & WISHLIST ITEMS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_wishlist_product UNIQUE (wishlist_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_user ON public.wishlist_items(wishlist_id);

-- ====================================================================
-- 10. ADDRESSES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- ====================================================================
-- 11. COUPONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    minimum_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (minimum_order_amount >= 0),
    maximum_discount NUMERIC(10, 2),
    usage_limit INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 12. ORDERS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL UNIQUE,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    shipping_address JSONB NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Preparing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- ====================================================================
-- 13. ORDER ITEMS (Historical snapshot at time of purchase)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ====================================================================
-- 14. REVIEWS (Verified purchase only)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_user_order_review UNIQUE (product_id, user_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);

-- ====================================================================
-- 15. FUNCTIONS & TRIGGERS
-- ====================================================================

-- Function: Sequence for Order Number (KC-2026-000001)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'KC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Function: Recalculate product rating & review_count on review changes
CREATE OR REPLACE FUNCTION recalculate_product_ratings()
RETURNS TRIGGER AS $$
DECLARE
    target_product_id UUID;
BEGIN
    target_product_id := COALESCE(NEW.product_id, OLD.product_id);
    UPDATE public.products
    SET 
        rating = COALESCE((SELECT ROUND(AVG(rating), 2) FROM public.reviews WHERE product_id = target_product_id AND is_approved = true), 5.00),
        review_count = COALESCE((SELECT COUNT(*) FROM public.reviews WHERE product_id = target_product_id AND is_approved = true), 0),
        updated_at = NOW()
    WHERE id = target_product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalculate_ratings_insert_update
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION recalculate_product_ratings();

CREATE TRIGGER trg_recalculate_ratings_delete
AFTER DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION recalculate_product_ratings();

-- Function: Single default address per user
CREATE OR REPLACE FUNCTION maintain_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = TRUE THEN
        UPDATE public.addresses
        SET is_default = FALSE
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_maintain_single_default_address
BEFORE INSERT OR UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION maintain_single_default_address();

-- Function: Decrease inventory when order is placed
CREATE OR REPLACE FUNCTION on_order_placed_decrease_inventory()
RETURNS TRIGGER AS $$
BEGIN
    -- Decrease stock in products table
    UPDATE public.products
    SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity),
        updated_at = NOW()
    WHERE id = NEW.product_id;

    -- Decrease stock in inventory table
    UPDATE public.inventory
    SET quantity = GREATEST(0, quantity - NEW.quantity),
        updated_at = NOW()
    WHERE product_id = NEW.product_id 
      AND (variant_id IS NULL OR variant_id = NEW.variant_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_on_order_placed_decrease_inventory
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION on_order_placed_decrease_inventory();

-- Function: Auto-create customer profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone can view (for reviews/authors), owner and admin can update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories & Products & Variants: Public read, Admin write
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (is_admin());

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (is_admin());

CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin manage product_images" ON public.product_images FOR ALL USING (is_admin());

CREATE POLICY "Public read product_variants" ON public.product_variants FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage product_variants" ON public.product_variants FOR ALL USING (is_admin());

CREATE POLICY "Public read inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Admin manage inventory" ON public.inventory FOR ALL USING (is_admin());

-- Carts: User can manage their own cart
CREATE POLICY "User manage own cart" ON public.carts FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "User manage own cart items" ON public.cart_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.user_id IS NULL))
);

-- Wishlist: User can manage own wishlist
CREATE POLICY "User manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User manage own wishlist items" ON public.wishlist_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
);

-- Addresses: User can manage own addresses
CREATE POLICY "User manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Coupons: Everyone can read active coupons, Admins manage
CREATE POLICY "Public view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (is_admin());

-- Orders: User can view their own orders, Admin can view/update all
CREATE POLICY "User view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "User create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (is_admin());

-- Order items: Viewable if order is viewable
CREATE POLICY "View order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Reviews: Approved reviews are public, users can create review if verified purchase
CREATE POLICY "Public view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true OR is_admin());
CREATE POLICY "User insert review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User update own review" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin manage reviews" ON public.reviews FOR ALL USING (is_admin());

-- ====================================================================
-- 17. SUPABASE STORAGE BUCKETS (Products and Avatars)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND is_admin());
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "User upload avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
