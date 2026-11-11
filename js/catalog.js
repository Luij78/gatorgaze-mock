/* Shared, client-side price catalog for the Gator Gaze Media demo.
   Prices follow the published pricing page. Nothing here is sent to a server. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.GG = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DRONE_NOTE =
    "Drone photos may be subject to flight restrictions, and in some areas, complete flight bans or altitude limits may apply. We must comply with these regulations when capturing aerial content.";

  const PHOTOS = [
    "photo-1600585154340-be6161a56a0c",
    "photo-1600596542815-ffad4c1539a9",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1600566753190-17f0baa2a6c3",
    "photo-1600210492486-724fe5c67fb0",
    "photo-1613490493576-7fde63acd811",
    "photo-1564013799919-ab600027ffc6",
    "photo-1512917774080-9991f1c4c750",
    "photo-1600047509807-ba8f99d2cdbc",
    "photo-1600585154526-990dced4db0d",
    "photo-1499793983690-e29da59ef1c2",
    "photo-1572120360610-d971b9d7767c",
    "photo-1580587771525-78b9dba3b914",
    "photo-1600573472592-401b489a3cdc",
    "photo-1600121848594-d8644e57abab",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1554995207-c18c203602cb",
    "photo-1502672260266-1c1ef2d93688",
    "photo-1484154218962-a197022b5858",
    "photo-1560185007-cde436f6a4d0",
    "photo-1616594039964-ae9021a400a0",
    "photo-1552321554-5fefe8c9ef14",
    "photo-1576013551627-0cc20b96c2a7",
    "photo-1500382017468-9049fed747ef",
    "photo-1497366216548-37526070297c",
    "photo-1486406146926-c627a92ad1ab",
    "photo-1441974231531-c6227db76b6e",
    "photo-1470770841072-f978cf4d019e",
    "photo-1518780664697-55e3ad937233",
    "photo-1600607687644-c7171b42498b",
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1618221195710-dd6b41faaea6",
    "photo-1556912173-46c336c7fd55",
    "photo-1505691938895-1758d7feb511",
    "photo-1540541338287-41700207dee6",
    "photo-1560184897-ae75f418493e"
  ];

  function photoUrl(id, w) {
    return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + (w || 1400) + "&q=70";
  }

  let photoCursor = 0;
  function takePhotos(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(photoUrl(PHOTOS[photoCursor % PHOTOS.length]));
      photoCursor += 1;
    }
    return out;
  }

  function tier(max, price, photos, label) {
    return { max: max, price: price, photos: photos, quote: price == null, label: label };
  }

  const basicTiers = [
    tier(1500, 190, 35, "0–1,500 sq ft"),
    tier(2000, 215, 40, "1,501–2,000 sq ft"),
    tier(2500, 240, 45, "2,001–2,500 sq ft"),
    tier(3000, 290, 50, "2,501–3,000 sq ft"),
    tier(3500, 315, 55, "3,001–3,500 sq ft"),
    tier(4000, 340, 60, "3,501–4,000 sq ft"),
    tier(4500, 365, 65, "4,001–4,500 sq ft"),
    tier(5000, 390, 70, "4,501–5,000 sq ft"),
    tier(5500, 415, 75, "5,001–5,500 sq ft"),
    tier(6000, 440, 80, "5,501–6,000 sq ft"),
    tier(6500, 465, 85, "6,001–6,500 sq ft"),
    tier(Infinity, null, null, "6,500+ sq ft")
  ];

  const standardTiers = [
    tier(2500, 325, 45, "0–2,500 sq ft"),
    tier(3000, 375, 50, "2,501–3,000 sq ft"),
    tier(3500, 400, 55, "3,001–3,500 sq ft"),
    tier(4000, 425, 60, "3,501–4,000 sq ft"),
    tier(4500, 450, 65, "4,001–4,500 sq ft"),
    tier(5000, 475, 70, "4,501–5,000 sq ft"),
    tier(5500, 500, 75, "5,001–5,500 sq ft"),
    tier(6000, 525, 80, "5,501–6,000 sq ft"),
    tier(6500, 550, 85, "6,001–6,500 sq ft"),
    tier(Infinity, null, null, "6,500+ sq ft")
  ];

  const premiumTiers = [
    tier(3000, 495, 45, "0–3,000 sq ft"),
    tier(3500, 520, 50, "3,001–3,500 sq ft"),
    tier(4000, 545, 55, "3,501–4,000 sq ft"),
    tier(4500, 570, 60, "4,001–4,500 sq ft"),
    tier(5000, 595, 65, "4,501–5,000 sq ft"),
    tier(5500, 620, 70, "5,001–5,500 sq ft"),
    tier(6000, 645, 75, "5,501–6,000 sq ft"),
    tier(6500, 670, 80, "6,001–6,500 sq ft"),
    tier(7000, 695, 85, "6,501–7,000 sq ft"),
    tier(Infinity, null, null, "7,000+ sq ft")
  ];

  const deluxeTiers = [
    tier(3500, 750, 55, "0–3,500 sq ft"),
    tier(4000, 775, 60, "3,501–4,000 sq ft"),
    tier(4500, 800, 65, "4,001–4,500 sq ft"),
    tier(5000, 825, 70, "4,501–5,000 sq ft"),
    tier(5500, 850, 75, "5,001–5,500 sq ft"),
    tier(6000, 875, 80, "5,501–6,000 sq ft"),
    tier(6500, 900, 85, "6,001–6,500 sq ft"),
    tier(7000, 925, 90, "6,501–7,000 sq ft"),
    tier(Infinity, null, null, "7,000+ sq ft")
  ];

  const airbnbTiers = [
    tier(1000, 250, null, "0–1,000 sq ft"),
    tier(2000, 300, null, "1,001–2,000 sq ft"),
    tier(3000, 400, null, "2,001–3,000 sq ft"),
    tier(4000, 500, null, "3,001–4,000 sq ft"),
    tier(5000, 600, null, "4,001–5,000 sq ft"),
    tier(Infinity, null, null, "5,000+ sq ft")
  ];

  const commercialTiers = [
    tier(3000, 500, null, "0–3,000 sq ft"),
    tier(4000, 600, null, "3,001–4,000 sq ft"),
    tier(5000, 700, null, "4,001–5,000 sq ft"),
    tier(Infinity, null, null, "5,000+ sq ft")
  ];

  function zillowTiers() {
    return [
      tier(2500, 150, null, "0–2,500 sq ft"),
      tier(Infinity, 175, null, "2,501+ sq ft")
    ];
  }

  function matterportTiers() {
    return [
      tier(2500, 225, null, "0–2,500 sq ft"),
      tier(Infinity, 250, null, "2,501+ sq ft")
    ];
  }

  const commonMls = [
    "Interior and exterior photos",
    "Aerial drone photos",
    "2D floor plan",
    "Property website",
    "Marketing Content and Tools",
    "Blue Sky Guarantee",
    "24 Hour Turnaround"
  ];

  const standardExtras = [
    "Community Photos",
    "Photo Touch Ups & Item Removal",
    "Digital Lot Lines"
  ];

  function product(partial) {
    const images = partial.images || takePhotos(partial.imageCount || 3);
    return Object.assign(
      {
        group: "featured",
        kind: "flat",
        bullets: [],
        notes: [],
        options: null,
        tiers: null,
        price: null,
        detail: ""
      },
      partial,
      { images: images }
    );
  }

  const products = [
    product({
      id: "basic",
      name: "Basic Package",
      kind: "tier",
      tiers: basicTiers,
      from: 190,
      bullets: commonMls.concat([
        "Community Photos",
        "Photo Touch Ups & Item Removal",
        "Digital Lot Lines"
      ]),
      notes: [DRONE_NOTE]
    }),
    product({
      id: "standard",
      name: "Standard Package",
      kind: "tier",
      tiers: standardTiers,
      from: 325,
      bullets: [
        "Interior and exterior photos",
        "Aerial drone photos",
        "1 Virtual Twilight Image",
        "Zillow 3D Virtual Tour or Social Media Reel (your choice)",
        "2D floor plan",
        "Property website",
        "Marketing Content and Tools"
      ].concat(standardExtras, ["Blue Sky Guarantee", "24 Hour Turnaround"]),
      notes: [
        "Please specify in the Additional Info section whether you’d like a Zillow 3D Virtual Tour or a Social Media Reel.",
        DRONE_NOTE
      ]
    }),
    product({
      id: "premium",
      name: "Premium Package",
      kind: "tier",
      tiers: premiumTiers,
      from: 495,
      bullets: [
        "Interior and exterior photos",
        "Aerial drone photos",
        "2 Virtual Twilight Image",
        "Zillow 3D Virtual Tour",
        "Social Media Reel | Vertical",
        "2D floor plan",
        "Property website",
        "Marketing Content and Tools"
      ].concat(standardExtras, ["Blue Sky Guarantee", "24 Hour Turnaround"]),
      notes: [DRONE_NOTE]
    }),
    product({
      id: "deluxe",
      name: "Deluxe Package",
      kind: "tier",
      tiers: deluxeTiers,
      from: 750,
      bullets: [
        "Interior and exterior photos",
        "Aerial drone photos",
        "4 Virtual Twilight Image",
        "Zillow 3D Virtual Tour / Matterport 3D Tour",
        "Cinematic Video",
        "2D floor plan",
        "Property website",
        "Marketing Content and Tools"
      ].concat(standardExtras, ["Blue Sky Guarantee", "24 Hour Turnaround"]),
      notes: [
        "Please specify in Additional Info whether you’d like a Zillow 3D Virtual Tour or a Matterport 3D Tour.",
        "Matterport hosting is included for 6 months, then $75 per tour every 6 months.",
        DRONE_NOTE
      ]
    }),
    product({
      id: "res-photos",
      name: "Residential Photos",
      kind: "options",
      from: 150,
      bullets: ["Interior and exterior photos", "2D floor plan", "Property website"],
      options: [
        { id: "30", label: "30 Photos", price: 150 },
        { id: "35", label: "35 Photos", price: 160 },
        { id: "40", label: "40 Photos", price: 170 },
        { id: "45", label: "45 Photos", price: 180 },
        { id: "50", label: "50 Photos", price: 190 },
        { id: "55", label: "55 Photos", price: 200 },
        { id: "60", label: "60 Photos", price: 210 }
      ]
    }),
    product({
      id: "vacant-land",
      name: "Vacant Land Photos | Aerial & Ground",
      kind: "flat",
      price: 150,
      from: 150,
      detail: "15 photos",
      bullets: [
        "Choose a mix of 15 photos taken from both drone and ground level",
        "Customized to match your specific requests",
        "Include your preferences in the notes section when placing your order"
      ],
      notes: [DRONE_NOTE]
    }),
    product({
      id: "twilight",
      name: "Twilight Photography",
      kind: "flat",
      price: 200,
      from: 200,
      detail: "5 real twilight photos",
      bullets: ["Includes 5 Real Twilight photos"]
    }),
    product({
      id: "drone-10",
      name: "10 Drone Photos",
      kind: "flat",
      price: 125,
      from: 125,
      detail: "10 aerial photos",
      bullets: ["Includes 10 aerial photos"],
      notes: [DRONE_NOTE]
    }),
    product({
      id: "drone-video",
      name: "Drone Videography | Up to 1 Minute",
      kind: "flat",
      price: 150,
      from: 150,
      detail: "Up to 1 minute",
      bullets: ["Includes drone video up to 1 minute"],
      notes: [DRONE_NOTE]
    }),
    product({
      id: "drone-combo",
      name: "Drone Photo & Video Package",
      kind: "flat",
      price: 250,
      from: 250,
      detail: "12 photos + 1 minute",
      bullets: ["Includes up to 12 drone photos and up to 1 minute of drone video"],
      notes: [DRONE_NOTE]
    }),
    product({
      id: "reel",
      name: "Social Media Reel | Vertical",
      kind: "flat",
      price: 175,
      from: 175,
      bullets: ["A short, edited home tour with music, perfect for sharing on social media."]
    }),
    product({
      id: "cinematic",
      name: "Cinematic Video",
      kind: "flat",
      price: 350,
      from: 350,
      bullets: [
        "A professionally edited video with music, showcasing the property’s interior and exterior in a polished, cinematic style."
      ],
      notes: ["Agent on camera can be added for $100 from Add-ons."]
    }),
    product({
      id: "zillow",
      name: "Zillow 3D Tour",
      kind: "tier",
      tiers: zillowTiers(),
      from: 150,
      bullets: ["Zillow 3D Virtual Tour"]
    }),
    product({
      id: "matterport",
      name: "Matterport 3D Virtual Tour",
      kind: "tier",
      tiers: matterportTiers(),
      from: 225,
      bullets: ["Matterport 3D Virtual Tour"],
      notes: ["Hosting included for the first 6 months after delivery. Renews every 6 months for $75 per tour."]
    }),
    product({
      id: "airbnb",
      group: "more",
      anchor: "airbnb",
      name: "Airbnb & VRBO Photos",
      kind: "tier",
      tiers: airbnbTiers,
      from: 250,
      bullets: [
        "No photo limit",
        "Aerial drone photos",
        "Digital lot lines",
        "Community photos",
        "2 virtual twilight images",
        "Extended short-term rental usage license",
        "24 hour turnaround"
      ],
      notes: [DRONE_NOTE]
    }),
    product({
      id: "commercial",
      group: "more",
      anchor: "commercial",
      name: "Commercial Photos",
      kind: "tier",
      tiers: commercialTiers,
      from: 500,
      bullets: [
        "Interior and exterior photos",
        "Offices, retail, warehouses, and schools",
        "Commercial usage license",
        "24 hour turnaround"
      ]
    }),
    product({
      id: "event-video",
      group: "more",
      anchor: "events",
      name: "Event Video",
      kind: "options",
      from: 500,
      bullets: ["One edited video with music.", "2-hour minimum."],
      options: [
        { id: "2", label: "2 Hours", price: 500 },
        { id: "3", label: "3 Hours", price: 650 },
        { id: "4", label: "4 Hours", price: 800 },
        { id: "5", label: "5 Hours", price: 950 },
        { id: "6", label: "6 Hours", price: 1100 }
      ]
    }),
    product({
      id: "event-photos",
      group: "more",
      anchor: "events",
      name: "Event Photos",
      kind: "options",
      from: 400,
      bullets: ["Edited photos delivered in 48 hours.", "2-hour minimum."],
      options: [
        { id: "2", label: "2 Hours", price: 400 },
        { id: "3", label: "3 Hours", price: 525 },
        { id: "4", label: "4 Hours", price: 650 },
        { id: "5", label: "5 Hours", price: 775 },
        { id: "6", label: "6 Hours", price: 900 }
      ]
    }),
    product({
      id: "event-both",
      group: "more",
      anchor: "events",
      name: "Event Photo + Video",
      kind: "options",
      from: 800,
      bullets: ["Edited photos plus one edited video.", "2-hour minimum."],
      options: [
        { id: "2", label: "2 Hours", price: 800 },
        { id: "3", label: "3 Hours", price: 1050 },
        { id: "4", label: "4 Hours", price: 1300 },
        { id: "5", label: "5 Hours", price: 1550 },
        { id: "6", label: "6 Hours", price: 1800 }
      ]
    }),
    product({
      id: "biz-starter",
      group: "more",
      anchor: "business",
      name: "Business Content · Starter",
      kind: "flat",
      price: 950,
      from: 950,
      detail: "2-hour shoot",
      bullets: ["1 shoot (2 hours)", "3 short videos"]
    }),
    product({
      id: "biz-growth",
      group: "more",
      anchor: "business",
      name: "Business Content · Growth",
      kind: "flat",
      price: 1800,
      from: 1800,
      detail: "4-hour shoot",
      bullets: ["1 shoot (4 hours)", "6 videos + 1 interview"]
    }),
    product({
      id: "biz-pro",
      group: "more",
      anchor: "business",
      name: "Business Content · Pro",
      kind: "flat",
      price: 3000,
      from: 3000,
      detail: "6-hour shoot",
      bullets: ["1 shoot (6 hours)", "10 videos + brand video + interview"]
    }),
    product({
      id: "biz-monthly",
      group: "more",
      anchor: "business",
      name: "Monthly Content",
      kind: "options",
      from: 1100,
      bullets: ["Fresh videos every month from one scheduled shoot, edited with music."],
      options: [
        { id: "4", label: "4 Videos", price: 1100 },
        { id: "8", label: "8 Videos", price: 2000 },
        { id: "12", label: "12 Videos", price: 2800 }
      ]
    }),
    product({
      id: "biz-single",
      group: "more",
      anchor: "business",
      name: "Single Business Video",
      kind: "options",
      from: 350,
      bullets: ["One video, edited with music, horizontal or vertical."],
      options: [
        { id: "business", label: "Business Video", price: 350 },
        { id: "interview", label: "Interview", price: 550 },
        { id: "testimonial", label: "Testimonial", price: 450 },
        { id: "team", label: "Team Spotlight", price: 400 },
        { id: "brand", label: "Brand / Promo", price: 900 }
      ]
    }),
    product({
      id: "portraits",
      group: "more",
      anchor: "business",
      name: "Business Portraits",
      kind: "flat",
      price: 150,
      from: 150,
      detail: "Per person",
      bullets: ["Team or owner portraits, per person, shot on location."]
    }),
    product({
      id: "agent-reels",
      group: "more",
      anchor: "agent",
      name: "Agent Reel Package",
      kind: "options",
      from: 295,
      bullets: [
        "Vertical reels edited with music.",
        "Logo and captions included.",
        "Location counts: 1 reel anywhere, 3 reels up to 2 locations, 6 reels up to 3, 10 reels up to 4."
      ],
      options: [
        { id: "1", label: "Agent Intro Reel", price: 295 },
        { id: "3", label: "3 Reels · up to 2 locations", price: 650 },
        { id: "6", label: "6 Reels · up to 3 locations", price: 1150 },
        { id: "10", label: "10 Reels + 1 bio video · up to 4 locations", price: 1750 }
      ]
    }),
    product({
      id: "headshots",
      group: "more",
      anchor: "agent",
      name: "Agent Headshots",
      kind: "flat",
      price: 150,
      from: 150,
      detail: "30 min · 3 photos",
      bullets: ["30-minute on-location session", "One look", "3 retouched photos within 48 hours"]
    }),
    product({
      id: "addon-photos-10",
      group: "addon",
      name: "Add 10 Photos",
      kind: "flat",
      price: 20,
      from: 20,
      bullets: ["Ten additional edited listing photos."]
    }),
    product({
      id: "addon-photos-20",
      group: "addon",
      name: "Add 20 Photos",
      kind: "flat",
      price: 40,
      from: 40,
      bullets: ["Twenty additional edited listing photos."]
    }),
    product({
      id: "addon-photos-25",
      group: "addon",
      name: "Add 25 Photos",
      kind: "flat",
      price: 50,
      from: 50,
      bullets: ["Twenty-five additional edited listing photos."]
    }),
    product({
      id: "addon-community",
      group: "addon",
      name: "Community Photos",
      kind: "flat",
      price: 30,
      from: 30,
      bullets: ["Neighborhood and amenity photos added to a shoot. Included in Standard and up."]
    }),
    product({
      id: "addon-touchups",
      group: "addon",
      name: "Photo Touch Ups & Item Removal",
      kind: "flat",
      price: 20,
      from: 20,
      bullets: ["Cleanup of small distractions and item removal."]
    }),
    product({
      id: "addon-lotlines",
      group: "addon",
      name: "Digital Lot Lines & Pins",
      kind: "flat",
      price: 10,
      from: 10,
      bullets: ["Lot-line overlay and map pins on an aerial frame."]
    }),
    product({
      id: "addon-fire",
      group: "addon",
      name: "Add Fire to Fireplaces",
      kind: "flat",
      price: 10,
      from: 10,
      bullets: ["A natural-looking fire added to fireplace photos."]
    }),
    product({
      id: "addon-vtwilight",
      group: "addon",
      name: "Virtual Twilight",
      kind: "flat",
      price: 15,
      from: 15,
      detail: "Each image",
      bullets: ["Virtual twilight edit, priced per image."]
    }),
    product({
      id: "addon-staging",
      group: "addon",
      name: "Virtual Staging",
      kind: "flat",
      price: 25,
      from: 25,
      detail: "Each image",
      bullets: ["Virtual staging for an empty room, priced per image. Delivered within 24 hours."]
    }),
    product({
      id: "addon-2d",
      group: "addon",
      name: "2D Floor Plan",
      kind: "flat",
      price: 75,
      from: 75,
      bullets: ["Upgraded 2D floor plan when it is not already included."]
    }),
    product({
      id: "addon-3d",
      group: "addon",
      name: "3D Floor Plan",
      kind: "flat",
      price: 125,
      from: 125,
      bullets: ["Dimensional 3D floor plan."]
    }),
    product({
      id: "addon-ai",
      group: "addon",
      name: "AI Edit",
      kind: "flat",
      price: 50,
      from: 50,
      detail: "Per scene",
      bullets: ["AI-assisted polish for one video scene."]
    }),
    product({
      id: "addon-land-ai",
      group: "addon",
      name: "Vacant Land AI Video",
      kind: "flat",
      price: 350,
      from: 350,
      bullets: ["Vacant Land to Property Video (AI edit)."]
    }),
    product({
      id: "addon-agent-cam",
      group: "addon",
      name: "Agent On Camera",
      kind: "flat",
      price: 100,
      from: 100,
      bullets: ["Add the agent on camera to a cinematic listing video."]
    })
  ];

  const airbnbAddons = [
    ["Real Twilight (5 photos)", 200],
    ["Virtual Twilight", 20],
    ["Virtual Staging", 25],
    ["AI Edit (per scene)", 50],
    ["Photo Touch Ups", 25],
    ["2D Floor Plan", 95],
    ["3D Floor Plan", 150],
    ["Zillow 3D Tour", "175+"],
    ["Matterport 3D Tour", "275+"],
    ["Drone Video", 200],
    ["Social Reel", 250],
    ["Cinematic Video (up to 2 min)", 450]
  ];

  const commercialAddons = [
    ["10 Drone Photos", 150],
    ["Drone Video", 200],
    ["2D Floor Plan", 95],
    ["3D Floor Plan", 150],
    ["Zillow 3D Tour", "200+"],
    ["Matterport 3D Tour", "275+"],
    ["Social Reel", 250],
    ["Cinematic Video", 450],
    ["Virtual Twilight", 20],
    ["Virtual Staging", 30],
    ["AI Edit (per scene)", 50],
    ["Photo Touch Ups", 25]
  ];

  const eventAddons = [
    ["Same-Day Delivery", 150],
    ["Logo + Captions", 50],
    ["Second Format", 100],
    ["Extra Crew (per hour)", 150],
    ["Raw Footage", 150],
    ["10 Drone Photos", 125],
    ["Drone Video", 150],
    ["Drone Photo & Video", 250]
  ];

  const businessAddons = [
    ["Behind-the-Scenes", 250],
    ["Logo + Captions", 50],
    ["Second Format", 75],
    ["Raw Footage", 150],
    ["AI Edit (per scene)", 50],
    ["Script + Shot Plan", 150]
  ];

  const agentAddons = [
    ["Additional Reel", 100],
    ["Second Format", 75],
    ["Additional Location", 100],
    ["AI Edit (per scene)", 50],
    ["Script + Shot Plan", 150]
  ];

  function lookupTier(sqft, tiers) {
    const n = Number(sqft);
    if (!n || n <= 0) {
      return Object.assign({}, tiers[0], { assumed: true });
    }
    for (let i = 0; i < tiers.length; i++) {
      if (n <= tiers[i].max) return Object.assign({}, tiers[i], { assumed: false });
    }
    return Object.assign({}, tiers[tiers.length - 1], { assumed: false });
  }

  function resolve(productId, sqft, optionId) {
    const product = products.find(function (p) { return p.id === productId; });
    if (!product) return null;
    if (product.kind === "options") {
      const opt = product.options.find(function (o) { return o.id === optionId; }) || product.options[0];
      return {
        price: opt.price,
        quote: false,
        detail: opt.label,
        optionId: opt.id,
        photos: null,
        assumed: false
      };
    }
    if (product.kind === "tier") {
      const t = lookupTier(sqft, product.tiers);
      let detail = t.label;
      if (t.photos) detail += " · " + t.photos + " photos";
      if (t.assumed) detail = "Starting tier · " + detail;
      return {
        price: t.price,
        quote: !!t.quote,
        detail: detail,
        optionId: null,
        photos: t.photos,
        assumed: t.assumed
      };
    }
    return {
      price: product.price,
      quote: false,
      detail: product.detail || "",
      optionId: null,
      photos: null,
      assumed: false
    };
  }

  function money(amount, withCents) {
    if (amount == null || amount === "Quote") return "Quote";
    if (typeof amount === "string") return "$" + amount;
    const cents = withCents !== false;
    if (!cents) return "$" + amount.toLocaleString("en-US");
    return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function travelFee(miles) {
    const n = Number(miles);
    if (!n || n <= 0) {
      return { miles: 0, remaining: 0, billable: 0, fee: 0 };
    }
    const remaining = Math.max(0, n - 30);
    const billable = Math.floor(remaining / 10) * 10;
    return {
      miles: n,
      remaining: remaining,
      billable: billable,
      fee: (billable / 10) * 15
    };
  }

  function getProduct(id) {
    return products.find(function (p) { return p.id === id; }) || null;
  }

  return {
    products: products,
    DRONE_NOTE: DRONE_NOTE,
    airbnbAddons: airbnbAddons,
    commercialAddons: commercialAddons,
    eventAddons: eventAddons,
    businessAddons: businessAddons,
    agentAddons: agentAddons,
    photoUrl: photoUrl,
    lookupTier: lookupTier,
    resolve: resolve,
    money: money,
    travelFee: travelFee,
    getProduct: getProduct,
    basicTiers: basicTiers,
    standardTiers: standardTiers,
    premiumTiers: premiumTiers,
    deluxeTiers: deluxeTiers
  };
});
