-- Legacy E-commerce Database Schema
-- This represents a typical legacy database that has evolved over years
-- with various naming conventions, data types, and architectural decisions

-- Create separate schema for legacy demo
CREATE SCHEMA IF NOT EXISTS legacy_ecommerce;
SET search_path TO legacy_ecommerce;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- User Management Tables (typical legacy pattern)
CREATE TABLE user_accounts (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email_address VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_time TIMESTAMP,
    account_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_by INTEGER DEFAULT 1,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profile Extended Info (normalized approach)
CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_accounts(user_id) ON DELETE CASCADE,
    profile_picture_url TEXT,
    bio TEXT,
    website_url VARCHAR(255),
    social_media_links JSONB,
    preferences JSONB DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language_preference VARCHAR(10) DEFAULT 'en',
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Address Management (typical e-commerce pattern)
CREATE TABLE customer_addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_accounts(user_id) ON DELETE CASCADE,
    address_type VARCHAR(20) DEFAULT 'SHIPPING' CHECK (address_type IN ('SHIPPING', 'BILLING', 'BOTH')),
    address_label VARCHAR(50), -- 'Home', 'Work', etc.
    recipient_name VARCHAR(100) NOT NULL,
    street_address_line1 VARCHAR(255) NOT NULL,
    street_address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'US',
    is_default_address BOOLEAN DEFAULT FALSE,
    delivery_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Category Hierarchy (typical nested structure)
CREATE TABLE product_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_slug VARCHAR(100) UNIQUE NOT NULL,
    parent_category_id INTEGER REFERENCES product_categories(category_id),
    category_description TEXT,
    category_image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seo_meta_title VARCHAR(160),
    seo_meta_description VARCHAR(320),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brand Management
CREATE TABLE product_brands (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    brand_slug VARCHAR(100) UNIQUE NOT NULL,
    brand_description TEXT,
    brand_logo_url TEXT,
    official_website VARCHAR(255),
    country_of_origin VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Master (complex product structure)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    category_id INTEGER NOT NULL REFERENCES product_categories(category_id),
    brand_id INTEGER REFERENCES product_brands(brand_id),
    product_type VARCHAR(50) DEFAULT 'SIMPLE' CHECK (product_type IN ('SIMPLE', 'CONFIGURABLE', 'BUNDLE', 'DIGITAL')),
    base_price DECIMAL(12,2) NOT NULL,
    sale_price DECIMAL(12,2),
    cost_price DECIMAL(12,2),
    weight_kg DECIMAL(8,3),
    dimensions_cm VARCHAR(50), -- LxWxH format
    tax_class VARCHAR(50) DEFAULT 'STANDARD',
    is_featured BOOLEAN DEFAULT FALSE,
    is_digital BOOLEAN DEFAULT FALSE,
    requires_shipping BOOLEAN DEFAULT TRUE,
    track_inventory BOOLEAN DEFAULT TRUE,
    manage_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    stock_status VARCHAR(20) DEFAULT 'IN_STOCK' CHECK (stock_status IN ('IN_STOCK', 'OUT_OF_STOCK', 'BACKORDER')),
    visibility VARCHAR(20) DEFAULT 'CATALOG' CHECK (visibility IN ('CATALOG', 'SEARCH', 'HIDDEN')),
    product_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (product_status IN ('ACTIVE', 'INACTIVE', 'DRAFT')),
    seo_meta_title VARCHAR(160),
    seo_meta_description VARCHAR(320),
    created_by INTEGER DEFAULT 1,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Images (one-to-many relationship)
CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_alt_text VARCHAR(255),
    image_type VARCHAR(20) DEFAULT 'GALLERY' CHECK (image_type IN ('MAIN', 'GALLERY', 'THUMBNAIL')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    file_size_bytes INTEGER,
    image_dimensions VARCHAR(20), -- WxH format
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Attributes (EAV pattern - common in legacy systems)
CREATE TABLE product_attributes (
    attribute_id SERIAL PRIMARY KEY,
    attribute_name VARCHAR(100) NOT NULL UNIQUE,
    attribute_code VARCHAR(50) NOT NULL UNIQUE,
    attribute_type VARCHAR(20) DEFAULT 'TEXT' CHECK (attribute_type IN ('TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'SELECT', 'MULTISELECT')),
    is_required BOOLEAN DEFAULT FALSE,
    is_filterable BOOLEAN DEFAULT FALSE,
    is_searchable BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_attribute_values (
    value_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    attribute_id INTEGER NOT NULL REFERENCES product_attributes(attribute_id) ON DELETE CASCADE,
    attribute_value TEXT,
    UNIQUE(product_id, attribute_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping Cart (session-based approach)
CREATE TABLE shopping_carts (
    cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES user_accounts(user_id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- for guest users
    cart_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (cart_status IN ('ACTIVE', 'ABANDONED', 'CONVERTED')),
    currency_code CHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')
);

CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES shopping_carts(cart_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    product_options JSONB, -- for configurable products
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Management (complex order structure)
CREATE TABLE customer_orders (
    order_id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES user_accounts(user_id),
    guest_email VARCHAR(100), -- for guest checkout
    order_status VARCHAR(30) DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')),
    payment_status VARCHAR(30) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'PARTIAL_PAID', 'FAILED', 'REFUNDED', 'CANCELLED')),
    currency_code CHAR(3) DEFAULT 'USD',
    subtotal_amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    shipping_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,

    -- Billing Information
    billing_first_name VARCHAR(50),
    billing_last_name VARCHAR(50),
    billing_company VARCHAR(100),
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country_code CHAR(2),
    billing_phone VARCHAR(20),

    -- Shipping Information
    shipping_first_name VARCHAR(50),
    shipping_last_name VARCHAR(50),
    shipping_company VARCHAR(100),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country_code CHAR(2),
    shipping_phone VARCHAR(20),
    shipping_method VARCHAR(100),

    -- Metadata
    order_notes TEXT,
    internal_notes TEXT,
    coupon_code VARCHAR(50),
    referral_source VARCHAR(100),
    user_agent TEXT,
    ip_address INET,

    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES customer_orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    product_sku VARCHAR(100) NOT NULL, -- snapshot at time of order
    product_name VARCHAR(255) NOT NULL, -- snapshot at time of order
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    product_options JSONB, -- configuration options
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    transaction_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES customer_orders(order_id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50),
    transaction_reference VARCHAR(255),
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('PAYMENT', 'REFUND', 'PARTIAL_REFUND')),
    transaction_status VARCHAR(20) CHECK (transaction_status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
    currency_code CHAR(3) DEFAULT 'USD',
    amount DECIMAL(12,2) NOT NULL,
    provider_response JSONB,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and Ratings
CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES user_accounts(user_id) ON DELETE SET NULL,
    order_id INTEGER REFERENCES customer_orders(order_id),
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_email VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(200),
    review_content TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Tracking
CREATE TABLE inventory_transactions (
    transaction_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER')),
    quantity_change INTEGER NOT NULL,
    remaining_quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'ORDER', 'RETURN', 'ADJUSTMENT', etc.
    reference_id INTEGER,
    notes TEXT,
    created_by INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
-- User-related indexes
CREATE INDEX idx_user_accounts_email ON user_accounts(email_address);
CREATE INDEX idx_user_accounts_username ON user_accounts(username);
CREATE INDEX idx_user_accounts_status ON user_accounts(account_status);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Address indexes
CREATE INDEX idx_customer_addresses_user_id ON customer_addresses(user_id);
CREATE INDEX idx_customer_addresses_default ON customer_addresses(is_default_address) WHERE is_default_address = TRUE;

-- Product indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_slug ON products(product_slug);
CREATE INDEX idx_products_status ON products(product_status);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON products(base_price);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Full-text search indexes
CREATE INDEX idx_products_name_gin ON products USING GIN (to_tsvector('english', product_name));
CREATE INDEX idx_products_description_gin ON products USING GIN (to_tsvector('english', detailed_description));

-- Category hierarchy index
CREATE INDEX idx_product_categories_parent ON product_categories(parent_category_id);
CREATE INDEX idx_product_categories_slug ON product_categories(category_slug);

-- Order indexes
CREATE INDEX idx_customer_orders_user_id ON customer_orders(user_id);
CREATE INDEX idx_customer_orders_status ON customer_orders(order_status);
CREATE INDEX idx_customer_orders_placed_at ON customer_orders(placed_at);
CREATE INDEX idx_customer_orders_number ON customer_orders(order_number);

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Cart indexes
CREATE INDEX idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX idx_shopping_carts_session_id ON shopping_carts(session_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);

-- Review indexes
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_approved ON product_reviews(is_approved) WHERE is_approved = TRUE;

-- Composite indexes for common queries
CREATE INDEX idx_products_category_status ON products(category_id, product_status);
CREATE INDEX idx_products_brand_status ON products(brand_id, product_status);
CREATE INDEX idx_order_items_product_created ON order_items(product_id, created_at);

-- Create some seed data for demonstration
INSERT INTO user_accounts (username, email_address, password_hash, first_name, last_name) VALUES
('john_legacy', 'john.legacy@example.com', '$2b$10$hash', 'John', 'Legacy'),
('jane_admin', 'jane.admin@example.com', '$2b$10$hash', 'Jane', 'Admin');

INSERT INTO product_categories (category_name, category_slug, category_description) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories'),
('Computers', 'computers', 'Desktop and laptop computers'),
('Smartphones', 'smartphones', 'Mobile phones and accessories');

INSERT INTO product_categories (category_name, category_slug, parent_category_id, category_description) VALUES
('Laptops', 'laptops', 2, 'Portable computers'),
('Accessories', 'accessories', 1, 'Electronic accessories');

INSERT INTO product_brands (brand_name, brand_slug, brand_description) VALUES
('LegacyTech', 'legacytech', 'Premium technology brand'),
('OldBrand', 'oldbrand', 'Established electronics manufacturer');

-- Reset search path
SET search_path TO public;