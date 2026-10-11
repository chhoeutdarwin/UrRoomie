// YourRoomie - main script
// Needs data.js to be loaded first (products, posts).

const IMG = "assets/images/";
const SHIPPING_FREE_OVER = 500;
const SHIPPING_FEE = 25;

/* ------------------------------------------------------------------
   Small helpers
------------------------------------------------------------------ */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
const money = n => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const findProduct = id => products.find(p => p.id === Number(id));

const icons = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L20.5 8H6"/><circle cx="9.5" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v10H2zM13 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>',
  support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
  sofa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3zM6 17v2M18 17v2"/></svg>'
};

/* ------------------------------------------------------------------
   Cart (saved in localStorage so it survives page changes)
------------------------------------------------------------------ */
const Cart = {
  key: "yourroomie_cart",
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch (e) { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.key, JSON.stringify(items)); } catch (e) {}
    updateCartCount();
  },
  add(id, qty = 1) {
    const items = this.get();
    const found = items.find(i => i.id === id);
    if (found) found.qty += qty;
    else items.push({ id, qty });
    this.save(items);
  },
  setQty(id, qty) {
    let items = this.get();
    items = qty <= 0 ? items.filter(i => i.id !== id) : items.map(i => i.id === id ? { ...i, qty } : i);
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); },
  subtotal() { return this.get().reduce((sum, i) => sum + (findProduct(i.id)?.price || 0) * i.qty, 0); }
};

function updateCartCount() {
  const n = Cart.count();
  $$(".cart-count").forEach(el => { el.textContent = n; el.style.display = n ? "grid" : "none"; });
}

