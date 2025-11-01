# TODO: Integrate GET /api/orders/with-products into Admin Panel

## Steps to Complete

- [x] Add `getWithProducts` function to `ordersAPI` in `src/lib/api.ts`
- [x] Update `loadOrders` in `src/pages/admin/AdminOrders.tsx` to use `ordersAPI.getWithProducts()`
- [x] Modify order details dialog in `AdminOrders.tsx` to use embedded product details in orderItems
- [x] Remove or adjust global loading of products/variants if no longer needed
- [x] Test the admin panel to verify orders load with products
