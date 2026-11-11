/* Five-step Aryeo-style order demo. State stays in sessionStorage. Nothing is posted. */
(function () {
  const KEY = "gg-demo-order-v1";
  const STEPS = ["Address", "Services", "Scheduling", "Contact", "Confirm"];
  const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  const params = new URLSearchParams(location.search);
  const initialStep = clampStep(params.get("active_step"));
  const intent = params.get("intent") || "";

  const state = load();
  state.step = initialStep;
  if (!state.imageIndex) state.imageIndex = {};

  const stepEl = document.getElementById("step");
  const stepperEl = document.getElementById("stepper");
  const cartbarEl = document.getElementById("cartbar");
  const modalRoot = document.getElementById("modal-root");
  let map, marker;

  function clampStep(value) {
    const n = Number(value);
    if (!n || n < 1) return 1;
    if (n > 5) return 5;
    return n;
  }

  function fresh() {
    return {
      step: 1,
      mode: "details",
      address: {
        streetNumber: "",
        streetName: "",
        unit: "",
        city: "",
        state: "",
        postal: "",
        sqft: "",
        lat: 27.9506,
        lng: -82.4572
      },
      cart: [],
      schedule: { date: "", time: "", access: "Lockbox", instructions: "", notes: "" },
      contact: { name: "", email: "", phone: "", brokerage: "", notes: "" },
      agree: false,
      placed: null,
      errors: {},
      imageIndex: {}
    };
  }

  function load() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return fresh();
      const parsed = JSON.parse(raw);
      return Object.assign(fresh(), parsed, {
        address: Object.assign(fresh().address, parsed.address || {}),
        schedule: Object.assign(fresh().schedule, parsed.schedule || {}),
        contact: Object.assign(fresh().contact, parsed.contact || {})
      });
    } catch (err) {
      return fresh();
    }
  }

  function save() {
    const copy = Object.assign({}, state);
    delete copy.errors;
    sessionStorage.setItem(KEY, JSON.stringify(copy));
  }

  function money(n) {
    return GG.money(n, true);
  }

  function lineKey(id, optionId) {
    return id + "::" + (optionId || "");
  }

  function resolvedLine(line) {
    const product = GG.getProduct(line.id);
    const resolved = GG.resolve(line.id, state.address.sqft, line.optionId);
    return { product: product, resolved: resolved, line: line };
  }

  function cartLines() {
    return state.cart.map(resolvedLine).filter(function (item) { return item.product && item.resolved; });
  }

  function total() {
    return cartLines().reduce(function (sum, item) {
      if (item.resolved.quote) return sum;
      return sum + item.resolved.price * item.line.qty;
    }, 0);
  }

  function hasQuote() {
    return cartLines().some(function (item) { return item.resolved.quote; });
  }

  function go(step, push) {
    state.step = clampStep(step);
    state.errors = {};
    const url = "?active_step=" + state.step + (intent ? "&intent=" + encodeURIComponent(intent) : "");
    if (push) history.pushState({ step: state.step }, "", url);
    else history.replaceState({ step: state.step }, "", url);
    save();
    render();
    const card = document.querySelector(".form-card");
    if (card) card.scrollIntoView({ block: "start" });
  }

  window.addEventListener("popstate", function () {
    state.step = clampStep(new URLSearchParams(location.search).get("active_step"));
    render();
  });

  function render() {
    renderStepper();
    renderCartbar();
    if (state.placed && state.step === 5) renderSuccess();
    else if (state.step === 1) renderAddress();
    else if (state.step === 2) renderServices();
    else if (state.step === 3) renderSchedule();
    else if (state.step === 4) renderContact();
    else renderConfirm();
    save();
  }

  function renderStepper() {
    const span = (state.step - 1) / 4;
    stepperEl.innerHTML =
      '<div class="stepper-track"></div><div class="stepper-fill" style="width:calc((100% - 20%) * ' + span + ')"></div>' +
      STEPS.map(function (label, i) {
        const n = i + 1;
        const cls = n < state.step ? "done" : n === state.step ? "current" : "";
        return '<button type="button" class="step ' + cls + '" data-step="' + n + '"' +
          (n > state.step ? "" : "") + '><i class="dot"></i><span>' + label + "</span></button>";
      }).join("");
    stepperEl.querySelectorAll(".step").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const n = Number(btn.getAttribute("data-step"));
        if (n <= state.step) go(n, true);
        else if (validateThrough(n - 1)) go(n, true);
      });
    });
  }

  function renderCartbar() {
    if (state.step === 1) {
      cartbarEl.hidden = true;
      return;
    }
    cartbarEl.hidden = false;
    const quote = hasQuote() ? " + quote" : "";
    cartbarEl.innerHTML =
      '<button type="button" class="view-cart" id="view-cart">View Cart</button>' +
      "<strong>Total: " + money(total()) + quote + "</strong>";
    document.getElementById("view-cart").addEventListener("click", openCart);
  }

  function field(name, label, value, opts) {
    opts = opts || {};
    const err = state.errors[name] ? '<div class="err">' + escapeHtml(state.errors[name]) + "</div>" : "";
    const type = opts.type || "text";
    const placeholder = opts.placeholder ? ' placeholder="' + escapeHtml(opts.placeholder) + '"' : "";
    const required = opts.required ? ' <span class="req">*</span>' : "";
    const extra = opts.attrs || "";
    return '<div class="field ' + (opts.full ? "full" : "") + '"><label for="' + name + '">' + label + required +
      '</label><input id="' + name + '" name="' + name + '" type="' + type + '" value="' + escapeHtml(value || "") + '"' +
      placeholder + " " + extra + ">" + err + "</div>";
  }

  function renderAddress() {
    const a = state.address;
    if (state.mode === "search") {
      stepEl.innerHTML =
        '<div class="step-body"><h2>Address</h2>' +
        '<p class="help">Search for the property, or enter it manually. This demo never sends the address to a server.</p>' +
        (state.errors.form ? '<div class="banner-error">' + escapeHtml(state.errors.form) + "</div>" : "") +
        '<div class="field"><label for="q">Property address</label>' +
        '<input id="q" class="plain" placeholder="100 Demo Street, Tampa, FL 33602"></div>' +
        '<div class="step-nav"><button type="button" class="linkish" id="manual">Enter address manually</button>' +
        '<button type="button" class="btn-next" id="find">Continue</button></div></div>';
      document.getElementById("manual").addEventListener("click", function () {
        state.mode = "details";
        render();
      });
      document.getElementById("find").addEventListener("click", function () {
        const raw = document.getElementById("q").value.trim();
        if (!raw) {
          state.errors = { form: "Enter an address or choose manual entry." };
          render();
          return;
        }
        applyParsed(raw);
        state.mode = "details";
        state.errors = {};
        render();
      });
      return;
    }

    stepEl.innerHTML =
      '<div class="step-body"><h2>Address</h2>' +
      '<p class="help">Please enter your address below. If the address is at an apartment or unit, please make sure to note which one.</p>' +
      '<div class="grid-3">' +
      field("streetNumber", "Street #", a.streetNumber, { required: true }) +
      field("streetName", "Street Name", a.streetName, { required: true }) +
      field("unit", "Unit #", a.unit, { placeholder: "Optional" }) +
      "</div><div class=\"grid-3 even\">" +
      field("city", "City", a.city, { required: true }) +
      field("state", "State", a.state, { required: true, attrs: 'maxlength="2" autocapitalize="characters"' }) +
      field("postal", "Postal Code", a.postal, { required: true }) +
      "</div>" +
      '<div class="map-wrap"><div class="map-label">Location</div><div id="map" role="application" aria-label="Map of Tampa Bay with a draggable pin"></div>' +
      '<p class="map-caption">Moving the pin on the map will update the Latitude and Longitude for this address. This demo map does not look up addresses or send them anywhere.</p>' +
      '<div class="map-tools"><span class="ll" id="latlng"></span><button type="button" class="linkish" id="back-search">Back to Search</button></div></div>' +
      '<div class="divider"></div>' +
      field("sqft", "Square Footage", a.sqft, { required: true, type: "number", attrs: 'min="100" step="1"' }) +
      "</div>" +
      '<div class="step-nav"><span></span><button type="button" class="btn-next" id="next">Next Step</button></div>';

    bindAddressInputs();
    document.getElementById("back-search").addEventListener("click", function () {
      readAddress();
      state.mode = "search";
      render();
    });
    document.getElementById("next").addEventListener("click", function () {
      readAddress();
      if (validateAddress()) go(2, true);
      else render();
    });
    updateLatLng();
    initMap();
  }

  function bindAddressInputs() {
    ["streetNumber", "streetName", "unit", "city", "state", "postal", "sqft"].forEach(function (key) {
      const el = document.getElementById(key);
      if (!el) return;
      el.addEventListener("input", function () {
        state.address[key] = el.value;
        if (key === "state") state.address.state = el.value.toUpperCase();
      });
    });
  }

  function readAddress() {
    ["streetNumber", "streetName", "unit", "city", "state", "postal", "sqft"].forEach(function (key) {
      const el = document.getElementById(key);
      if (el) state.address[key] = key === "state" ? el.value.toUpperCase() : el.value;
    });
  }

  function validateAddress() {
    const a = state.address;
    const errors = {};
    if (!String(a.streetNumber).trim()) errors.streetNumber = "Street number is required.";
    if (!String(a.streetName).trim()) errors.streetName = "Street name is required.";
    if (!String(a.city).trim()) errors.city = "City is required.";
    if (!/^[A-Za-z]{2}$/.test(String(a.state).trim())) errors.state = "Use a 2-letter state.";
    if (!/^\d{5}$/.test(String(a.postal).trim())) errors.postal = "Use a 5-digit postal code.";
    const sq = Number(a.sqft);
    if (!sq || sq < 100) errors.sqft = "Square footage is required.";
    state.errors = errors;
    return Object.keys(errors).length === 0;
  }

  function applyParsed(raw) {
    const parts = raw.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    const a = state.address;
    const zip = raw.match(/\b(\d{5})(?:-\d{4})?\b/);
    a.postal = zip ? zip[1] : "";
    const stateMatch = raw.match(/\b([A-Za-z]{2})\b\s*\d{5}/);
    a.state = stateMatch ? stateMatch[1].toUpperCase() : "";
    if (parts.length >= 2) {
      a.city = parts.length >= 3 ? parts[parts.length - 2] : "";
      const street = parts[0];
      const unitMatch = street.match(/\b(?:apt|unit|ste|suite|#)\s*([\w-]+)/i);
      a.unit = unitMatch ? unitMatch[0] : "";
      const streetMain = unitMatch ? street.slice(0, unitMatch.index).trim() : street;
      const num = streetMain.match(/^(\d+[A-Za-z]?)\s+(.*)$/);
      if (num) {
        a.streetNumber = num[1];
        a.streetName = num[2];
      } else {
        a.streetNumber = "";
        a.streetName = streetMain;
      }
    } else {
      const num = raw.match(/^(\d+[A-Za-z]?)\s+(.*)$/);
      if (num) {
        a.streetNumber = num[1];
        a.streetName = num[2].replace(/\b\d{5}\b/, "").trim();
      }
    }
  }

  function updateLatLng() {
    const el = document.getElementById("latlng");
    if (!el) return;
    const lat = Number(state.address.lat).toFixed(5);
    const lng = Number(state.address.lng).toFixed(5);
    el.textContent = "Latitude " + lat + "   Longitude " + lng;
  }

  function initMap() {
    const node = document.getElementById("map");
    if (!node || typeof L === "undefined") {
      if (node) node.innerHTML = '<div style="padding:16px;color:#1b4339">Map tiles unavailable. Dragging is disabled in this view. Latitude and longitude stay at the Tampa Bay demo pin.</div>';
      return;
    }
    if (map) {
      map.remove();
      map = null;
      marker = null;
    }
    map = L.map(node, { scrollWheelZoom: false }).setView([state.address.lat, state.address.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    const pin = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    marker = L.marker([state.address.lat, state.address.lng], { draggable: true, icon: pin }).addTo(map);
    marker.on("dragend", function () {
      const p = marker.getLatLng();
      state.address.lat = p.lat;
      state.address.lng = p.lng;
      updateLatLng();
      save();
    });
    setTimeout(function () { map.invalidateSize(); }, 60);
  }

  function renderServices() {
    const groups = [
      { id: "featured", title: "Services", note: "Please choose your items below." },
      { id: "more", title: "More services", note: "Airbnb, commercial, events, business content, and agent branding." },
      { id: "addon", title: "Add-ons", note: "Residential add-on prices. Category-specific add-ons are listed on the pricing page." }
    ];
    let html = '<div class="step-body">';
    html += '<div class="signin-note"><div class="info-dot" aria-hidden="true">i</div><div><p>Sign in to connect this order with your existing account.</p><button type="button" class="linkish" id="sign-in">Sign In</button></div></div>';
    if (state.errors.form) html += '<div class="banner-error">' + escapeHtml(state.errors.form) + "</div>";
    if (intent) {
      html += '<div class="inline-note">You started from ' + escapeHtml(intentLabel(intent)) + '. The matching services are highlighted below. Square footage from the Address step sets package prices.</div>';
    }
    groups.forEach(function (group, index) {
      const items = GG.products.filter(function (p) { return p.group === group.id; });
      if (index === 0) {
        html += "<h2>Services</h2><p class=\"help\">Please choose your items below.</p>";
      } else {
        html += '<h3 class="group-title" id="group-' + group.id + '">' + group.title + "<span>" + group.note + "</span></h3>";
      }
      html += '<div class="products">';
      items.forEach(function (product) { html += productCard(product); });
      html += "</div>";
    });
    html += "</div>";
    html += '<div class="step-nav"><button type="button" class="btn-prev" id="prev">Previous</button><button type="button" class="btn-next" id="next">Next Step</button></div>';
    stepEl.innerHTML = html;

    document.getElementById("sign-in").addEventListener("click", openSignIn);
    document.getElementById("prev").addEventListener("click", function () { go(1, true); });
    document.getElementById("next").addEventListener("click", function () {
      if (!state.cart.length) {
        state.errors = { form: "Add at least one service before scheduling." };
        render();
        return;
      }
      go(3, true);
    });
    stepEl.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-add");
        const select = stepEl.querySelector('select[data-opt="' + id + '"]');
        addItem(id, select ? select.value : null);
      });
    });
    stepEl.querySelectorAll("[data-qty]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        changeQty(btn.getAttribute("data-qty"), btn.getAttribute("data-option"), Number(btn.getAttribute("data-delta")));
      });
    });
    stepEl.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeItem(btn.getAttribute("data-remove"), btn.getAttribute("data-option"));
      });
    });
    stepEl.querySelectorAll("[data-details]").forEach(function (btn) {
      btn.addEventListener("click", function () { openDetails(btn.getAttribute("data-details")); });
    });
    stepEl.querySelectorAll("[data-img]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-img");
        const dir = Number(btn.getAttribute("data-dir"));
        const product = GG.getProduct(id);
        const current = state.imageIndex[id] || 0;
        const next = (current + dir + product.images.length) % product.images.length;
        state.imageIndex[id] = next;
        const img = btn.parentElement.querySelector("img");
        if (img) {
          img.style.display = "";
          img.src = product.images[next];
        }
      });
    });
    stepEl.querySelectorAll("select[data-opt]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        state.optionChoice = state.optionChoice || {};
        state.optionChoice[sel.getAttribute("data-opt")] = sel.value;
        const y = window.scrollY;
        render();
        window.scrollTo(0, y);
      });
    });
    const anchor = intentAnchor(intent);
    if (anchor && !state.intentScrolled) {
      state.intentScrolled = true;
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ block: "center" });
    }
  }

  function intentLabel(value) {
    const map = {
      residential: "Residential",
      airbnb: "Airbnb & VRBO",
      commercial: "Commercial Spaces",
      business: "Business Content",
      agent: "Agent Branding",
      events: "Events"
    };
    return map[value] || value;
  }

  function intentAnchor(value) {
    if (value === "residential") return null;
    const hit = GG.products.find(function (p) { return p.anchor === value; });
    return hit ? "product-" + hit.id : null;
  }

  function findLine(id, optionId) {
    const resolved = GG.resolve(id, state.address.sqft, optionId);
    const key = lineKey(id, resolved.optionId);
    return state.cart.find(function (line) { return lineKey(line.id, line.optionId) === key; });
  }

  function productCard(product) {
    const optionId = product.kind === "options" ? chosenOption(product) : null;
    const resolved = GG.resolve(product.id, state.address.sqft, optionId);
    const existing = state.cart.find(function (line) {
      if (line.id !== product.id) return false;
      if (product.kind === "options") return line.optionId === resolved.optionId;
      return true;
    });
    const imgIdx = state.imageIndex[product.id] || 0;
    const src = product.images[imgIdx] || "";
    const bullets = product.bullets.slice(0, 4);
    const more = product.bullets.length > 4;
    const highlight = product.anchor && product.anchor === intent ? " highlight" : "";
    let action;
    if (existing && product.kind !== "options") {
      action = qtyControl(existing);
    } else if (existing && product.kind === "options" && existing.optionId === resolved.optionId) {
      action = qtyControl(existing);
    } else {
      const label = resolved.quote ? "Request quote" : "Add";
      action = '<button type="button" class="btn-add' + (resolved.quote ? " quote" : "") + '" data-add="' + product.id + '">' + label + "</button>";
    }
    const optionHtml = product.kind === "options"
      ? '<select class="opt-select" data-opt="' + product.id + '" aria-label="Select an option for ' + escapeHtml(product.name) + '">' +
        product.options.map(function (opt) {
          const selected = opt.id === resolved.optionId ? " selected" : "";
          return '<option value="' + opt.id + '"' + selected + ">" + GG.money(opt.price, true) + " - " + escapeHtml(opt.label) + "</option>";
        }).join("") + "</select>"
      : "";
    return '<article class="product' + highlight + '" id="product-' + product.id + '">' +
      '<div class="media">' +
      '<img src="' + src + '" alt="" data-fallback>' +
      '<div class="banner-name">' + escapeHtml(shortName(product.name)) + "</div>" +
      '<button type="button" class="car prev" data-img="' + product.id + '" data-dir="-1" aria-label="Previous image">‹</button>' +
      '<button type="button" class="car next" data-img="' + product.id + '" data-dir="1" aria-label="Next image">›</button>' +
      "</div><div class=\"pad\"><h3>" + escapeHtml(product.name) + "</h3><ul>" +
      bullets.map(function (b) { return "<li>" + escapeHtml(b) + "</li>"; }).join("") +
      (more ? "<li>…</li>" : "") +
      '</ul><button type="button" class="linkish" data-details="' + product.id + '">More Details</button>' +
      '<div class="price-row">' + optionHtml +
      '<div class="price">' + (resolved.quote ? "Quote" : money(resolved.price)) +
      (resolved.detail ? "<small>" + escapeHtml(resolved.detail) + "</small>" : "") +
      "</div>" + action + "</div></div></article>";
  }

  function chosenOption(product) {
    state.optionChoice = state.optionChoice || {};
    if (state.optionChoice[product.id]) return state.optionChoice[product.id];
    const existing = state.cart.find(function (line) { return line.id === product.id; });
    if (existing && existing.optionId) return existing.optionId;
    return product.options[0].id;
  }

  function shortName(name) {
    return name.split("|")[0].trim();
  }

  function qtyControl(line) {
    return '<div class="qty"><button type="button" data-qty="' + line.id + '" data-option="' + (line.optionId || "") + '" data-delta="-1" aria-label="Decrease">−</button>' +
      '<span class="count">' + line.qty + "</span>" +
      '<button type="button" data-qty="' + line.id + '" data-option="' + (line.optionId || "") + '" data-delta="1" aria-label="Increase">+</button>' +
      '<button type="button" class="remove" data-remove="' + line.id + '" data-option="' + (line.optionId || "") + '">Remove</button></div>';
  }

  function addItem(id, optionId) {
    const resolved = GG.resolve(id, state.address.sqft, optionId);
    const key = lineKey(id, resolved.optionId);
    const found = state.cart.find(function (line) { return lineKey(line.id, line.optionId) === key; });
    if (found) found.qty = Math.min(9, found.qty + 1);
    else state.cart.push({ id: id, optionId: resolved.optionId, qty: 1 });
    state.errors = {};
    render();
  }

  function changeQty(id, optionId, delta) {
    const key = lineKey(id, optionId || null);
    const found = state.cart.find(function (line) { return lineKey(line.id, line.optionId) === key; });
    if (!found) return;
    found.qty += delta;
    if (found.qty <= 0) state.cart = state.cart.filter(function (line) { return line !== found; });
    render();
  }

  function removeItem(id, optionId) {
    const key = lineKey(id, optionId || null);
    state.cart = state.cart.filter(function (line) { return lineKey(line.id, line.optionId) !== key; });
    render();
  }

  function renderSchedule() {
    const s = state.schedule;
    const view = state.cal || monthOf(s.date || todayISO());
    state.cal = view;
    stepEl.innerHTML =
      '<div class="step-body"><h2>Scheduling</h2>' +
      '<p class="help">Choose a shoot date and arrival window. Hours are 9:00 AM–6:00 PM, seven days a week, subject to availability. This demo calendar does not check a live schedule.</p>' +
      (state.errors.form ? '<div class="banner-error">' + escapeHtml(state.errors.form) + "</div>" : "") +
      '<div class="cal-head"><button type="button" class="btn-prev" id="cal-prev" aria-label="Previous month">‹</button><strong>' +
      monthLabel(view) + '</strong><button type="button" class="btn-prev" id="cal-next" aria-label="Next month">›</button></div>' +
      '<div class="cal-grid">' + calendarCells(view, s.date) + "</div>" +
      "<h3 class=\"group-title\">Arrival time</h3><div class=\"times\">" +
      TIMES.map(function (t) {
        return '<button type="button" data-time="' + t + '" aria-pressed="' + (s.time === t ? "true" : "false") + '">' + t + "</button>";
      }).join("") + "</div>" +
      '<div class="field" style="margin-top:16px"><label for="access">Property access</label><select id="access">' +
      ["Lockbox", "Agent will meet us", "Owner will meet us", "Other"].map(function (opt) {
        return '<option' + (s.access === opt ? " selected" : "") + ">" + opt + "</option>";
      }).join("") + "</select></div>" +
      '<div class="field"><label for="instructions">Entry instructions</label><textarea id="instructions" placeholder="Gate, lockbox location, pets, parking. Stored only in this browser.">' +
      escapeHtml(s.instructions) + "</textarea></div>" +
      '<div class="field"><label for="notes">Additional Info</label><textarea id="notes" placeholder="Zillow 3D or social reel, Matterport vs Zillow, twilight timing, rooms to skip…">' +
      escapeHtml(s.notes) + "</textarea></div></div>" +
      '<div class="step-nav"><button type="button" class="btn-prev" id="prev">Previous</button><button type="button" class="btn-next" id="next">Next Step</button></div>';

    document.getElementById("prev").addEventListener("click", function () { readSchedule(); go(2, true); });
    document.getElementById("next").addEventListener("click", function () {
      readSchedule();
      if (!state.schedule.date || !state.schedule.time) {
        state.errors = { form: "Choose a date and an arrival time." };
        render();
        return;
      }
      go(4, true);
    });
    document.getElementById("cal-prev").addEventListener("click", function () {
      readSchedule();
      state.cal = shiftMonth(state.cal, -1);
      render();
    });
    document.getElementById("cal-next").addEventListener("click", function () {
      readSchedule();
      state.cal = shiftMonth(state.cal, 1);
      render();
    });
    stepEl.querySelectorAll(".day").forEach(function (btn) {
      btn.addEventListener("click", function () {
        readSchedule();
        state.schedule.date = btn.getAttribute("data-date");
        state.errors = {};
        render();
      });
    });
    stepEl.querySelectorAll("[data-time]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        readSchedule();
        state.schedule.time = btn.getAttribute("data-time");
        state.errors = {};
        render();
      });
    });
  }

  function readSchedule() {
    const access = document.getElementById("access");
    const instructions = document.getElementById("instructions");
    const notes = document.getElementById("notes");
    if (access) state.schedule.access = access.value;
    if (instructions) state.schedule.instructions = instructions.value;
    if (notes) state.schedule.notes = notes.value;
  }

  function todayISO() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return iso(d);
  }

  function iso(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function monthOf(isoDate) {
    const d = isoDate ? new Date(isoDate + "T12:00:00") : new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  }

  function shiftMonth(view, delta) {
    const d = new Date(view.y, view.m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  }

  function monthLabel(view) {
    return new Date(view.y, view.m, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  function calendarCells(view, selected) {
    const names = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    let html = names.map(function (n) { return "<span>" + n + "</span>"; }).join("");
    const first = new Date(view.y, view.m, 1);
    const startPad = first.getDay();
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const today = todayISO();
    for (let i = 0; i < startPad; i++) html += "<span></span>";
    for (let day = 1; day <= days; day++) {
      const d = new Date(view.y, view.m, day);
      const value = iso(d);
      const disabled = value < today;
      html += '<button type="button" class="day" data-date="' + value + '" aria-pressed="' + (selected === value ? "true" : "false") + '"' +
        (disabled ? " disabled" : "") + ">" + day + "</button>";
    }
    return html;
  }

  function renderContact() {
    const c = state.contact;
    stepEl.innerHTML =
      '<div class="step-body"><h2>Contact</h2>' +
      '<p class="help">Who should we reach about this shoot? These details stay in this browser and are never submitted.</p>' +
      (state.errors.form ? '<div class="banner-error">' + escapeHtml(state.errors.form) + "</div>" : "") +
      '<div class="grid-2">' +
      field("name", "Full name", c.name, { required: true, placeholder: "Your name" }) +
      field("email", "Email", c.email, { required: true, type: "email", placeholder: "name@youremail.com" }) +
      field("phone", "Phone", c.phone, { required: true, type: "tel", placeholder: "(123) 456 78 90" }) +
      field("brokerage", "Brokerage or company", c.brokerage, { placeholder: "Optional" }) +
      "</div>" +
      '<div class="field"><label for="cnotes">Notes for the team</label><textarea id="cnotes" placeholder="Anything else we should know?">' +
      escapeHtml(c.notes) + "</textarea></div></div>" +
      '<div class="step-nav"><button type="button" class="btn-prev" id="prev">Previous</button><button type="button" class="btn-next" id="next">Next Step</button></div>';
    document.getElementById("prev").addEventListener("click", function () { readContact(); go(3, true); });
    document.getElementById("next").addEventListener("click", function () {
      readContact();
      const errors = {};
      if (!state.contact.name.trim()) errors.name = "Name is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email.trim())) errors.email = "Enter a valid email.";
      const digits = state.contact.phone.replace(/\D/g, "");
      if (digits.length < 10) errors.phone = "Enter a 10-digit phone number.";
      state.errors = errors;
      if (Object.keys(errors).length) {
        state.errors.form = "Please complete the contact fields.";
        render();
        return;
      }
      go(5, true);
    });
  }

  function readContact() {
    ["name", "email", "phone", "brokerage"].forEach(function (key) {
      const el = document.getElementById(key);
      if (el) state.contact[key] = el.value;
    });
    const notes = document.getElementById("cnotes");
    if (notes) state.contact.notes = notes.value;
  }

  function addressLine() {
    const a = state.address;
    const street = [a.streetNumber, a.streetName].filter(Boolean).join(" ");
    const unit = a.unit ? ", " + a.unit : "";
    const city = [a.city, a.state].filter(Boolean).join(", ");
    return [street + unit, city, a.postal].filter(Boolean).join(", ") || "No address yet";
  }

  function renderConfirm() {
    const lines = cartLines();
    const s = state.schedule;
    const c = state.contact;
    const rows = lines.map(function (item) {
      const price = item.resolved.quote ? "Quote" : money(item.resolved.price * item.line.qty);
      const detail = item.resolved.detail ? " · " + item.resolved.detail : "";
      return '<div class="row"><span>' + item.line.qty + " × " + escapeHtml(item.product.name) + escapeHtml(detail) + "</span><span>" + price + "</span></div>";
    }).join("") || '<p class="help">No services in the cart yet.</p>';
    stepEl.innerHTML =
      '<div class="step-body"><h2>Confirm</h2>' +
      '<p class="help">Review the order. Placing it only shows a demo confirmation — nothing is sent.</p>' +
      (state.errors.form ? '<div class="banner-error">' + escapeHtml(state.errors.form) + "</div>" : "") +
      '<div class="summary"><section><h3>Property <button type="button" class="linkish" data-jump="1">Edit</button></h3><p>' +
      escapeHtml(addressLine()) + "<br>Square footage: " + escapeHtml(state.address.sqft || "—") +
      "<br>Pin: " + Number(state.address.lat).toFixed(5) + ", " + Number(state.address.lng).toFixed(5) + "</p></section>" +
      '<section><h3>Schedule <button type="button" class="linkish" data-jump="3">Edit</button></h3><p>' +
      escapeHtml(s.date ? formatDate(s.date) : "No date") + (s.time ? " · " + escapeHtml(s.time) : "") +
      "<br>Access: " + escapeHtml(s.access || "—") +
      (s.instructions ? "<br>" + escapeHtml(s.instructions) : "") +
      (s.notes ? "<br>Additional info: " + escapeHtml(s.notes) : "") + "</p></section>" +
      '<section><h3>Services <button type="button" class="linkish" data-jump="2">Edit</button></h3>' + rows +
      '<div class="row total"><span>Total</span><span>' + money(total()) + (hasQuote() ? " + quote" : "") + "</span></div>" +
      '<p class="help">Travel is free for the first 30 miles from South Tampa, then $15 per 10 miles rounded down. This demo does not calculate mileage.</p></section>' +
      '<section><h3>Contact <button type="button" class="linkish" data-jump="4">Edit</button></h3><p>' +
      escapeHtml(c.name || "—") + "<br>" + escapeHtml(c.email || "") + "<br>" + escapeHtml(c.phone || "") +
      (c.brokerage ? "<br>" + escapeHtml(c.brokerage) : "") +
      (c.notes ? "<br>" + escapeHtml(c.notes) : "") + "</p></section></div>" +
      '<label class="check"><input type="checkbox" id="agree"' + (state.agree ? " checked" : "") + "> I understand this is a demo and no order, payment, or message will be sent.</label></div>" +
      '<div class="step-nav"><button type="button" class="btn-prev" id="prev">Previous</button><button type="button" class="place-order" id="place">Place Order</button></div>';

    document.getElementById("prev").addEventListener("click", function () { go(4, true); });
    document.getElementById("agree").addEventListener("change", function (e) { state.agree = e.target.checked; save(); });
    stepEl.querySelectorAll("[data-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () { go(Number(btn.getAttribute("data-jump")), true); });
    });
    document.getElementById("place").addEventListener("click", function () {
      if (!state.agree) {
        state.errors = { form: "Check the box to acknowledge this is a demo." };
        render();
        return;
      }
      if (!validateAddress() || !state.cart.length || !state.schedule.date || !state.contact.name) {
        state.errors = { form: "The order is missing an address, a service, a schedule, or contact info. Use Edit to go back." };
        render();
        return;
      }
      state.placed = {
        ref: "DEMO-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
        at: new Date().toISOString()
      };
      save();
      renderSuccess();
    });
  }

  function renderSuccess() {
    cartbarEl.hidden = false;
    stepEl.innerHTML =
      '<div class="success"><h2>This is a demo — no order was placed.</h2>' +
      '<p>Nothing was sent, saved on a server, or charged. Your summary below only exists in this browser.</p>' +
      '<p class="ref">Reference ' + escapeHtml(state.placed.ref) + "</p>" +
      '<p><a class="linkish" href="../index.html">Back to the marketing site</a></p>' +
      '<p><button type="button" class="btn-prev" id="reset">Start a new demo order</button></p></div>';
    document.getElementById("reset").addEventListener("click", function () {
      sessionStorage.removeItem(KEY);
      const next = fresh();
      Object.keys(state).forEach(function (k) { delete state[k]; });
      Object.assign(state, next);
      go(1, true);
    });
  }

  function formatDate(value) {
    const d = new Date(value + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  function openDetails(id) {
    const product = GG.getProduct(id);
    const resolved = GG.resolve(id, state.address.sqft, null);
    openModal(
      '<div class="modal-head"><h3>' + escapeHtml(product.name) + '</h3><button type="button" class="modal-close" id="close" aria-label="Close">×</button></div>' +
      '<img class="hero" alt="" src="' + (product.images[0] || "") + '">' +
      "<ul>" + product.bullets.map(function (b) { return "<li>" + escapeHtml(b) + "</li>"; }).join("") + "</ul>" +
      product.notes.map(function (n) { return "<p>" + escapeHtml(n) + "</p>"; }).join("") +
      "<p class=\"price\">" + (resolved.quote ? "Quote" : money(resolved.price)) +
      (resolved.detail ? " · " + escapeHtml(resolved.detail) : "") + "</p>" +
      '<button type="button" class="btn-next" id="add-modal">' + (resolved.quote ? "Request quote" : "Add") + "</button>"
    );
    document.getElementById("add-modal").addEventListener("click", function () {
      const select = document.querySelector('select[data-opt="' + id + '"]');
      addItem(id, select ? select.value : (product.kind === "options" ? product.options[0].id : null));
      closeModal();
    });
  }

  function openCart() {
    const lines = cartLines();
    const body = lines.length ? lines.map(function (item) {
      const price = item.resolved.quote ? "Quote" : money(item.resolved.price * item.line.qty);
      return '<div class="cart-line"><div><p><strong>' + escapeHtml(item.product.name) + "</strong></p><p>" +
        escapeHtml(item.resolved.detail || "") + "</p>" + qtyControl(item.line) + "</div><div>" + price + "</div></div>";
    }).join("") : "<p>Your cart is empty.</p>";
    openModal(
      '<div class="modal-head"><h3>Cart</h3><button type="button" class="modal-close" id="close" aria-label="Close">×</button></div>' +
      body + '<div class="row total"><span>Total</span><span>' + money(total()) + (hasQuote() ? " + quote" : "") + "</span></div>"
    );
    modalRoot.querySelectorAll("[data-qty]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        changeQty(btn.getAttribute("data-qty"), btn.getAttribute("data-option"), Number(btn.getAttribute("data-delta")));
        openCart();
      });
    });
    modalRoot.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeItem(btn.getAttribute("data-remove"), btn.getAttribute("data-option"));
        openCart();
      });
    });
  }

  function openSignIn() {
    openModal(
      '<div class="modal-head"><h3>Sign in</h3><button type="button" class="modal-close" id="close" aria-label="Close">×</button></div>' +
      '<p class="help">The live order form connects to an Aryeo customer account. This demo does not.</p>' +
      '<div class="field"><label for="semail">Email</label><input id="semail" type="email" autocomplete="off"></div>' +
      '<div class="field"><label for="spass">Password</label><input id="spass" type="password" autocomplete="off"></div>' +
      '<button type="button" class="btn-next" id="signin-go">Sign In</button><p id="signin-msg"></p>'
    );
    document.getElementById("signin-go").addEventListener("click", function () {
      document.getElementById("signin-msg").textContent = "This is a demo — sign-in is not available.";
    });
  }

  function openModal(html) {
    modalRoot.classList.add("open");
    modalRoot.innerHTML = '<div class="backdrop" id="backdrop"></div><div class="modal" role="dialog" aria-modal="true">' + html + "</div>";
    document.getElementById("close").addEventListener("click", closeModal);
    document.getElementById("backdrop").addEventListener("click", closeModal);
    const dialog = modalRoot.querySelector(".modal");
    const focusable = dialog.querySelector("button, input, select, textarea");
    if (focusable) focusable.focus();
  }

  function closeModal() {
    modalRoot.classList.remove("open");
    modalRoot.innerHTML = "";
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  document.addEventListener("error", function (e) {
    const t = e.target;
    if (t && t.tagName === "IMG") {
      t.style.display = "none";
    }
  }, true);

  function validateThrough(step) {
    if (step >= 1 && !validateAddress()) {
      state.step = 1;
      state.errors.form = "Complete the address and square footage first.";
      render();
      return false;
    }
    if (step >= 2 && !state.cart.length) {
      state.step = 2;
      state.errors = { form: "Add at least one service first." };
      render();
      return false;
    }
    if (step >= 3 && (!state.schedule.date || !state.schedule.time)) {
      state.step = 3;
      state.errors = { form: "Choose a date and time first." };
      render();
      return false;
    }
    if (step >= 4) {
      const digits = (state.contact.phone || "").replace(/\D/g, "");
      if (!state.contact.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email || "") || digits.length < 10) {
        state.step = 4;
        state.errors = { form: "Complete contact info first." };
        render();
        return false;
      }
    }
    return true;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  render();
})();
