/**
 * AURA E-Commerce Application Logic
 * Full functionality: Cart, Wishlist, Multi-currency, Filter/Search/Sort, Quick View,
 * Checkout Multi-Step Wizard, Contact Form Validation, Dark/Light Theme.
 */

// Application State
const AppState = {
  products: PRODUCTS_DATA,
  filteredProducts: [...PRODUCTS_DATA],
  cart: JSON.parse(localStorage.getItem('aura_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('aura_wishlist')) || [],
  currency: localStorage.getItem('aura_currency') || 'USD',
  theme: localStorage.getItem('aura_theme') || 'dark',
  activeCategory: 'all',
  searchQuery: '',
  maxPrice: 600,
  sortBy: 'featured',
  appliedCoupon: null, // { code: 'AURA20', discount: 0.20, label: '20% OFF' }
  quickViewProduct: null,
  quickViewSelectedColor: null,
  quickViewQty: 1
};

// Currency Configurations
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, decimals: 0 },
  EUR: { symbol: '€', rate: 0.92, decimals: 0 },
  GBP: { symbol: '£', rate: 0.79, decimals: 0 },
  INR: { symbol: '₹', rate: 84.0, decimals: 0 }
};

// Available Coupons
const COUPONS = {
  'AURA20': { discount: 0.20, label: '20% Exclusive Discount' },
  'WELCOME10': { discount: 0.10, label: '10% Welcome Discount' },
  'FREESHIP': { freeShipping: true, label: 'Complimentary Free Express Shipping' }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCurrency();
  initNavbarScroll();
  initEventListeners();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  initHeroShowcase();
  initFaq();
  initKeyboardShortcuts();
});

/* ==========================================================================
   THEME TOGGLING (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute('data-bs-theme', AppState.theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = AppState.theme === 'dark' 
      ? '<i class="bi bi-sun-fill text-warning"></i>' 
      : '<i class="bi bi-moon-stars-fill text-primary"></i>';
  }
}

function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('aura_theme', AppState.theme);
  initTheme();
  showToast(
    'Theme Changed',
    `Switched to ${AppState.theme === 'dark' ? 'Dark Obsidian' : 'Light Nordic'} mode.`,
    'info'
  );
}

/* ==========================================================================
   CURRENCY SWITCHING
   ========================================================================== */
function initCurrency() {
  const currencySelect = document.getElementById('currencySelector');
  if (currencySelect) {
    currencySelect.value = AppState.currency;
    currencySelect.addEventListener('change', (e) => {
      AppState.currency = e.target.value;
      localStorage.setItem('aura_currency', AppState.currency);
      renderProducts();
      updateCartUI();
      updateWishlistUI();
      if (AppState.quickViewProduct) {
        renderQuickView(AppState.quickViewProduct);
      }
      showToast('Currency Updated', `Displaying prices in ${AppState.currency}`, 'info');
    });
  }
}

function formatPrice(amountInUSD) {
  const curr = CURRENCIES[AppState.currency] || CURRENCIES.USD;
  const converted = Math.round(amountInUSD * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}

/* ==========================================================================
   NAVBAR & SCROLL EFFECTS
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-aura');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Smooth scroll active nav highlight
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link-aura[href="#${sectionId}"]`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link-aura').forEach(el => el.classList.remove('active'));
        navLink?.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   HERO SHOWCASE DYNAMICS
   ========================================================================== */
function initHeroShowcase() {
  const heroColorSwatches = document.querySelectorAll('.hero-color-swatch');
  const heroImg = document.getElementById('heroShowcaseImg');
  const heroColorLabel = document.getElementById('heroColorLabel');

  heroColorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      heroColorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const colorName = swatch.getAttribute('data-color-name');
      if (heroColorLabel) heroColorLabel.textContent = colorName;
      
      // Micro-animation for image change
      if (heroImg) {
        heroImg.style.opacity = '0.5';
        heroImg.style.transform = 'scale(0.96)';
        setTimeout(() => {
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 180);
      }
    });
  });
}

