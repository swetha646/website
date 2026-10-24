// AURA Luxury Tech & Minimalist Living Product Catalog
const PRODUCTS_DATA = [
  {
    id: 'aura-sphere-pro',
    name: 'AURA Sphere Pro Studio',
    tagline: 'Flagship Wireless Studio ANC Headphones',
    category: 'Audio',
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 524,
    image: 'assets/images/hero-headphones.jpg',
    badge: 'Bestseller',
    badgeType: 'badge-gold',
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    description: 'Precision acoustic engineering meets Danish minimalism. Custom 45mm beryllium drivers deliver reference-grade audio with adaptive active noise cancellation that calibrates 50,000 times per second.',
    colors: [
      { name: 'Obsidian Black', hex: '#111215', image: 'assets/images/hero-headphones.jpg' },
      { name: 'Brushed Titanium', hex: '#8E8E93', image: 'assets/images/hero-headphones.jpg' },
      { name: 'Champagne Gold', hex: '#D4AF37', image: 'assets/images/hero-headphones.jpg' }
    ],
    features: [
      '45mm Custom Beryllium Acoustic Drivers',
      'Adaptive Hybrid ANC with Natural Transparency Mode',
      '45-Hour Ultra Battery Life with Fast Charge (10m = 6h)',
      'Ultra-Plush Magnetic Memory Foam Lambskin Earpads',
      'Lossless Hi-Res Audio (24-bit / 96kHz via LDAC & USB-C)'
    ],
    specs: {
      'Frequency Response': '10Hz – 48kHz',
      'Weight': '275g (9.7 oz)',
      'Connectivity': 'Bluetooth 5.3, Multipoint, 3.5mm, USB-C Lossless',
      'Microphones': '8 MEMS Beamforming Mics with AI Wind Cancellation',
      'Warranty': '3 Years Global Limited Warranty'
    }
  },
  {
    id: 'aura-pulse-ultra',
    name: 'AURA Pulse Ultra Smartwatch',
    tagline: 'Aerospace Titanium Health & Endurance Watch',
    category: 'Wearables',
    price: 279,
    originalPrice: 320,
    rating: 4.8,
    reviewsCount: 382,
    image: 'assets/images/aura-smartwatch.jpg',
    badge: 'Trending',
    badgeType: 'badge-cyan',
    inStock: true,
    stockCount: 14,
    isFeatured: true,
    description: 'Forged from Grade 5 aerospace titanium with a scratchproof sapphire crystal AMOLED display. Features multi-frequency GPS, medical-grade ECG sensor, and an 8-day battery life.',
    colors: [
      { name: 'Space Gray Titanium', hex: '#3A3D40', image: 'assets/images/aura-smartwatch.jpg' },
      { name: 'Midnight Matte', hex: '#1C1C1E', image: 'assets/images/aura-smartwatch.jpg' },
      { name: 'Alpine Silver', hex: '#D1D1D6', image: 'assets/images/aura-smartwatch.jpg' }
    ],
    features: [
      'Grade 5 Aerospace Titanium Case with Sapphire Crystal',
      'Always-on 1.43" Retina AMOLED (1,500 nits peak)',
      'Clinical-grade Heart Rate, SpO2, and HRV Bio-Sensors',
      'Dual-Frequency L1/L5 Precision Satellite Navigation',
      '100-Meter Water Resistance with Freediving Depth Gauge'
    ],
    specs: {
      'Battery Life': 'Up to 8 days typical, 36h continuous GPS',
      'Display': '1.43" AMOLED, 466x466 px (326 ppi)',
      'Water Rating': '10 ATM (100 meters)',
      'Compatibility': 'iOS 15+ and Android 10+',
      'Weight': '52g (without strap)'
    }
  },
  {
    id: 'aura-wave-anc',
    name: 'AURA Wave ANC Earbuds',
    tagline: 'True Wireless Audiophile In-Ear Monitors',
    category: 'Audio',
    price: 189,
    originalPrice: 229,
    rating: 4.9,
    reviewsCount: 640,
    image: 'assets/images/aura-earbuds.jpg',
    badge: '20% OFF',
    badgeType: 'badge-gold',
    inStock: true,
    stockCount: 22,
    isFeatured: true,
    description: 'Pure acoustics in an ultra-compact package. Featuring dual balanced-armature transducers, IPX7 water resistance, and an anodized wireless charging case with tactile metallic rings.',
    colors: [
      { name: 'Obsidian & Gold', hex: '#161616', image: 'assets/images/aura-earbuds.jpg' },
      { name: 'Pure White & Silver', hex: '#E5E5EA', image: 'assets/images/aura-earbuds.jpg' }
    ],
    features: [
      'Dual Balanced Armature + 10mm Dynamic Hybrid Architecture',
      '-42dB Intelligent Active Noise Cancellation',
      '38-Hour Total Playtime with Qi Wireless Charging Case',
      'IPX7 Sweat & Water Resistance for Intense Workouts',
      'Spatial Audio with Dynamic Head Tracking'
    ],
    specs: {
      'Playtime': '9h per charge, 38h with case',
      'Charging': 'USB-C + Qi Wireless Fast Charge',
      'Codecs': 'LDAC, aptX Adaptive, AAC, SBC',
      'Weight': '4.8g per earbud',
      'Warranty': '2 Years'
    }
  },
  {
    id: 'aura-arc-dock',
    name: 'AURA Arc 3-in-1 Magnetic Dock',
    tagline: 'Walnut & Machined Aluminum Desktop Charger',
    category: 'Workspace',
    price: 119,
    originalPrice: 149,
    rating: 4.9,
    reviewsCount: 295,
    image: 'assets/images/aura-charging-dock.jpg',
    badge: 'Staff Pick',
    badgeType: 'badge-purple',
    inStock: true,
    stockCount: 11,
    isFeatured: true,
    description: 'Elevate your workspace. Milled from a single block of aerospace aluminum anchored on an authentic American Walnut base. Simultaneously charges your Phone, Watch, and Earbuds at maximum speeds.',
    colors: [
      { name: 'Walnut & Space Gray', hex: '#4A3B32', image: 'assets/images/aura-charging-dock.jpg' },
      { name: 'Oak & Matte Silver', hex: '#C2B280', image: 'assets/images/aura-charging-dock.jpg' }
    ],
    features: [
      'Full 15W MagSafe Fast Wireless Charging',
      'Hand-finished Solid American Walnut Timber Base',
      'Weighted Non-Slip Foundation for Easy One-Handed Detach',
      'Concealed Internal Cable Management Architecture',
      'Braided 2-meter USB-C 65W Power Cable Included'
    ],
    specs: {
      'Total Output': 'Up to 30W Simultaneous Fast Charging',
      'Materials': 'CNC Aluminum, Solid Walnut, Silicone Pads',
      'Dimensions': '140mm x 120mm x 165mm',
      'Weight': '620g (weighted base)',
      'Safety': 'FOD (Foreign Object Detection), Overheat Protection'
    }
  },
  {
    id: 'aura-nomad-backpack',
    name: 'AURA Nomad Modular Backpack',
    tagline: 'Weatherproof Urban Tech Daily Commuter 24L',
    category: 'Accessories',
    price: 199,
    originalPrice: 240,
    rating: 4.8,
    reviewsCount: 312,
    image: 'assets/images/aura-backpack.jpg',
    badge: 'New',
    badgeType: 'badge-green',
    inStock: true,
    stockCount: 16,
    isFeatured: true,
    description: 'Engineered for modern creative professionals and digital nomads. Crafted with indestructible Cordura 840D ballistic nylon, German Fidlock magnetic buckles, and a suspended 16" laptop vault.',
    colors: [
      { name: 'Stealth Black', hex: '#1A1A1A', image: 'assets/images/aura-backpack.jpg' },
      { name: 'Charcoal Slate', hex: '#444444', image: 'assets/images/aura-backpack.jpg' }
    ],
    features: [
      'Cordura 840D Weatherproof Ballistic Nylon Shell',
      'Patented German Fidlock V-Buckle Quick Release',
      'Suspended 360° Shockproof Compartment for 16" Laptop',
      'Clamshell 180° Flat Opening for Seamless TSA Security',
      'Luggage Pass-through Strap & Hidden RFID Passport Pocket'
    ],
    specs: {
      'Capacity': '24 Liters (Expandable to 28L)',
      'Weight': '1.2 kg (2.6 lbs)',
      'Dimensions': '48cm x 31cm x 17cm',
      'Zippers': 'YKK Aquaguard Weatherproof Zips',
      'Warranty': 'Lifetime Craftsmanship Guarantee'
    }
  },
  {
    id: 'aura-lumina-lamp',
    name: 'AURA Lumina Smart Balance Lamp',
    tagline: 'Circadian Architectural Desktop LED Bar',
    category: 'Workspace',
    price: 149,
    originalPrice: 179,
    rating: 4.7,
    reviewsCount: 178,
    image: 'assets/images/aura-lifestyle.jpg',
    badge: 'Popular',
    badgeType: 'badge-purple',
    inStock: true,
    stockCount: 19,
    isFeatured: false,
    description: 'Simulates natural sunlight throughout your day to boost alertness and soothe eyes at night. Features CRI 98+ full-spectrum LEDs, precision knurled brass dimmer, and smart home automation.',
    colors: [
      { name: 'Matte Black & Brass', hex: '#222222', image: 'assets/images/aura-lifestyle.jpg' },
      { name: 'Brushed Silver', hex: '#D1D5DB', image: 'assets/images/aura-lifestyle.jpg' }
    ],
    features: [
      'CRI >98 Museum-Quality Full-Spectrum Illumination',
      'Automated Circadian Rhythm Sync (2700K - 6500K)',
      'Stepless Magnetic Knurled Rotary Dimming Controller',
      'Zero Screen Glare Asymmetric Optical Reflector',
      'Thread & Matter Smart Home Protocol Support'
    ],
    specs: {
      'Brightness': '1000 Lumens Max (Stepless Dimming)',
      'Color Temperature': '2700K warm to 6500K daylight',
      'Power Consumption': '18W Max',
      'Lifespan': '50,000+ Hours (25+ years typical)',
      'Warranty': '5 Years'
    }
  },
  {
    id: 'aura-chrono-hybrid',
    name: 'AURA Chrono Mechanical Hybrid',
    tagline: 'Swiss Movement with Hidden Smart Notification Hub',
    category: 'Wearables',
    price: 399,
    originalPrice: 450,
    rating: 5.0,
    reviewsCount: 94,
    image: 'assets/images/aura-smartwatch.jpg',
    badge: 'Limited Edition',
    badgeType: 'badge-gold',
    inStock: true,
    stockCount: 5,
    isFeatured: false,
    description: 'The pinnacle of horology and discreet modern technology. Real mechanical luminous hands sweep over an invisible e-ink sub-dial that wakes up only when important priority notifications arrive.',
    colors: [
      { name: 'Obsidian Steel', hex: '#2B2D42', image: 'assets/images/aura-smartwatch.jpg' },
      { name: 'Champagne Gold', hex: '#D4AF37', image: 'assets/images/aura-smartwatch.jpg' }
    ],
    features: [
      'Genuine Swiss Caliber Mechanical Hand Movement',
      'Discreet High-Contrast E-Ink Smart Sub-Display',
      '30-Day Battery Life on a Single 45-Minute Charge',
      'Handcrafted Italian Full-Grain Leather Strap',
      'Vibrational Haptic Engine for Silent Priority VIP Alerts'
    ],
    specs: {
      'Case Diameter': '42mm (11mm thickness)',
      'Glass': 'Double-Domed AR-Coated Sapphire Glass',
      'Battery': '30 Days Smart Mode, 12 Months Analog Only',
      'Water Resistance': '5 ATM (50 meters)',
      'Limited Run': 'Individual serial number engraved on caseback'
    }
  },
  {
    id: 'aura-soundbar-duo',
    name: 'AURA Soundbar & Subwoofer Duo',
    tagline: 'Spatial Dolby Atmos Wireless Acoustic System',
    category: 'Audio',
    price: 499,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 167,
    image: 'assets/images/hero-headphones.jpg',
    badge: 'Top Rated',
    badgeType: 'badge-cyan',
    inStock: true,
    stockCount: 7,
    isFeatured: false,
    description: 'Transform any room into a concert hall. Featuring 7 tuned drivers with 2 up-firing height channels, matched with an ultra-compact 150W downward wireless acoustic subwoofer.',
    colors: [
      { name: 'Kvadrat Acoustic Charcoal', hex: '#2C302E', image: 'assets/images/hero-headphones.jpg' },
      { name: 'Nordic Light Gray', hex: '#E0E2EC', image: 'assets/images/hero-headphones.jpg' }
    ],
    features: [
      'Dolby Atmos & DTS:X 3.1.2 Immersive Spatial Audio',
      '150W Wireless Down-Firing Subwoofer (Down to 28Hz)',
      'Kvadrat Premium Danish Acoustic Fabric Cover',
      'AirPlay 2, Spotify Connect, Chromecast Built-in, HDMI eARC',
      'TrueRoom Acoustic Room Calibration in 60 Seconds'
    ],
    specs: {
      'System Power': '320W Total Peak Output',
      'Connectivity': 'HDMI eARC, Optical, Wi-Fi 6, Bluetooth 5.3',
      'Dimensions (Bar)': '880mm x 65mm x 95mm',
      'Subwoofer Weight': '6.4 kg',
      'Warranty': '3 Years'
    }
  },
  {
    id: 'aura-stand-aluminum',
    name: 'AURA Flow Ergonomic Laptop Stand',
    tagline: 'Precision CNC Machined Aluminum Desk Riser',
    category: 'Workspace',
    price: 79,
    originalPrice: 99,
    rating: 4.8,
    reviewsCount: 421,
    image: 'assets/images/aura-charging-dock.jpg',
    badge: 'Popular',
    badgeType: 'badge-green',
    inStock: true,
    stockCount: 28,
    isFeatured: false,
    description: 'Designed to elevate your posture and workspace aesthetic. Engineered from solid aircraft aluminum with cooling vents that increase airflow by 45% and silicone protection pads.',
    colors: [
      { name: 'Space Gray', hex: '#4B4D52', image: 'assets/images/aura-charging-dock.jpg' },
      { name: 'Silver Matte', hex: '#E5E7EB', image: 'assets/images/aura-charging-dock.jpg' }
    ],
    features: [
      'Solid 4mm Aircraft-Grade CNC Machined Aluminum',
      'Ergonomic 15° Angle Aligns Screen to Eye Level',
      'Thermal Heat-Dissipation Open Airflow Vents',
      'Cable Passthrough Channel Keeps Desk Clutter-Free',
      'Supports All Laptops from 11" to 17" (Up to 10kg)'
    ],
    specs: {
      'Weight': '480g',
      'Material': 'Sandblasted & Anodized Aluminum Alloy',
      'Dimensions': '260mm x 225mm x 145mm',
      'Pads': 'Non-slip Eco-Silicone'
    }
  }
];

