// Product data for YourRoomie.
// Each product's "image" matches a file inside assets/images/.
// To add a new product, copy one of the objects and give it a new id.

const products = [
  {
    id: 1, name: "Elegance Fabric Sofa", category: "Living Room", type: "Sofas",
    price: 599, oldPrice: 699, rating: 4.9, reviews: 128, image: "sofa-fabric", badge: "New",
    desc: "A deep, soft three-seater wrapped in a durable woven fabric. The solid wood frame and high-density foam keep its shape for years.",
    specs: { Material: "Woven fabric, pine frame", Size: "210 x 90 x 85 cm", Seats: "3 people", Color: "Sage green" }
  },
  {
    id: 2, name: "Modern Coffee Table", category: "Living Room", type: "Tables",
    price: 249, oldPrice: 299, rating: 4.8, reviews: 96, image: "coffee-table",
    desc: "A rounded oak coffee table with a lower shelf for books and magazines. Simple enough to sit in any living room.",
    specs: { Material: "Solid oak", Size: "110 x 60 x 42 cm", Shelf: "Yes", Color: "Natural oak" }
  },
  {
    id: 3, name: "Minimalist Lounge Chair", category: "Living Room", type: "Chairs",
    price: 189, oldPrice: 229, rating: 4.7, reviews: 84, image: "lounge-chair",
    desc: "A low, relaxed lounge chair with a curved back and wooden legs. Great for a reading corner.",
    specs: { Material: "Velvet, beech legs", Size: "75 x 80 x 78 cm", Weight: "9 kg", Color: "Mustard" }
  },
  {
    id: 4, name: "Wooden Bookshelf", category: "Living Room", type: "Storage",
    price: 329, oldPrice: 399, rating: 4.8, reviews: 75, image: "bookshelf",
    desc: "Five open shelves with a sturdy back panel. Holds books, plants and all the small things that make a room feel lived in.",
    specs: { Material: "Engineered wood, oak veneer", Size: "90 x 30 x 180 cm", Shelves: "5", Color: "Light oak" }
  },
  {
    id: 5, name: "Comfort Bed Frame", category: "Bedroom", type: "Beds",
    price: 799, oldPrice: 899, rating: 4.9, reviews: 142, image: "bed-frame",
    desc: "A bed frame with a padded headboard and strong slats, so you do not need a box spring. Quiet and stable.",
    specs: { Material: "Fabric headboard, solid wood slats", Size: "Queen 160 x 200 cm", Height: "105 cm", Color: "Slate grey" }
  },
  {
    id: 6, name: "Indoor Plant & Pot", category: "Decor", type: "Plants",
    price: 79, oldPrice: 99, rating: 4.8, reviews: 112, image: "plant-pot",
    desc: "A healthy indoor plant in a matte ceramic pot. Easy to care for and good with medium light.",
    specs: { Pot: "Ceramic, 24 cm", Height: "~80 cm", Light: "Medium", Water: "Once a week" }
  },
  {
    id: 7, name: "Modern 3 Seater Sofa", category: "Living Room", type: "Sofas",
    price: 549, oldPrice: 729, rating: 4.9, reviews: 210, image: "sofa-3seater", deal: 25,
    desc: "A clean-lined sofa in a neutral grey with deep seats and thick cushions. Easy to pair with any colour.",
    specs: { Material: "Polyester blend, hardwood frame", Size: "200 x 88 x 82 cm", Seats: "3 people", Color: "Stone grey" }
  },
  {
    id: 8, name: "Dining Table Set", category: "Dining", type: "Tables",
    price: 419, oldPrice: 599, rating: 4.8, reviews: 98, image: "dining-set", deal: 30,
    desc: "A solid wood dining table with four matching chairs. Comfortable for family dinners and big enough for guests.",
    specs: { Material: "Rubberwood", Table: "150 x 85 cm", Chairs: "4 included", Color: "Walnut" }
  },
  {
    id: 9, name: "King Size Bed", category: "Bedroom", type: "Beds",
    price: 699, oldPrice: 879, rating: 4.9, reviews: 167, image: "bed-king", deal: 20,
    desc: "A warm wooden king bed with a low profile and a tall headboard. Slats are included.",
    specs: { Material: "Solid wood", Size: "King 180 x 200 cm", Height: "110 cm", Color: "Honey oak" }
  },
  {
    id: 10, name: "Floor Lamp", category: "Decor", type: "Lighting",
    price: 89, oldPrice: 119, rating: 4.8, reviews: 64, image: "floor-lamp", deal: 25,
    desc: "A slim floor lamp with a linen shade and a soft warm glow. Fits neatly beside a sofa or bed.",
    specs: { Material: "Metal base, linen shade", Height: "160 cm", Bulb: "E27, max 40W", Color: "Brass" }
  },
  {
    id: 11, name: "TV Console Unit", category: "Living Room", type: "Storage",
    price: 359, oldPrice: 429, rating: 4.7, reviews: 51, image: "tv-console",
    desc: "A low console with two doors and an open shelf. Cable holes at the back keep everything tidy.",
    specs: { Material: "Engineered wood", Size: "160 x 40 x 50 cm", Storage: "2 doors + 1 shelf", Color: "Walnut" }
  },
  {
    id: 12, name: "Round Side Table", category: "Bedroom", type: "Tables",
    price: 69, oldPrice: 89, rating: 4.6, reviews: 45, image: "side-table",
    desc: "A small round table that works as a bedside table or next to the sofa. Light enough to move around.",
    specs: { Material: "Metal and MDF", Size: "45 x 45 cm", Height: "52 cm", Color: "Oak / black" }
  }
];

const testimonials = [
  { name: "Sophea Chan", place: "Phnom Penh, Cambodia", avatar: "avatar-1",
    text: "Really love the quality and the design. YourRoomie made my living room look brand new. Delivery was fast too." },
  { name: "Dara Kim", place: "Siem Reap, Cambodia", avatar: "avatar-2",
    text: "The bed frame is solid and looks even better in person. Setup took less than an hour." },
  { name: "Lina Park", place: "Battambang, Cambodia", avatar: "avatar-3",
    text: "Good prices for the quality. Customer support answered all my questions quickly." }
];

const posts = [
  { tag: "Interior Tips", title: "5 Easy Ways to Make Your Living Room Look Expensive", date: "Aug 15, 2026", image: "blog-1" },
  { tag: "Home Decor", title: "Minimalist Bedroom Ideas for a Peaceful Lifestyle", date: "Aug 10, 2026", image: "blog-2" },
  { tag: "Buying Guide", title: "How to Choose the Perfect Sofa for Your Home", date: "Aug 05, 2026", image: "blog-3" }
];
