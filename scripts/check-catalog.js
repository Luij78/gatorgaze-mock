const GG = require("../js/catalog.js");

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL", msg);
    process.exitCode = 1;
  }
}

function price(id, sqft, option) {
  return GG.resolve(id, sqft, option);
}

assert(price("basic", 1500).price === 190 && price("basic", 1500).photos === 35, "basic 1500");
assert(price("basic", 1501).price === 215 && price("basic", 1501).photos === 40, "basic 1501");
assert(price("basic", 2500).price === 240, "basic 2500");
assert(price("basic", 2501).price === 290, "basic 2501");
assert(price("basic", 6500).price === 465 && price("basic", 6500).photos === 85, "basic 6500");
assert(price("basic", 6501).quote === true, "basic quote");

assert(price("standard", 2500).price === 325 && price("standard", 2500).photos === 45, "std 2500");
assert(price("standard", 2501).price === 375 && price("standard", 2501).photos === 50, "std 2501");
assert(price("standard", 6500).price === 550 && price("standard", 6500).photos === 85, "std 6500");
assert(price("standard", 6501).quote === true, "std quote");

assert(price("premium", 3000).price === 495 && price("premium", 3000).photos === 45, "prem 3000");
assert(price("premium", 5001).price === 620 && price("premium", 5001).photos === 70, "prem 5001");
assert(price("premium", 6500).price === 670 && price("premium", 6500).photos === 80, "prem 6500");
assert(price("premium", 6501).price === 695 && price("premium", 6501).photos === 85, "prem 6501");
assert(price("premium", 7000).price === 695, "prem 7000");
assert(price("premium", 7001).quote === true, "prem quote");

assert(price("deluxe", 3500).price === 750 && price("deluxe", 3500).photos === 55, "del 3500");
assert(price("deluxe", 7000).price === 925 && price("deluxe", 7000).photos === 90, "del 7000");
assert(price("deluxe", 7001).quote === true, "del quote");

assert(price("zillow", 2500).price === 150, "zillow base");
assert(price("zillow", 2501).price === 175, "zillow up");
assert(price("matterport", 2500).price === 225, "mp base");
assert(price("matterport", 2501).price === 250, "mp up");
assert(price("airbnb", 1000).price === 250, "abnb 1000");
assert(price("airbnb", 5000).price === 600, "abnb 5000");
assert(price("airbnb", 5001).quote === true, "abnb quote");
assert(price("commercial", 3000).price === 500, "com 3000");
assert(price("commercial", 5001).quote === true, "com quote");
assert(price("res-photos", 0, "60").price === 210, "photos 60");
assert(price("event-both", 0, "4").price === 1300, "event 4h");
assert(GG.travelFee(101).fee === 105 && GG.travelFee(101).billable === 70, "travel 101");
assert(GG.travelFee(30).fee === 0, "travel 30");
assert(GG.travelFee(40).fee === 15, "travel 40");
assert(GG.travelFee(39).fee === 0, "travel 39");

const featured = GG.products.filter(function (p) { return p.group === "featured"; });
assert(featured.length === 14, "14 featured products, got " + featured.length);

if (!process.exitCode) console.log("catalog ok", GG.products.length, "products");
