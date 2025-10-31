-- Allow public to create orders and customers (for demo/guest checkout)
-- This enables non-authenticated users to place orders

-- Update customers RLS to allow public insert
DROP POLICY IF EXISTS "Public can create customers" ON public.customers;
CREATE POLICY "Public can create customers"
ON public.customers
FOR INSERT
TO public
WITH CHECK (true);

-- Update orders RLS to allow public insert
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- Update order_items RLS to allow public insert
DROP POLICY IF EXISTS "Public can create order items" ON public.order_items;
CREATE POLICY "Public can create order items"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (true);