// Testimonials data
const TESTIMONIALS_DATA = [
  {
    name: 'Alexander Wright',
    role: 'Principal Creative Director, Studio Monolith',
    rating: 5,
    date: 'Verified Buyer · 2 weeks ago',
    product: 'AURA Sphere Pro Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    comment: 'The noise cancellation is on par with the best in the market, but what completely won me over is the physical craftsmanship and warmth of the acoustic profile. Zero ear fatigue after 10 hours at the editing bay.'
  },
  {
    name: 'Elena Rostova',
    role: 'Architectural Designer, Copenhagen',
    rating: 5,
    date: 'Verified Buyer · 1 month ago',
    product: 'AURA Arc 3-in-1 Magnetic Dock',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    comment: 'Most multi-chargers look like plastic spaceship junk on your desk. The solid walnut and milled aluminum of the AURA Arc look like an intentional Scandinavian art piece. Flawless MagSafe lock.'
  },
  {
    name: 'Marcus Chen',
    role: 'Senior Tech Editor, Wired Sound',
    rating: 5,
    date: 'Verified Buyer · 3 weeks ago',
    product: 'AURA Pulse Ultra Smartwatch',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    comment: 'Battery lasts a solid 7 days even with continuous biometric tracking and daily runs. The titanium finish doesn’t scratch easily. Easily my favorite wearable release of the year.'
  }
];