/* ==========================================================================
   PRODUCT CATALOG RENDERING & FILTERING
   ========================================================================== */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // Filter products by category, search query, max price
  let results = AppState.products.filter(item => {
    const matchesCategory = AppState.activeCategory === 'all' || item.category.toLowerCase() === AppState.activeCategory.toLowerCase();
    const query = AppState.searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) || 
      item.tagline.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query);
    const matchesPrice = item.price <= AppState.maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sorting
  if (AppState.sortBy === 'price-low') {
    results.sort((a, b) => a.price - b.price);
  } else if (AppState.sortBy === 'price-high') {
    results.sort((a, b) => b.price - a.price);
  } else if (AppState.sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (AppState.sortBy === 'newest') {
    results.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
  }

  AppState.filteredProducts = results;

  const countBadge = document.getElementById('productCountBadge');
  if (countBadge) {
    countBadge.textContent = `${results.length} Products Found`;
  }

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="p-5 border border-secondary rounded-4 bg-surface" style="max-width: 500px; margin: 0 auto;">
          <i class="bi bi-search text-warning display-4 mb-3"></i>
          <h4>No products matched your criteria</h4>
          <p class="text-secondary">Try adjusting your price range, searching for different keywords, or clearing filters.</p>
          <button class="btn btn-aura-primary mt-3" onclick="resetFilters()">Reset All Filters</button>
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(product => {
    const isWishlisted = AppState.wishlist.includes(product.id);
    const originalPriceHtml = product.originalPrice 
      ? `<span class="product-price-old">${formatPrice(product.originalPrice)}</span>` 
      : '';

    const colorsHtml = product.colors.map((c, i) => `
      <span class="color-swatch ${i === 0 ? 'active' : ''}" 
            style="background-color: ${c.hex};" 
            title="${c.name}"
            onclick="selectProductCardColor('${product.id}', '${c.name}', '${c.image}', this)">
      </span>
    `).join('');

    return `
      <div class="col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div class="product-card" id="card-${product.id}">
          <div class="product-card-top">
            <div class="product-card-badges">
              ${product.badge ? `<span class="product-badge ${product.badgeType || 'badge-gold'}">${product.badge}</span>` : ''}
            </div>
            
            <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    aria-label="Save to Wishlist" 
                    onclick="toggleWishlist('${product.id}')"
                    id="wishlist-btn-${product.id}">
              <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>

            <img src="${product.image}" alt="${product.name}" class="product-card-img" id="img-${product.id}" loading="lazy">

            <div class="product-quick-view-overlay">
              <button class="btn btn-quick-view" onclick="openQuickViewModal('${product.id}')">
                <i class="bi bi-eye me-1"></i> Quick View
              </button>
            </div>
          </div>

          <div class="product-card-body">
            <span class="product-category-tag">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-tagline">${product.tagline}</p>

            <div class="product-rating">
              <span class="rating-stars">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </span>
              <span class="fw-bold">${product.rating}</span>
              <span class="text-muted">(${product.reviewsCount})</span>
            </div>

            <div class="product-color-swatches">
              ${colorsHtml}
            </div>

            <div class="product-card-footer">
              <div class="product-price-box">
                <span class="product-price">${formatPrice(product.price)}</span>
                ${originalPriceHtml}
              </div>

              <button class="btn-add-to-cart" 
                      aria-label="Add ${product.name} to Cart" 
                      onclick="addToCart('${product.id}', '${product.colors[0]?.name || 'Standard'}', 1, true)"
                      title="Add to Cart">
                <i class="bi bi-bag-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectProductCardColor(productId, colorName, colorImg, swatchEl) {
  const card = document.getElementById(`card-${productId}`);
  if (!card) return;
  card.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  swatchEl.classList.add('active');
  
  const imgEl = document.getElementById(`img-${productId}`);
  if (imgEl && colorImg) {
    imgEl.style.opacity = '0.6';
    setTimeout(() => {
      imgEl.src = colorImg;
      imgEl.style.opacity = '1';
    }, 150);
  }
}

function resetFilters() {
  AppState.activeCategory = 'all';
  AppState.searchQuery = '';
  AppState.maxPrice = 600;
  AppState.sortBy = 'featured';

  const searchInput = document.getElementById('productSearchInput');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('priceRangeSlider');
  if (priceSlider) priceSlider.value = 600;
  const priceDisplay = document.getElementById('priceRangeDisplay');
  if (priceDisplay) priceDisplay.textContent = formatPrice(600);

  const sortSelect = document.getElementById('productSortSelect');
  if (sortSelect) sortSelect.value = 'featured';

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
  });

  renderProducts();
}

/* ==========================================================================
   SHOPPING CART OPERATIONS
   ========================================================================== */
function addToCart(productId, colorName = 'Standard', qty = 1, openDrawer = true) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = AppState.cart.findIndex(item => 
    item.productId === productId && item.color === colorName
  );

  if (existingIndex > -1) {
    AppState.cart[existingIndex].quantity += qty;
  } else {
    AppState.cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      color: colorName,
      quantity: qty
    });
  }

  saveCart();
  updateCartUI();

  // Badge bounce effect
  const badge = document.getElementById('cartBadgeCount');
  if (badge) {
    badge.classList.remove('badge-bounce');
    void badge.offsetWidth; // trigger reflow
    badge.classList.add('badge-bounce');
  }

  showToast('Added to Cart', `${product.name} (${colorName}) added to your bag.`, 'success');

  if (openDrawer) {
    const cartOffcanvasEl = document.getElementById('cartOffcanvas');
    if (cartOffcanvasEl && window.bootstrap) {
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvasEl);
      bsOffcanvas.show();
    }
  }
}

function removeFromCart(index) {
  if (index >= 0 && index < AppState.cart.length) {
    const removedItem = AppState.cart[index];
    AppState.cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast('Item Removed', `${removedItem.name} removed from your bag.`, 'info');
  }
}

function updateCartQuantity(index, delta) {
  if (index >= 0 && index < AppState.cart.length) {
    const item = AppState.cart[index];
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(index);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function saveCart() {
  localStorage.setItem('aura_cart', JSON.stringify(AppState.cart));
}

function getCartCalculations() {
  let subtotal = 0;
  let totalItems = 0;

  AppState.cart.forEach(item => {
    subtotal += item.price * item.quantity;
    totalItems += item.quantity;
  });

  let discount = 0;
  if (AppState.appliedCoupon && AppState.appliedCoupon.discount) {
    discount = subtotal * AppState.appliedCoupon.discount;
  }

  // Free shipping threshold: $99 or if coupon grants free shipping
  const freeShippingThreshold = 99;
  const isFreeShipping = subtotal >= freeShippingThreshold || (AppState.appliedCoupon && AppState.appliedCoupon.freeShipping);
  const shipping = (subtotal === 0 || isFreeShipping) ? 0 : 15;

  const estimatedTax = (subtotal - discount) > 0 ? (subtotal - discount) * 0.08 : 0;
  const grandTotal = Math.max(0, subtotal - discount + shipping + estimatedTax);

  return {
    subtotal,
    discount,
    shipping,
    estimatedTax,
    grandTotal,
    totalItems,
    isFreeShipping,
    freeShippingThreshold
  };
}

function updateCartUI() {
  const calc = getCartCalculations();

  // Header Cart Badge & Mobile Badge
  const badges = document.querySelectorAll('.cart-count-target');
  badges.forEach(b => {
    b.textContent = calc.totalItems;
    b.style.display = calc.totalItems > 0 ? 'flex' : 'none';
  });

  const cartList = document.getElementById('cartItemsList');
  const emptyState = document.getElementById('cartEmptyState');
  const cartSummary = document.getElementById('cartSummaryBox');
  const freeShippingText = document.getElementById('freeShippingText');
  const freeShippingBar = document.getElementById('freeShippingProgressBar');

  if (!cartList) return;

  // Free shipping progress calculation
  if (freeShippingText && freeShippingBar) {
    const curr = CURRENCIES[AppState.currency] || CURRENCIES.USD;
    const thresholdConverted = Math.round(calc.freeShippingThreshold * curr.rate);
    const subtotalConverted = Math.round(calc.subtotal * curr.rate);

    if (calc.subtotal === 0) {
      freeShippingText.innerHTML = `Add <strong>${curr.symbol}${thresholdConverted}</strong> more for <strong>FREE Worldwide Express Shipping</strong>!`;
      freeShippingBar.style.width = '0%';
    } else if (calc.isFreeShipping) {
      freeShippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked FREE Worldwide Express Shipping!`;
      freeShippingBar.style.width = '100%';
    } else {
      const remaining = thresholdConverted - subtotalConverted;
      const pct = Math.min(100, Math.round((subtotalConverted / thresholdConverted) * 100));
      freeShippingText.innerHTML = `Add <strong>${curr.symbol}${remaining}</strong> more for <strong>FREE Express Shipping</strong>!`;
      freeShippingBar.style.width = `${pct}%`;
    }
  }

  if (AppState.cart.length === 0) {
    cartList.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartSummary) cartSummary.style.display = 'block';

  cartList.innerHTML = AppState.cart.map((item, index) => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <h6 class="mb-1 fw-bold">${item.name}</h6>
          <button class="btn btn-sm text-danger p-0" onclick="removeFromCart(${index})" title="Remove item">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
        <div class="text-secondary small mb-2">Variant: <span class="text-primary">${item.color}</span></div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="qty-pill">
            <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)" aria-label="Decrease quantity">-</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
          </div>
          <span class="fw-bold">${formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Cart summary labels
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountVal = document.getElementById('cartDiscountAmount');
  const shippingVal = document.getElementById('cartShippingAmount');
  const taxVal = document.getElementById('cartTaxAmount');
  const totalVal = document.getElementById('cartGrandTotal');

  if (subtotalEl) subtotalEl.textContent = formatPrice(calc.subtotal);
  
  if (discountRow && discountVal) {
    if (calc.discount > 0) {
      discountRow.style.display = 'flex';
      discountVal.textContent = `-${formatPrice(calc.discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (shippingVal) {
    shippingVal.innerHTML = calc.shipping === 0 
      ? '<span class="text-success fw-bold">FREE</span>' 
      : formatPrice(calc.shipping);
  }

  if (taxVal) taxVal.textContent = formatPrice(calc.estimatedTax);
  if (totalVal) totalVal.textContent = formatPrice(calc.grandTotal);
}

function applyCouponCode() {
  const input = document.getElementById('cartPromoInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast('Promo Code', 'Please enter a coupon code.', 'danger');
    return;
  }

  if (COUPONS[code]) {
    AppState.appliedCoupon = { code, ...COUPONS[code] };
    updateCartUI();
    showToast('Promo Applied! 🎉', `Coupon ${code} applied: ${COUPONS[code].label}`, 'success');
    input.value = '';
    
    // Confetti effect on discount application
    if (window.confetti) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  } else {
    showToast('Invalid Code', 'Coupon code not recognized or expired. Try AURA20!', 'danger');
  }
}

/* ==========================================================================
   WISHLIST SYSTEM
   ========================================================================== */
function toggleWishlist(productId) {
  const index = AppState.wishlist.indexOf(productId);
  const product = AppState.products.find(p => p.id === productId);

  if (index > -1) {
    AppState.wishlist.splice(index, 1);
    showToast('Wishlist Updated', `${product?.name || 'Item'} removed from favorites.`, 'info');
  } else {
    AppState.wishlist.push(productId);
    showToast('Added to Wishlist ❤️', `${product?.name || 'Item'} saved to your favorites.`, 'success');
  }

  localStorage.setItem('aura_wishlist', JSON.stringify(AppState.wishlist));
  updateWishlistUI();

  // Update heart icons on cards
  const cardHeart = document.getElementById(`wishlist-btn-${productId}`);
  if (cardHeart) {
    const isSaved = AppState.wishlist.includes(productId);
    cardHeart.classList.toggle('active', isSaved);
    cardHeart.innerHTML = `<i class="bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}"></i>`;
  }
}

function updateWishlistUI() {
  const badges = document.querySelectorAll('.wishlist-count-target');
  badges.forEach(b => {
    b.textContent = AppState.wishlist.length;
    b.style.display = AppState.wishlist.length > 0 ? 'flex' : 'none';
  });

  const listEl = document.getElementById('wishlistItemsList');
  const emptyEl = document.getElementById('wishlistEmptyState');
  if (!listEl) return;

  if (AppState.wishlist.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  const savedProducts = AppState.products.filter(p => AppState.wishlist.includes(p.id));

  listEl.innerHTML = savedProducts.map(p => `
    <div class="cart-item-row">
      <img src="${p.image}" alt="${p.name}" class="cart-item-img">
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <h6 class="mb-1 fw-bold">${p.name}</h6>
          <button class="btn btn-sm text-danger p-0" onclick="toggleWishlist('${p.id}')" title="Remove from wishlist">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="text-secondary small mb-2">${p.category} · <span class="fw-bold text-primary">${formatPrice(p.price)}</span></div>
        <button class="btn btn-sm btn-aura-primary w-100" onclick="addToCart('${p.id}', '${p.colors[0]?.name || 'Standard'}', 1, true); toggleWishlist('${p.id}');">
          <i class="bi bi-bag-plus me-1"></i> Move to Cart
        </button>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   QUICK VIEW MODAL
   ========================================================================== */
function openQuickViewModal(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  AppState.quickViewProduct = product;
  AppState.quickViewSelectedColor = product.colors[0] || null;
  AppState.quickViewQty = 1;

  renderQuickView(product);

  const modalEl = document.getElementById('quickViewModal');
  if (modalEl && window.bootstrap) {
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }
}

function renderQuickView(product) {
  const imgEl = document.getElementById('qvProductImg');
  const titleEl = document.getElementById('qvProductTitle');
  const catEl = document.getElementById('qvProductCategory');
  const ratingEl = document.getElementById('qvProductRating');
  const priceEl = document.getElementById('qvProductPrice');
  const descEl = document.getElementById('qvProductDesc');
  const featuresList = document.getElementById('qvProductFeatures');
  const specsTable = document.getElementById('qvProductSpecs');
  const colorsContainer = document.getElementById('qvProductColors');
  const qtyEl = document.getElementById('qvQtyInput');

  if (imgEl) imgEl.src = AppState.quickViewSelectedColor?.image || product.image;
  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.category;
  if (ratingEl) ratingEl.innerHTML = `<i class="bi bi-star-fill text-warning"></i> ${product.rating} (${product.reviewsCount} verified reviews)`;
  if (priceEl) priceEl.textContent = formatPrice(product.price);
  if (descEl) descEl.textContent = product.description;

  if (featuresList && product.features) {
    featuresList.innerHTML = product.features.map(f => `
      <li class="mb-2 d-flex align-items-center gap-2">
        <i class="bi bi-check2-circle text-warning"></i> ${f}
      </li>
    `).join('');
  }

  if (specsTable && product.specs) {
    specsTable.innerHTML = Object.entries(product.specs).map(([k, v]) => `
      <tr>
        <td class="text-secondary fw-medium py-1" style="width: 40%;">${k}</td>
        <td class="text-primary py-1">${v}</td>
      </tr>
    `).join('');
  }

  if (colorsContainer && product.colors) {
    colorsContainer.innerHTML = product.colors.map((c, i) => `
      <div class="color-option ${c.name === AppState.quickViewSelectedColor?.name ? 'active' : ''}" 
           onclick="selectQuickViewColor('${c.name}', '${c.image}')"
           style="cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span class="color-swatch" style="background-color: ${c.hex}; width: 22px; height: 22px;"></span>
        <span class="small ${c.name === AppState.quickViewSelectedColor?.name ? 'fw-bold text-primary' : 'text-secondary'}">${c.name}</span>
      </div>
    `).join('');
  }

  if (qtyEl) qtyEl.value = AppState.quickViewQty;
}

function selectQuickViewColor(colorName, colorImg) {
  if (!AppState.quickViewProduct) return;
  const color = AppState.quickViewProduct.colors.find(c => c.name === colorName);
  if (color) {
    AppState.quickViewSelectedColor = color;
    renderQuickView(AppState.quickViewProduct);
  }
}

function updateQuickViewQty(delta) {
  AppState.quickViewQty = Math.max(1, AppState.quickViewQty + delta);
  const qtyEl = document.getElementById('qvQtyInput');
  if (qtyEl) qtyEl.value = AppState.quickViewQty;
}

function addQuickViewToCart(buyNow = false) {
  if (!AppState.quickViewProduct) return;
  addToCart(
    AppState.quickViewProduct.id,
    AppState.quickViewSelectedColor?.name || 'Standard',
    AppState.quickViewQty,
    !buyNow
  );

  // Close Quick View Modal
  const modalEl = document.getElementById('quickViewModal');
  if (modalEl && window.bootstrap) {
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    bsModal?.hide();
  }

  if (buyNow) {
    setTimeout(() => {
      openCheckoutModal();
    }, 300);
  }
}

/* ==========================================================================
   CHECKOUT MULTI-STEP WIZARD
   ========================================================================== */
let checkoutCurrentStep = 1;

function openCheckoutModal() {
  if (AppState.cart.length === 0) {
    showToast('Your Cart is Empty', 'Please add products to your cart before proceeding to checkout.', 'info');
    return;
  }

  checkoutCurrentStep = 1;
  updateCheckoutStepView();

  const checkoutModalEl = document.getElementById('checkoutModal');
  if (checkoutModalEl && window.bootstrap) {
    const bsModal = bootstrap.Modal.getOrCreateInstance(checkoutModalEl);
    bsModal.show();
  }
}

function updateCheckoutStepView() {
  const steps = [1, 2, 3, 4];
  steps.forEach(s => {
    const el = document.getElementById(`checkoutStep${s}`);
    const indicator = document.getElementById(`stepIndicator${s}`);
    if (el) el.style.display = s === checkoutCurrentStep ? 'block' : 'none';
    if (indicator) {
      indicator.classList.toggle('active', s === checkoutCurrentStep);
      indicator.classList.toggle('completed', s < checkoutCurrentStep);
    }
  });

  // Update order summary preview inside checkout
  const calc = getCartCalculations();
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutShipping = document.getElementById('checkoutShipping');
  const checkoutDiscount = document.getElementById('checkoutDiscount');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutItemsPreview = document.getElementById('checkoutItemsPreview');

  if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(calc.subtotal);
  if (checkoutShipping) checkoutShipping.innerHTML = calc.shipping === 0 ? '<span class="text-success">FREE</span>' : formatPrice(calc.shipping);
  if (checkoutDiscount) checkoutDiscount.textContent = calc.discount > 0 ? `-${formatPrice(calc.discount)}` : '$0';
  if (checkoutTotal) checkoutTotal.textContent = formatPrice(calc.grandTotal);

  if (checkoutItemsPreview) {
    checkoutItemsPreview.innerHTML = AppState.cart.map(item => `
      <div class="d-flex align-items-center justify-content-between mb-2 small">
        <div class="d-flex align-items-center gap-2">
          <img src="${item.image}" style="width: 34px; height: 34px; border-radius: 6px; object-fit: cover;">
          <span>${item.name} <span class="text-muted">x${item.quantity}</span></span>
        </div>
        <span class="fw-bold">${formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('');
  }
}

function nextCheckoutStep() {
  if (checkoutCurrentStep === 1) {
    // Validate Shipping Form
    const name = document.getElementById('shipFullName')?.value.trim();
    const email = document.getElementById('shipEmail')?.value.trim();
    const address = document.getElementById('shipAddress')?.value.trim();
    const city = document.getElementById('shipCity')?.value.trim();
    const zip = document.getElementById('shipZip')?.value.trim();

    if (!name || !email || !address || !city || !zip) {
      showToast('Missing Details', 'Please fill in all required shipping fields.', 'danger');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast('Invalid Email', 'Please provide a valid email address for delivery updates.', 'danger');
      return;
    }

    checkoutCurrentStep = 2;
    updateCheckoutStepView();
  } else if (checkoutCurrentStep === 2) {
    // Validate Payment
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    if (paymentMethod === 'card') {
      const cardNum = document.getElementById('cardNumInput')?.value.replace(/\s+/g, '');
      const cardExp = document.getElementById('cardExpInput')?.value.trim();
      const cardCvc = document.getElementById('cardCvcInput')?.value.trim();

      if (!cardNum || cardNum.length < 12 || !cardExp || !cardCvc) {
        showToast('Payment Details Incomplete', 'Please provide complete and valid card information.', 'danger');
        return;
      }
    }

    checkoutCurrentStep = 3;
    updateCheckoutStepView();
  }
}

function prevCheckoutStep() {
  if (checkoutCurrentStep > 1) {
    checkoutCurrentStep--;
    updateCheckoutStepView();
  }
}

function placeOrder() {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing Payment...`;
  }

  setTimeout(() => {
    // Generate Order ID
    const orderId = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
    const orderIdEl = document.getElementById('confirmedOrderId');
    if (orderIdEl) orderIdEl.textContent = orderId;

    // Trigger celebration confetti
    if (window.confetti) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    }

    // Clear cart
    AppState.cart = [];
    AppState.appliedCoupon = null;
    saveCart();
    updateCartUI();

    checkoutCurrentStep = 4;
    updateCheckoutStepView();

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `Complete Order <i class="bi bi-shield-check ms-2"></i>`;
    }
  }, 1600);
}

/* ==========================================================================
   CONTACT & NEWSLETTER FORMS
   ========================================================================== */
function handleContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('contactName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value;
  const message = document.getElementById('contactMessage')?.value.trim();
  const submitBtn = document.getElementById('contactSubmitBtn');
  const alertBox = document.getElementById('contactAlertBox');

  if (!name || !email || !message) {
    showToast('Missing Fields', 'Please complete your name, email, and inquiry message.', 'danger');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Transmitting message...`;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send Message <i class="bi bi-arrow-right ms-2"></i>`;
    }

    if (alertBox) {
      alertBox.innerHTML = `
        <div class="alert alert-success d-flex align-items-center gap-2 mt-3 mb-0" role="alert">
          <i class="bi bi-check-circle-fill fs-5"></i>
          <div>Thank you, <strong>${name}</strong>! Your inquiry regarding <em>"${subject}"</em> has been received. Our Concierge team will respond to <strong>${email}</strong> within 15 minutes.</div>
        </div>
      `;
    }

    document.getElementById('contactForm')?.reset();
    showToast('Message Received', 'Our concierge support team is already reviewing your note.', 'success');
  }, 1200);
}

function handleNewsletter(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  if (!emailInput) return;
  const email = emailInput.value.trim();

  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast('Invalid Email', 'Please enter a valid email address to join the Inner Circle.', 'danger');
    return;
  }

  if (window.confetti) {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
  }

  showToast('Welcome to AURA Circle! ✨', 'You are now subscribed. Use code AURA20 for 20% off your first purchase!', 'success');
  emailInput.value = '';
}