let toastTimer;
function toast(msg) {
  let el = $(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ------------------------------------------------------------------
   Top menu
   On the Home page every tab except Shop glides to its section with a
   smooth scroll. From any other page the same tabs open Home first
   (index.html?go=deals), then glide to the section.
   "target" = the section id on Home, "cat" = which Featured tab to open.
------------------------------------------------------------------ */
const NAV = [
  { key: "home",        label: "Home",        href: "index.html#home", target: "#home" },
  { key: "shop",        label: "Shop",        href: "shop.html" },
  { key: "living",      label: "Living Room", href: "index.html?go=living#featured",      target: "#featured",    cat: "Living Room" },
  { key: "bedroom",     label: "Bedroom",     href: "index.html?go=bedroom#featured",     target: "#featured",    cat: "Bedroom" },
  { key: "deals",       label: "Deals",       href: "index.html?go=deals#deals",          target: "#deals" },
  { key: "inspiration", label: "Inspiration", href: "index.html?go=inspiration#inspiration", target: "#inspiration" }
];

function renderHeader() {
  const page = document.body.dataset.page;
  const go = new URLSearchParams(window.location.search).get("go");
  const current = page === "home" ? (go || "home") : page;   // which tab is underlined

  const links = NAV.map(n => {
    const href = page === "home" && n.key !== "shop"
      ? (n.target || "#home")
      : n.href;
    return `<a href="${href}" data-key="${n.key}" class="${n.key === current ? "active" : ""}">${n.label}</a>`;
  }
  ).join("");

  $("#site-header").innerHTML = `
    <div class="container nav">
      <a href="index.html" class="logo">Your<span>Roomie</span></a>
      <nav class="nav-links" id="navLinks">${links}</nav>
      <div class="nav-actions">
        <form class="search-box" id="searchForm">
          ${icons.search}
          <input type="search" id="searchInput" placeholder="Search furniture..." aria-label="Search">
        </form>
        <a href="cart.html" class="icon-btn" aria-label="Cart">${icons.cart}<span class="cart-count">0</span></a>
        <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Menu">${icons.menu}</button>
      </div>
    </div>`;

  $("#menuToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $("#searchForm").addEventListener("submit", e => {
    e.preventDefault();
    const q = $("#searchInput").value.trim();
    if (q) window.location.href = "shop.html?q=" + encodeURIComponent(q);
  });
}

function renderFooter() {
  $("#site-footer").innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="logo">Your<span>Roomie</span></a>
          <p style="margin-top:10px">Comfortable, simple furniture for people who want their home to feel like theirs.</p>
          <div class="socials"><a href="#">f</a><a href="#">in</a><a href="#">ig</a><a href="#">yt</a></div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="cart.html">Cart</a></li>
            <li><a href="index.html#inspiration">Inspiration</a></li>
          </ul>
        </div>
        <div>
          <h4>Customer Care</h4>
          <ul>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns &amp; Refunds</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>Siem Reap city, Cambodia</li>
            <li>+855 6767676767</li>
            <li>hellodarwin@gmail.com</li>
          </ul>
        </div>
      </div>
      <p class="copyright">&copy; ${new Date().getFullYear()} YourRoomie. portfolio project.</p>
    </div>`;
}

/* ------------------------------------------------------------------
   Product card (used on home, shop, related products)
------------------------------------------------------------------ */
function productCard(p) {
  const badge = p.deal ? `<span class="badge sale">-${p.deal}%</span>` : p.badge ? `<span class="badge">${p.badge}</span>` : "";
  return `
    <article class="product-card">
      ${badge}
      <a class="thumb" href="product.html?id=${p.id}"><img src="${IMG}${p.image}.jpg" alt="${p.name}" loading="lazy"></a>
      <div class="product-info">
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="rating"><span class="star">&#9733;</span> ${p.rating} (${p.reviews})</div>
        <div class="price-row">
          <span class="price">${money(p.price)}<del>${money(p.oldPrice)}</del></span>
          <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">${icons.cart}</button>
        </div>
      </div>
    </article>`;
}

// One listener handles every "add to cart" button on the page
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const p = findProduct(btn.dataset.add);
  Cart.add(p.id);
  toast(p.name + " added to cart");
});

/* ------------------------------------------------------------------
   Scroll reveal
------------------------------------------------------------------ */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("visible")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(i => io.observe(i));
}

/* ------------------------------------------------------------------
   HOME PAGE
   Every block checks that its element exists, so you can delete a
   section from index.html without breaking the rest of the page.
------------------------------------------------------------------ */
function initHome() {
  // featured products with filter tabs
  const grid = $("#featuredGrid");
  let showFeatured = null;
  let featuredCat = "All";
  if (grid) {
    const featured = products.slice(0, 6);
    showFeatured = cat => {
      if (cat === featuredCat) return;
      featuredCat = cat;
      $$("#featuredTabs .tab").forEach(t => t.classList.toggle("active", t.dataset.cat === cat));
      const list = cat === "All" ? featured : products.filter(p => p.category === cat).slice(0, 6);
      grid.innerHTML = list.length ? list.map(productCard).join("") : '<p class="empty-msg">Nothing here yet.</p>';
      grid.classList.remove("swap");
      void grid.offsetWidth;          // restart the CSS animation
      grid.classList.add("swap");
    };
    grid.innerHTML = featured.map(productCard).join("");
    $$("#featuredTabs .tab").forEach(tab => tab.addEventListener("click", () => showFeatured(tab.dataset.cat)));
  }

  // deals
  const dealsGrid = $("#dealsGrid");
  if (dealsGrid) dealsGrid.innerHTML = products.filter(p => p.deal).map(productCard).join("");

  // countdown - ends 5 days from the first visit, saved so it doesn't reset on refresh
  if ($("#cd-d")) {
    let end;
    try { end = Number(localStorage.getItem("yr_offer_end")); } catch (e) {}
    if (!end || end < Date.now()) {
      end = Date.now() + 5 * 24 * 3600 * 1000;
      try { localStorage.setItem("yr_offer_end", end); } catch (e) {}
    }
    const pad = n => String(n).padStart(2, "0");
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      const parts = {
        d: Math.floor(left / 864e5),
        h: Math.floor(left / 36e5) % 24,
        m: Math.floor(left / 6e4) % 60,
        s: Math.floor(left / 1e3) % 60
      };
      for (const k in parts) $("#cd-" + k).textContent = pad(parts[k]);
    };
    tick();
    setInterval(tick, 1000);
  }

  // blog
  const blogGrid = $("#blogGrid");
  if (blogGrid) {
    blogGrid.innerHTML = posts.map(p => `
      <article class="blog-card">
        <div class="img"><img src="${IMG}${p.image}.jpg" alt="${p.title}" loading="lazy"><span class="tag">${p.tag}</span></div>
        <div class="body"><h3>${p.title}</h3><small>${p.date}</small></div>
      </article>`).join("");
  }

  // newsletter
  const newsForm = $("#newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = $("#newsEmail").value.trim();
      const msg = $("#newsMsg");
      if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = "Please enter a valid email."; return; }
      msg.textContent = "Thanks! You are subscribed.";
      e.target.reset();
    });
  }

  /* ---- top menu: glide to the section, the same way for every tab ---- */
  const setActiveNav = key => $$("#navLinks a").forEach(a => a.classList.toggle("active", a.dataset.key === key));

  const goTo = key => {
    const item = NAV.find(n => n.key === key);
    if (!item) return;
    const target = item.target ? $(item.target) : null;
    if (key !== "home" && !target) return;            // that section was removed from the page

    if (item.cat && showFeatured) showFeatured(item.cat);
    setActiveNav(key);
    $("#navLinks").classList.remove("open");           // close the mobile menu

    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  $("#navLinks").addEventListener("click", e => {
    const a = e.target.closest("a[data-key]");
    if (!a || a.dataset.key === "shop") return;        // Shop is a separate page
    e.preventDefault();
    e.stopPropagation();                               // skip the page fade, we stay on this page
    goTo(a.dataset.key);
  });

  // arriving from another page (index.html?go=deals): show the page, then glide to the section
  const go = new URLSearchParams(window.location.search).get("go");
  if (go && NAV.some(n => n.key === go)) {
    try { history.replaceState(null, "", window.location.pathname); } catch (e) {}
    const item = NAV.find(n => n.key === go);
    if (item.cat && showFeatured) showFeatured(item.cat);   // right products are ready before we scroll
    setTimeout(() => goTo(go), 450);
  }
}

/* ------------------------------------------------------------------
   SHOP PAGE
   Changing the category in the sidebar updates the list, the heading
   and the URL without reloading the page.
------------------------------------------------------------------ */
function initShop() {
  const params = new URLSearchParams(window.location.search);
  const state = {
    cat: params.get("cat") || "All",
    maxPrice: 900,
    sort: "default",
    q: params.get("q") || ""
  };

  const grid = $("#shopGrid");
  const cats = ["All", ...new Set(products.map(p => p.category))];
  $("#catFilters").innerHTML = cats.map(c => `
    <label><input type="radio" name="cat" value="${c}" ${c === state.cat ? "checked" : ""}> ${c}</label>`).join("");

  const render = (animate = false) => {
    const q = state.q.toLowerCase();
    let list = products.filter(p =>
      (state.cat === "All" || p.category === state.cat) &&
      p.price <= state.maxPrice &&
      (!q || (p.name + " " + p.type + " " + p.category).toLowerCase().includes(q))
    );
    if (state.sort === "low") list.sort((a, b) => a.price - b.price);
    if (state.sort === "high") list.sort((a, b) => b.price - a.price);
    if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);

    $("#resultCount").textContent = list.length + (list.length === 1 ? " product" : " products") +
      (state.q ? ` for "${state.q}"` : "");
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : '<p class="empty-msg">No products match your filters. Try a different category or price.</p>';

    if (animate) {
      grid.classList.remove("swap");
      void grid.offsetWidth;          // restart the CSS animation
      grid.classList.add("swap");
    }
  };

  // heading and tab title follow the current category
  const updateHeading = () => {
    $("h1").textContent = state.cat === "All" ? "Shop Furniture" : state.cat;
    document.title = (state.cat === "All" ? "Shop" : state.cat) + " | YourRoomie";
  };

  const setCategory = (cat, { push = true } = {}) => {
    state.cat = cat;
    state.q = "";
    const radio = $(`#catFilters input[value="${cat}"]`);
    if (radio) radio.checked = true;
    updateHeading();

    if (push) {
      try {
        const url = new URL(window.location.href);
        url.search = cat === "All" ? "" : "?cat=" + encodeURIComponent(cat);
        history.pushState({ cat }, "", url);
      } catch (err) { /* some file:// setups do not allow this, the filter still works */ }
    }
    render(true);
  };

  // browser Back / Forward buttons
  window.addEventListener("popstate", () => {
    const cat = new URLSearchParams(window.location.search).get("cat") || "All";
    setCategory(cat, { push: false });
  });

  // sidebar filters
  $$("#catFilters input").forEach(r => r.addEventListener("change", () => setCategory(r.value)));
  $("#priceRange").addEventListener("input", e => {
    state.maxPrice = Number(e.target.value);
    $("#priceLabel").textContent = "Up to " + money(state.maxPrice);
  });
  $("#priceRange").addEventListener("change", () => render());
  $("#sortSelect").addEventListener("change", e => { state.sort = e.target.value; render(); });
  $("#filterToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#resetFilters").addEventListener("click", () => {
    state.maxPrice = 900;
    state.sort = "default";
    $("#priceRange").value = 900;
    $("#priceLabel").textContent = "Up to $900";
    $("#sortSelect").value = "default";
    setCategory("All");
  });

  updateHeading();
  render();
}

