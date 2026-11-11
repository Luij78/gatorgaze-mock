(function () {
  const app = document.getElementById("pricing-app");
  if (!app || !window.GG) return;

  const packages = [
    ["basic", "Basic Package", "Listing photos, drone, floor plan, and the marketing extras."],
    ["standard", "Standard Package", "Adds one virtual twilight and a Zillow 3D tour or a social reel."],
    ["premium", "Premium Package", "Two virtual twilights, a Zillow 3D tour, and a vertical reel."],
    ["deluxe", "Deluxe Package", "Four virtual twilights, Zillow or Matterport, and a cinematic video."]
  ];

  app.innerHTML =
    sectionOpen("Residential & MLS", "Priced by square footage. Pick a package, then add services below.") +
    '<div class="sqft-finder"><label for="sqft-lookup">Highlight a square footage</label>' +
    '<input id="sqft-lookup" class="plain-input" type="number" min="100" placeholder="e.g. 2200"></div>' +
    '<p class="center-note">Every residential package includes interior and exterior photos, aerial drone photos, a 2D floor plan, a property website, marketing content and tools, the Blue Sky Guarantee, and 24-hour turnaround. Standard and above also include community photos, touch-ups and item removal, and digital lot lines.</p>' +
    packages.map(function (item) {
      const product = GG.getProduct(item[0]);
      return '<div class="pkg-section"><div><h3>' + item[1] + "</h3><p>" + item[2] + "</p><ul>" +
        product.bullets.map(function (b) { return "<li>" + escapeHtml(b) + "</li>"; }).join("") +
        "</ul></div>" + tierTable(product.tiers) + "</div>";
    }).join("") +
    sectionClose() +
    sectionOpen("Residential Services", "Book these on their own or with a package.") +
    '<div class="two">' +
    cardList("Residential Photos", ["Interior and exterior photos", "2D floor plan", "Property website"], GG.getProduct("res-photos").options.map(function (o) {
      return [o.label, GG.money(o.price, false)];
    })) +
    cardList("À la carte", [], [
      ["Vacant Land Photos · 15 photos", "$150"],
      ["Twilight Photography · 5 real photos", "$200"],
      ["10 Drone Photos", "$125"],
      ["Drone Videography · up to 1 minute", "$150"],
      ["Drone Photo & Video · 12 photos + 1 minute", "$250"],
      ["Social Media Reel · vertical", "$175"],
      ["Cinematic Video", "$350"],
      ["Agent On Camera", "$100"]
    ]) +
    "</div>" +
    '<div class="two" style="margin-top:22px">' +
    tierMini("Zillow 3D Tour", GG.getProduct("zillow").tiers) +
    tierMini("Matterport 3D Tour", GG.getProduct("matterport").tiers, "Hosting is included for the first 6 months, then $75 per tour every 6 months.") +
    "</div>" +
    cardList("Add-ons", ["Add to any residential order."], GG.products.filter(function (p) { return p.group === "addon"; }).map(function (p) {
      return [p.name + (p.detail ? " · " + p.detail : ""), GG.money(p.price, false)];
    })) +
    sectionClose() +
    sectionOpen("Airbnb & VRBO", "No photo limit. Includes drone photos, lot lines, community photos, two virtual twilight images, an extended short-term rental license, and 24-hour turnaround.") +
    tierTable(GG.getProduct("airbnb").tiers) +
    cardList("Airbnb & VRBO add-ons", [], GG.airbnbAddons) +
    sectionClose() +
    sectionOpen("Commercial", "Interior and exterior photos for offices, retail, warehouses, and schools, with a commercial usage license and 24-hour turnaround.") +
    tierTable(GG.getProduct("commercial").tiers) +
    cardList("Commercial add-ons", [], GG.commercialAddons) +
    sectionClose() +
    sectionOpen("Events", "Priced by the hour. 2-hour minimum.") +
    '<div class="two">' +
    cardList("Event Video", ["One edited video with music."], GG.getProduct("event-video").options.map(pair)) +
    cardList("Event Photos", ["Edited photos in 48 hours."], GG.getProduct("event-photos").options.map(pair)) +
    "</div><div style=\"height:18px\"></div>" +
    cardList("Photo + Video", ["Edited photos plus one edited video."], GG.getProduct("event-both").options.map(pair)) +
    cardList("Event add-ons", [], GG.eventAddons) +
    sectionClose() +
    sectionOpen("Business Content", "Videos and content for your business.") +
    cardList("Packages", [], [
      ["Starter · 1 shoot (2 hours), 3 short videos", "$950"],
      ["Growth · 1 shoot (4 hours), 6 videos + 1 interview", "$1,800"],
      ["Pro · 1 shoot (6 hours), 10 videos + brand + interview", "$3,000"]
    ]) +
    cardList("Monthly Content", ["Fresh videos every month from one shoot."], GG.getProduct("biz-monthly").options.map(pair)) +
    cardList("Single Videos", ["One video, edited with music."], GG.getProduct("biz-single").options.map(pair)) +
    cardList("Portraits", ["Team or owner portraits, per person."], [["Per person", "$150"]]) +
    cardList("Business add-ons", [], GG.businessAddons) +
    sectionClose() +
    sectionOpen("Agent Branding", "Video reels and headshots for real estate agents.") +
    cardList("Reel packages", ["Logo and captions included."], GG.getProduct("agent-reels").options.map(pair)) +
    cardList("Headshots", ["30-minute session, one look, 3 retouched photos."], [["30 min session", "$150"]]) +
    cardList("Agent add-ons", [], GG.agentAddons) +
    '<p class="center-note" style="margin-top:28px">Love what you see? Book your session and we’ll handle the rest.</p>' +
    '<p style="text-align:center"><a class="btn-pill solid" href="book-now.html">Book Now</a></p>' +
    sectionClose();

  function pair(opt) {
    return [opt.label, GG.money(opt.price, false)];
  }

  function sectionOpen(title, note) {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return '<section class="price-block wrap" id="' + id + '"><h2>' + title + '</h2><p class="center-note">' + note + "</p>";
  }
  function sectionClose() { return "</section>"; }

  function tierTable(tiers) {
    let rows = "";
    let prev = 0;
    tiers.forEach(function (t) {
      const min = prev + (prev ? 1 : 0);
      const price = t.quote ? "Please contact us for a quote." : GG.money(t.price, false);
      const photos = t.photos ? t.photos + " photos" : "—";
      rows += '<tr data-min="' + min + '" data-max="' + (t.max === Infinity ? 1000000 : t.max) + '"><td>' +
        escapeHtml(t.label) + "</td><td>" + photos + '</td><td class="num">' + price + "</td></tr>";
      prev = t.max === Infinity ? prev : t.max;
    });
    return '<table class="tier-table"><thead><tr><th>Square footage</th><th>Photos</th><th class="num">Price</th></tr></thead><tbody>' +
      rows + "</tbody></table>";
  }

  function tierMini(title, tiers, note) {
    return "<div><h3>" + title + "</h3>" + (note ? "<p class=\"muted\">" + note + "</p>" : "") + tierTable(tiers) + "</div>";
  }

  function cardList(title, bullets, rows) {
    const body = rows.map(function (row) {
      const price = typeof row[1] === "number" ? GG.money(row[1], false) : (typeof row[1] === "string" && /^\d/.test(row[1]) ? "$" + row[1] : row[1]);
      return "<tr><td>" + escapeHtml(row[0]) + "</td><td>" + price + "</td></tr>";
    }).join("");
    return "<div><h3 class=\"serif\" style=\"font-size:28px;margin:8px 0\">" + title + "</h3>" +
      (bullets.length ? "<ul>" + bullets.map(function (b) { return "<li>" + escapeHtml(b) + "</li>"; }).join("") + "</ul>" : "") +
      '<table class="simple-table">' + body + "</table></div>";
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