/* ==========================================================================
   FAQ ACCORDION & SEARCH MODAL
   ========================================================================== */
function initFaq() {
  const container = document.getElementById('faqAccordionContainer');
  if (!container) return;

  container.innerHTML = FAQ_DATA.map((item, i) => `
    <div class="accordion-item">
      <h3 class="accordion-header" id="faqHeading${i}">
        <button class="accordion-button ${i === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse${i}" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faqCollapse${i}">
          ${item.question}
        </button>
      </h3>
      <div id="faqCollapse${i}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" aria-labelledby="faqHeading${i}" data-bs-parent="#faqAccordionContainer">
        <div class="accordion-body">
          ${item.answer}
        </div>
      </div>
    </div>
  `).join('');
}

function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Open Quick Search on "/" or "Ctrl+K"
    if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const searchModal = document.getElementById('quickSearchModal');
      if (searchModal && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(searchModal).show();
        setTimeout(() => document.getElementById('globalSearchInput')?.focus(), 250);
      }
    }
  });
}

function handleGlobalSearchInput(query) {
  const listEl = document.getElementById('globalSearchResults');
  if (!listEl) return;
  const q = query.toLowerCase().trim();

  if (!q) {
    listEl.innerHTML = '<p class="text-secondary small mb-0 text-center py-3">Type to search through audio, wearables, and workspace gear...</p>';
    return;
  }

  const matches = AppState.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) || 
    p.tagline.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    listEl.innerHTML = `<p class="text-secondary small mb-0 text-center py-3">No matching products found for "${query}".</p>`;
    return;
  }

  listEl.innerHTML = matches.map(p => `
    <div class="d-flex align-items-center justify-content-between p-2 rounded-3 hover-bg mb-1" 
         style="cursor: pointer; transition: background 0.2s;" 
         onclick="openQuickViewModal('${p.id}'); bootstrap.Modal.getInstance(document.getElementById('quickSearchModal')).hide();">
      <div class="d-flex align-items-center gap-3">
        <img src="${p.image}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
        <div>
          <div class="fw-bold small text-primary">${p.name}</div>
          <div class="text-muted extra-small">${p.category} · ${p.tagline}</div>
        </div>
      </div>
      <span class="fw-bold small text-warning">${formatPrice(p.price)}</span>
    </div>
  `).join('');
}