/* ------------------------------------------------------------------
   PRODUCT DETAIL PAGE
------------------------------------------------------------------ */
function initProduct() {
  const id = new URLSearchParams(window.location.search).get("id");
  const p = findProduct(id);
  const box = $("#productDetail");

  if (!p) {
    box.innerHTML = `<div class="empty-cart" style="grid-column:1/-1">
      <h2>Product not found</h2><p>This item does not exist or was removed.</p>
      <a href="shop.html" class="btn btn-primary">Back to shop</a></div>`;
    $("#relatedSection").style.display = "none";
    return;
  }

  document.title = p.name + " | YourRoomie";
  $("#crumbName").textContent = p.name;
  const off = Math.round((1 - p.price / p.oldPrice) * 100);
  let qty = 1;

  box.innerHTML = `
    <div class="gallery">
      <div class="main-img"><img id="mainImg" src="${IMG}${p.image}.jpg" alt="${p.name}"></div>
      <div class="thumbs">
        <button class="active"><img src="${IMG}${p.image}.jpg" alt=""></button>
        <button><img src="${IMG}${p.image}.jpg" alt="" style="filter:brightness(.92)"></button>
        <button><img src="${IMG}${p.image}.jpg" alt="" style="filter:saturate(.8)"></button>
      </div>
    </div>
    <div class="detail-info">
      <span class="cat-label">${p.category} / ${p.type}</span>
      <h1>${p.name}</h1>
      <div class="rating"><span class="star">&#9733;</span> ${p.rating} &middot; ${p.reviews} reviews</div>
      <div class="detail-price">${money(p.price)}<del>${money(p.oldPrice)}</del><span class="off">-${off}%</span></div>
      <p>${p.desc}</p>
      <ul class="spec-list">
        ${Object.entries(p.specs).map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join("")}
      </ul>
      <div class="buy-row">
        <div class="qty">
          <button id="qtyMinus" aria-label="Decrease">&minus;</button>
          <span id="qtyNum">1</span>
          <button id="qtyPlus" aria-label="Increase">+</button>
        </div>
        <button class="btn btn-primary" id="addToCart">Add to Cart</button>
        <a href="cart.html" class="btn btn-outline">View Cart</a>
      </div>
    </div>`;

  // thumbnails just swap the active border (all three use the same photo until you add more)
  $$(".thumbs button").forEach(b => b.addEventListener("click", () => {
    $$(".thumbs button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    $("#mainImg").src = $("img", b).src;
  }));

  $("#qtyMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qtyNum").textContent = qty; });
  $("#qtyPlus").addEventListener("click", () => { qty = Math.min(10, qty + 1); $("#qtyNum").textContent = qty; });
  $("#addToCart").addEventListener("click", () => {
    Cart.add(p.id, qty);
    toast(qty + " x " + p.name + " added to cart");
  });

  const related = products.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4);
  const fill = related.length < 4 ? [...related, ...products.filter(x => x.id !== p.id && !related.includes(x))].slice(0, 4) : related;
  $("#relatedGrid").innerHTML = fill.map(productCard).join("");
}

