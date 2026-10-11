# YourRoomie

A small furniture store website built with plain HTML, CSS and JavaScript.

## Pages
- `index.html` - home page
- `shop.html` - all products with category, price and sort filters
- `product.html?id=1` - product detail page (reads the id from the URL)
- `cart.html` - cart with quantity buttons, coupon and totals

## Run it
Open the folder in VS Code, right-click `index.html` and choose "Open with Live Server".

## Replace the images
All photos live in `assets/images/`. Right now they are grey placeholders.
Save your own photo with the **same file name** and it will show up automatically.

| File | Used for | Suggested size |
|------|----------|----------------|
| hero.jpg | Home hero | 1400 x 900 |
| banner-offer.jpg, banner-design.jpg | Promo banners | 1200 x 700 |
| cat-sofas, cat-dining, cat-bedroom, cat-storage, cat-lighting, cat-decor (.jpg) | Category cards | 400 x 400 |
| sofa-fabric, coffee-table, lounge-chair, bookshelf, bed-frame, plant-pot, sofa-3seater, dining-set, bed-king, floor-lamp, tv-console, side-table (.jpg) | Products | 800 x 800 |
| blog-1, blog-2, blog-3 (.jpg) | Inspiration cards | 900 x 600 |
| avatar-1, avatar-2, avatar-3 (.jpg) | Testimonials | 200 x 200 |

## Edit products
Products, prices and reviews are in `js/data.js`.

## Notes
- Cart is saved in the browser (localStorage). Checkout is a demo only.
- Coupon code to try: `ROOMIE10`
- Colors are CSS variables at the top of `css/style.css`.