/* ==========================================================================
   EVENT LISTENERS SETUP
   ========================================================================== */
function initEventListeners() {
  // Category Filter Pills
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      AppState.activeCategory = e.currentTarget.getAttribute('data-category');
      renderProducts();
    });
  });

  // Search Input in Shop
  const searchInput = document.getElementById('productSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Price Range Slider
  const priceSlider = document.getElementById('priceRangeSlider');
  const priceDisplay = document.getElementById('priceRangeDisplay');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      AppState.maxPrice = Number(e.target.value);
      priceDisplay.textContent = formatPrice(AppState.maxPrice);
      renderProducts();
    });
  }

  // Sorting Dropdown
  const sortSelect = document.getElementById('productSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Credit Card Input formatting simulator
  const cardInput = document.getElementById('cardNumInput');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      val = val != '' ? val.match(/.{1,4}/g).join(' ') : '';
      e.target.value = val;
      const previewEl = document.getElementById('cardPreviewNum');
      if (previewEl) previewEl.textContent = val || '•••• •••• •••• ••••';
    });
  }

  const expInput = document.getElementById('cardExpInput');
  if (expInput) {
    expInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
      const previewEl = document.getElementById('cardPreviewExp');
      if (previewEl) previewEl.textContent = val || 'MM/YY';
    });
  }
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(title, message, type = 'info') {
  let container = document.getElementById('auraToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'auraToastContainer';
    container.className = 'aura-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'aura-toast';

  const iconClass = type === 'success' 
    ? 'bi bi-check-lg success' 
    : type === 'danger' 
    ? 'bi bi-exclamation-triangle-fill danger' 
    : 'bi bi-info-circle-fill info';

  toast.innerHTML = `
    <div class="toast-icon ${type}">
      <i class="${iconClass}"></i>
    </div>
    <div class="flex-grow-1">
      <div class="fw-bold small mb-1">${title}</div>
      <div class="text-secondary extra-small" style="font-size: 0.8125rem;">${message}</div>
    </div>
    <button type="button" class="btn-close btn-close-white ms-auto extra-small p-1" aria-label="Close"></button>
  `;

  const closeBtn = toast.querySelector('.btn-close');
  closeBtn?.addEventListener('click', () => removeToast(toast));

  container.appendChild(toast);

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    removeToast(toast);
  }, 4000);
}

function removeToast(toastEl) {
  if (!toastEl || toastEl.classList.contains('toast-fadeout')) return;
  toastEl.classList.add('toast-fadeout');
  setTimeout(() => {
    toastEl.remove();
  }, 300);
}