/* ------------------------------------------------------------------
   CART PAGE
------------------------------------------------------------------ */
function initCart() {
  const wrap = $("#cartWrap");
  let discount = 0;

  const render = () => {
    const items = Cart.get();
    if (!items.length) {
      wrap.innerHTML = `<div class="empty-cart" style="grid-column:1/-1">
        <h2>Your cart is empty</h2>
        <p>Looks like you have not added anything yet.</p>
        <a href="shop.html" class="btn btn-primary">Start shopping</a></div>`;
      wrap.className = "";
      return;
    }
    wrap.className = "cart-layout";
    const sub = Cart.subtotal();
    const shipping = sub >= SHIPPING_FREE_OVER ? 0 : SHIPPING_FEE;
    const disc = Math.round(sub * discount * 100) / 100;
    const total = sub - disc + shipping;

    wrap.innerHTML = `
      <div class="cart-items">
        ${items.map(i => {
          const p = findProduct(i.id);
          if (!p) return "";
          return `
          <div class="cart-row" data-id="${p.id}">
            <a href="product.html?id=${p.id}"><img src="${IMG}${p.image}.jpg" alt="${p.name}"></a>
            <div><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><small>${p.category} &middot; ${money(p.price)} each</small></div>
            <div class="qty">
              <button data-act="minus" aria-label="Decrease">&minus;</button>
              <span>${i.qty}</span>
              <button data-act="plus" aria-label="Increase">+</button>
            </div>
            <div class="line-total">${money(p.price * i.qty)}</div>
            <button class="remove-btn" data-act="remove" aria-label="Remove">&times;</button>
          </div>`;
        }).join("")}
      </div>
      <aside class="summary">
        <h3>Order Summary</h3>
        <div class="sum-line"><span>Subtotal</span><span>${money(sub)}</span></div>
        ${disc ? `<div class="sum-line"><span>Discount (10%)</span><span>-${money(disc)}</span></div>` : ""}
        <div class="sum-line"><span>Shipping</span><span>${shipping ? money(shipping) : "Free"}</span></div>
        <div class="coupon">
          <input type="text" id="couponInput" placeholder="Coupon code">
          <button id="couponBtn">Apply</button>
        </div>
        <p class="coupon-msg" id="couponMsg">${discount ? "Coupon applied!" : ""}</p>
        <div class="sum-line total"><span>Total</span><span>${money(total)}</span></div>
        <button class="btn btn-primary btn-block" id="checkoutBtn">Checkout</button>
        <p style="font-size:.78rem;color:var(--muted);margin-top:10px;text-align:center">Free shipping on orders over ${money(SHIPPING_FREE_OVER)}</p>
      </aside>`;
  };

  wrap.addEventListener("click", e => {
    const btn = e.target.closest("[data-act], #couponBtn, #checkoutBtn");
    if (!btn) return;

    if (btn.id === "couponBtn") {
      const code = $("#couponInput").value.trim().toUpperCase();
      if (code === "ROOMIE10") { discount = 0.1; render(); }
      else $("#couponMsg").textContent = "Invalid code. Try ROOMIE10.";
      return;
    }
    if (btn.id === "checkoutBtn") {
      toast("This is a demo - checkout is not connected.");
      return;
    }
    const id = Number(btn.closest(".cart-row").dataset.id);
    const item = Cart.get().find(i => i.id === id);
    if (btn.dataset.act === "plus") Cart.setQty(id, item.qty + 1);
    if (btn.dataset.act === "minus") Cart.setQty(id, item.qty - 1);
    if (btn.dataset.act === "remove") Cart.remove(id);
    render();
  });

  render();
}

/* ------------------------------------------------------------------
   Start
------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  updateCartCount();
  initReveal();   // run first so sections always become visible

  const page = document.body.dataset.page;
  try {
    if (page === "home") initHome();
    if (page === "shop") initShop();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
  } catch (err) {
    console.error("Page script stopped:", err);   // shows the real error in the Console
  }
});