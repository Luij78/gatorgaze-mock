(function () {
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "";

  const services = [
    ["photography.html", "Photography"],
    ["videography.html", "Videography"],
    ["aerial-photos-videos.html", "Aerial Photos and Videos"],
    ["3d-virtual-tours.html", "3D Virtual Tours"],
    ["floor-plans.html", "Floor Plans"],
    ["twilight.html", "Twilight Photography"],
    ["virtual-staging.html", "Virtual Staging"],
    ["commercial-photography.html", "Commercial Photography"],
    ["airbnb-vrbo-photography.html", "Airbnb/VRBO Photography"],
    ["zillow-showcase.html", "Zillow Showcase"],
    ["community-photos.html", "Community Photos"],
    ["listing-websites.html", "Listing Websites"],
    ["events.html", "Events"],
    ["business-content.html", "Business Content"],
    ["agent-branding.html", "Agent Branding"]
  ];

  const menu = [
    ["index.html", "Home", "home"],
    ["about.html", "About", "about"],
    ["services.html", "Services", "services"],
    ["pricing.html", "Pricing", "pricing"],
    ["projects.html", "Projects", "projects"],
    ["gallery.html", "Gallery", "gallery"],
    ["blog.html", "Blog", "blog"],
    ["reviews.html", "Reviews", "reviews"],
    ["contact.html", "Contact", "contact"]
  ];

  const areas = [
    ["tampa-fl", "Tampa, FL"],
    ["st-petersburg-fl", "St. Petersburg, FL"],
    ["clearwater-fl", "Clearwater, FL"],
    ["sarasota-fl", "Sarasota, FL"],
    ["bradenton-fl", "Bradenton, FL"],
    ["south-tampa-fl", "South Tampa, FL"],
    ["brandon-fl", "Brandon, FL"],
    ["st-pete-beach-fl", "St. Pete Beach, FL"],
    ["clearwater-beach-fl", "Clearwater Beach, FL"],
    ["anna-maria-island-fl", "Anna Maria Island, FL"],
    ["lutz-fl", "Lutz, FL"],
    ["wesley-chapel-fl", "Wesley Chapel, FL"],
    ["lakeland-fl", "Lakeland, FL"],
    ["orlando-fl", "Orlando, FL"],
    ["kissimmee-fl", "Kissimmee, FL"]
  ];

  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = renderHeader();
  if (footer) footer.innerHTML = renderFooter();

  const bar = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && bar) {
    toggle.addEventListener("click", function () {
      const open = bar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  const dropBtn = document.querySelector(".nav-drop > button");
  if (dropBtn) {
    dropBtn.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        e.preventDefault();
        dropBtn.parentElement.classList.toggle("open");
      }
    });
  }
  window.addEventListener("scroll", function () {
    if (!bar) return;
    bar.classList.toggle("scrolled", window.scrollY > 4);
  });

  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const box = form.querySelector('input[type="checkbox"][required], input[data-required-check]');
      if (box && !box.checked) {
        toast("Please agree to the privacy note before sending.");
        return;
      }
      form.reset();
      toast("This is a demo — your message was not sent.");
    });
  });

  const quotes = document.querySelectorAll("[data-quote]");
  if (quotes.length > 1) {
    let i = 0;
    setInterval(function () {
      quotes[i].hidden = true;
      i = (i + 1) % quotes.length;
      quotes[i].hidden = false;
    }, 7000);
  }

  document.querySelectorAll("[data-count]").forEach(function (el) {
    const target = Number(el.getAttribute("data-count"));
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / 900);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });

  document.querySelectorAll("[data-filter]").forEach(function (barEl) {
    const target = document.querySelector(barEl.getAttribute("data-filter"));
    if (!target) return;
    barEl.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      barEl.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      const cat = btn.getAttribute("data-cat");
      target.querySelectorAll("[data-cat]").forEach(function (card) {
        const show = cat === "all" || card.getAttribute("data-cat").split(" ").indexOf(cat) !== -1;
        card.hidden = !show;
      });
    });
  });

  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () { img.style.display = "none"; });
  });

  const miles = document.getElementById("miles");
  if (miles && window.GG) {
    const out = document.getElementById("travel-out");
    function calc() {
      const fee = GG.travelFee(miles.value);
      out.textContent = fee.miles
        ? "Total distance " + fee.miles + " miles → first 30 miles free → remaining " +
          fee.remaining + " miles → rounded down to " + fee.billable + " billable miles → $" +
          fee.fee + " total travel fee."
        : "Enter one-way miles from South Tampa.";
    }
    miles.addEventListener("input", calc);
    const go = document.getElementById("miles-go");
    if (go) go.addEventListener("click", calc);
    calc();
  }

  const sqft = document.getElementById("sqft-lookup");
  if (sqft) {
    function highlight() {
      const n = Number(sqft.value);
      document.querySelectorAll("[data-max]").forEach(function (row) {
        const max = Number(row.getAttribute("data-max"));
        const min = Number(row.getAttribute("data-min"));
        row.classList.toggle("is-match", !!n && n >= min && n <= max);
      });
    }
    sqft.addEventListener("input", highlight);
  }

  function renderHeader() {
    const links = menu.map(function (item) {
      if (item[2] === "services") {
        return '<div class="nav-drop' + (page === "services" ? " active" : "") + '">' +
          '<button type="button" aria-haspopup="true">Services <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
          '<div class="nav-menu">' +
          '<a href="' + root + 'services.html">All services</a>' +
          services.map(function (s) {
            return '<a href="' + root + "services/" + s[0] + '">' + s[1] + "</a>";
          }).join("") +
          "</div></div>";
      }
      const current = page === item[2] ? ' aria-current="page"' : "";
      return '<a href="' + root + item[0] + '"' + current + ">" + item[1] + "</a>";
    }).join("");
    return '<header class="site-header"><div class="nav-bar">' +
      '<a class="brand" href="' + root + 'index.html"><img src="' + root + 'assets/logo.png" alt="Gator Gaze Real Estate Media"></a>' +
      '<nav class="nav-links" aria-label="Primary">' + links + "</nav>" +
      '<div class="nav-cta"><a class="btn-pill" href="' + root + 'login.html">Login</a>' +
      '<a class="btn-pill" href="' + root + 'book-now.html">Book Now</a></div>' +
      '<button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>' +
      "</div></header>";
  }

  function renderFooter() {
    const r = root;
    return '<section class="estimate"><div class="wrap"><p class="eyebrow">Get a Free Estimate</p>' +
      "<h2>Tell us about the property.</h2>" +
      '<p class="lede">Share a few details and we’ll outline a package. This form stays in your browser.</p>' +
      '<form data-demo><div class="form-grid">' +
      input("NAME", "name", "Your name") +
      input("PHONE", "phone", "(123) 456 78 90") +
      input("EMAIL", "email", "name@youremail.com", "email") +
      select("PROJECT TYPE", "project", ["Residential", "Airbnb/VRBO", "Commercial", "Vacant Land", "Events", "Business Content", "Agent Branding", "Other"]) +
      select("SERVICE NEEDED", "service", [
        "Photography Only",
        "Photography + Drone",
        "Photography + Drone + 3D Tour",
        "Full Package",
        "Real Estate Video/Reels",
        "Zillow 3D Tour or Matterport",
        "Floor Plans",
        "Twilight/Virtual Staging",
        "Airbnb/VRBO Photography",
        "Commercial Photography (incl 3D Tour)",
        "Event Photo/Video",
        "Business Video Content",
        "Agent Reels/Headshots",
        "Not Sure—Help Me Choose",
        "Other"
      ]) +
      input("LOCATION", "location", "City or neighborhood") +
      input("PROJECT SIZE (SQFT)", "sqft", "Square footage", "number") +
      input("PREFERRED SHOOT DATE", "date", "", "date") +
      '<label class="field full"><span>MESSAGE</span><textarea name="message" placeholder="Tell us about the project."></textarea></label>' +
      '</div><button class="btn-pill solid" type="submit">Request Free Estimate</button></form></div></section>' +
      '<footer class="site-footer"><div class="wrap foot-grid">' +
      '<div class="foot-brand"><img src="' + r + 'assets/logo.png" alt="Gator Gaze">' +
      "<p>info@gatorgazemedia.com<br>+1 813 415 6349<br>Tampa Bay, Florida</p>" +
      "<p>Open Sunday–Saturday<br>9:00 AM–6:00 PM</p>" +
      '<div class="socials"><span>Instagram</span><span>Facebook</span><span>YouTube</span></div></div>' +
      "<div><h3>Menu</h3><ul>" +
      link(r + "about.html", "About") + link(r + "services.html", "Services") + link(r + "pricing.html", "Pricing") +
      link(r + "projects.html", "Projects") + link(r + "gallery.html", "Gallery") + link(r + "blog.html", "Blog") +
      link(r + "reviews.html", "Reviews") + link(r + "faq.html", "FAQ") + link(r + "services/videography.html", "Videos") +
      link(r + "contact.html", "Contact") + "</ul></div>" +
      "<div><h3>Services</h3><ul>" + services.map(function (s) {
        return link(r + "services/" + s[0], s[1]);
      }).join("") + "</ul></div>" +
      "<div><h3>Service Areas</h3><ul>" + areas.map(function (a) {
        return link(r + "service-areas/real-estate-photographer-" + a[0] + ".html", a[1]);
      }).join("") + link(r + "service-areas/index.html", "All areas") + "</ul></div></div>" +
      '<div class="wrap legal-row"><div><a href="' + r + 'legal/privacy.html">Privacy Policy</a> · <a href="' + r + 'legal/terms.html">Terms and Conditions</a> · <a href="' + r + 'home-prep.html">Home Prep Checklist</a></div>' +
      '<div class="demo-note">Demo mockup — not affiliated with Gator Gaze Media.</div></div></footer>' +
      '<div class="toast" id="toast" role="status"></div>';
  }

  function input(label, name, placeholder, type) {
    return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="' + (type || "text") + '" placeholder="' + placeholder + '"></label>';
  }
  function select(label, name, options) {
    return '<label class="field"><span>' + label + '</span><select name="' + name + '">' +
      options.map(function (o) { return "<option>" + o + "</option>"; }).join("") + "</select></label>";
  }
  function link(href, label) { return '<li><a href="' + href + '">' + label + "</a></li>"; }

  let toastTimer;
  function toast(message) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.id = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 4200);
  }
})();