// FAQ Data
const FAQ_DATA = [
  {
    question: 'How fast does international shipping take, and is it free?',
    answer: 'We provide complimentary Express Worldwide Shipping on all orders over $99 (or local currency equivalent). Domestic US & EU orders arrive within 2–3 business days. International orders typically arrive within 4–6 business days via DHL Express with end-to-end tracking.'
  },
  {
    question: 'What is your 30-Day Risk-Free Trial policy?',
    answer: 'We want you to experience AURA sound and gear in your daily life. If for any reason you are not completely enchanted within 30 days of receiving your item, return it in original condition for a 100% full refund. We even cover the return shipping label!'
  },
  {
    question: 'How do the warranties work for AURA audio and electronics?',
    answer: 'All AURA audio products and smart wearables include an industry-leading 3-Year Global Limited Warranty against manufacturing defects and battery degradation. Our Nomad Backpack includes a Lifetime Craftsmanship Guarantee.'
  },
  {
    question: 'Can I connect AURA Sphere Pro to multiple devices simultaneously?',
    answer: 'Yes! AURA Sphere Pro supports seamless Bluetooth Multipoint. You can remain connected to your MacBook Pro and your iPhone simultaneously—audio will switch automatically when a call comes in.'
  },
  {
    question: 'Which promo codes are currently active?',
    answer: 'You can use promo code AURA20 at checkout for an instant 20% discount on your entire cart, or WELCOME10 for 10% off your first purchase!'
  }
];
