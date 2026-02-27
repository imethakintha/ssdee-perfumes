

# SSDee — Luxury Perfume E-Commerce Platform

## 1. Design System & Layout
- Deep matte black background with gold (#D4AF37) accent colors throughout
- Bold sans-serif typography (Inter or similar)
- Smooth scroll animations, premium hover effects on cards/buttons
- Fully responsive: mobile-first layout with elegant desktop expansion
- Persistent navbar with SSDee logo, nav links (Shop, Quiz, About), and admin link

## 2. Supabase Database Setup
- **Products table**: id, name, description, price, image_url, scent_notes, category_id, created_at
- **Categories table**: id, name, slug, created_at
- **User roles table**: user_id, role (admin enum) — for multi-admin support
- **Storage bucket**: product-images (public, with RLS for admin uploads)
- **Auth**: Supabase email/password auth, RLS policies restricting admin actions to users with admin role

## 3. Public Pages

### Hero / Landing Page
- Full-screen cinematic section with "BOOST YOUR DEMAND" headline
- Gold gradient CTA button leading to shop
- Subtle parallax or fade-in animations
- Featured products carousel below the fold

### Shop / Catalog Page
- Product grid with gold-bordered cards (image, name, price)
- Category filter bar (dynamically pulled from categories table)
- Click to open product detail modal/page with full description, scent notes, price
- "Order via WhatsApp" button on each product (opens wa.me link with pre-filled message, placeholder number for now)

### Scent Quiz
- Multi-step interactive quiz (3-4 questions about preferences: occasion, scent family, intensity)
- Animated step transitions
- Results page recommending matching products from the catalog

## 4. Admin Dashboard (Protected)

### Login
- Email/password login via Supabase Auth
- Route protection: only users with admin role can access /admin routes

### Product Management
- Table view of all products with search
- Add/Edit form: name, description, price, category (dropdown), scent notes, image upload (to Supabase Storage)
- Delete with confirmation dialog

### Category Management
- List of categories with inline edit and delete
- Add new category form
- Changes automatically reflect on public shop filters

### Admin User Management
- Invite new admins by email
- View/remove existing admin users

## 5. Pages Structure
- `/` — Hero landing page
- `/shop` — Catalog with filters
- `/quiz` — Scent quiz
- `/admin` — Dashboard (protected)
- `/admin/products` — Product CRUD
- `/admin/categories` — Category CRUD
- `/admin/users` — Admin management

