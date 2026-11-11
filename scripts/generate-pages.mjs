import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const GG = require("../js/catalog.js");
const rootDir = join(import.meta.dirname, "..");

const IDS = [
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

const img = (i, w = 1400) => GG.photoUrl(IDS[i % IDS.length], w);
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function write(rel, html) {
  const file = join(rootDir, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function layout({ title, description, root = "", page = "", main, scripts = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="${root}assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}css/site.css">
</head>
<body data-root="${root}" data-page="${page}">
<a class="skip" href="#main">Skip to content</a>
<div id="site-header"></div>
<main id="main">
${main}
</main>
<div id="site-footer"></div>
${scripts}
<script src="${root}js/site.js"></script>
</body>
</html>
`;
}

const services = [
  ["photography.html", "Photography", "Interior and exterior listing photos in Tampa Bay, edited and back to you in 24 hours.", "Photo sets start at $150.", 0],
  ["videography.html", "Videography", "Vertical walkthroughs from $175 and cinematic listing films from $350, delivered in 48 to 72 hours.", "Reels from $175 · cinematic from $350.", 1],
  ["aerial-photos-videos.html", "Aerial Photos and Videos", "FAA Part 107 drone photos and video across Tampa Bay.", "10 aerial photos $125 · photo plus video $250.", 23],
  ["3d-virtual-tours.html", "3D Virtual Tours", "Zillow 3D Home tours from $150 and Matterport tours from $225, delivered in 24 hours.", "Zillow from $150 · Matterport from $225.", 4],
  ["floor-plans.html", "Floor Plans", "2D floor plans come with every package. Upgraded 2D plans are $75 and 3D plans are $125.", "2D upgrade $75 · 3D $125.", 16],
  ["twilight.html", "Twilight Photography", "Real dusk sessions with 5 photos for $200, or virtual twilight edits at $15 per image.", "5 real photos $200 · virtual $15 each.", 11],
  ["virtual-staging.html", "Virtual Staging", "Virtual staging for empty Tampa Bay rooms at $25 per image, back within 24 hours.", "$25 per image.", 2],
  ["commercial-photography.html", "Commercial Photography", "Commercial property photos from $500 for up to 3,000 sq ft, with a commercial usage license.", "From $500 to 3,000 sq ft.", 25],
  ["airbnb-vrbo-photography.html", "Airbnb/VRBO Photography", "Airbnb and VRBO photos from $250 across Tampa Bay and the Gulf beaches, with a short-term rental license.", "From $250.", 10],
  ["zillow-showcase.html", "Zillow Showcase", "Showcase-ready photos, a 3D tour, and a floor plan. Packages from $325, with 24-hour delivery.", "Packages from $325.", 6],
  ["community-photos.html", "Community Photos", "Neighborhood and amenity photos for your listing, $30 when added to a shoot. Included in Standard and up.", "$30 add-on.", 27],
  ["listing-websites.html", "Listing Websites", "A single-page website for each listing, with photos, video, tour, and floor plan on one link.", "Included with every package.", 8],
  ["events.html", "Events", "Event video from $500 and event photography from $400 for 2 hours, with same-day delivery available.", "Video from $500 · photos from $400.", 22],
  ["business-content.html", "Business Content", "Social videos, interviews, testimonials, and brand videos. Packages from $950 and monthly plans from $1,100.", "Packages from $950.", 24],
  ["agent-branding.html", "Agent Branding", "Reel packages and headshots for Tampa Bay real estate agents.", "From $295.", 20]
];

const projects = [
  ["indian-shores-airbnb-home", "Indian Shores Airbnb Home", "airbnb", "Apartment", "Airbnb photos, a Matterport 3D tour, cinematic video, and twilight for a Gulf-front vacation rental in Indian Shores.", "1,250 sq ft · about 3 hours on site"],
  ["anna-maria-airbnb-home", "Anna Maria Airbnb Home", "airbnb", "Single Home", "Airbnb and VRBO photos, a Matterport 3D tour, and cinematic video of a vacation home on Anna Maria Island.", "2,881 sq ft"],
  ["beach-park-home", "Beach Park Home", "residential", "Single Home", "Premium package photos and video of a two-story house in the Beach Park area of South Tampa.", "5,567 sq ft · about 3 hours on site"],
  ["sunset-park-home", "Sunset Park Home", "residential", "Single Home", "Listing photos, drone coverage, and a 2D floor plan for a Sunset Park residence.", "Residential package"],
  ["fishhawk-trails-house", "Fish Hawk Trails House", "residential", "Luxury Residence", "A full media set for a luxury home in Fish Hawk, with twilight and a Zillow 3D tour.", "Luxury residence"],
  ["classic-st-pete-home", "Classic St. Pete Home", "residential", "Single Home", "Interior, exterior, and aerial photos for a classic St. Petersburg house.", "Single-family listing"],
  ["goddard-school-winter-garden", "The Goddard School of Winter Garden", "commercial", "School", "Commercial photos of a Winter Garden school, delivered with a commercial usage license.", "Commercial"],
  ["winter-garden-townhome", "Winter Garden Townhome", "residential", "Townhome", "MLS photos and a floor plan for a Winter Garden townhome.", "Townhome"],
  ["sunset-park-estate", "Sunset Park Custom Estate", "residential", "Luxury Residence", "Deluxe coverage of a custom estate in South Tampa, including cinematic video.", "South Tampa"],
  ["ybor-bungalow", "Ybor City Bungalow", "airbnb", "Single Home", "Vacation-rental photos of a Ybor bungalow set up with a hot tub and sauna.", "Short-term rental"],
  ["desoto-acres-estate", "DeSoto Acres Estate", "residential", "Luxury Residence", "Photos and drone coverage of an estate with casitas and a warehouse.", "Estate"],
  ["pasadena-waterfront", "Pasadena Waterfront Estate", "residential", "Luxury Residence", "Waterfront listing media near the Pasadena Yacht and Country Club.", "Waterfront"],
  ["sarasota-airbnb", "Sarasota Airbnb Home", "airbnb", "Single Home", "Short-term rental photos and a 3D tour for a Sarasota house.", "Airbnb / VRBO"],
  ["encore-resort-villa", "Encore Resort Vacation Home", "airbnb", "Luxury Residence", "A large vacation rental near Disney, photographed for the listing platforms.", "Vacation rental"],
  ["prime-tampa-warehouse", "Prime Tampa Warehouse", "commercial", "Industrial", "Commercial interior and exterior photos of a Tampa warehouse.", "Industrial"],
  ["channelside-patio", "Channelside Patio Shade", "commercial", "Restaurant", "Commercial photos of shade sails and a pergola at Channelside in Tampa.", "Hospitality"],
  ["wimauma-acreage", "Wimauma Acreage", "land", "Vacant Land", "A mix of aerial and ground photos for vacant land with oaks and road frontage.", "15-photo land set"],
  ["carrollwood-midcentury", "Carrollwood Mid-Century Home", "residential", "Single Home", "A mid-century home in Carrollwood, shot for a listing launch.", "Residential"],
  ["palmetto-waterfront", "Palmetto Waterfront Home", "residential", "Single Home", "Canal-front pool home in Palmetto with drone and twilight.", "Waterfront"],
  ["st-cloud-farmhouse", "St. Cloud Modern Farmhouse", "residential", "Single Home", "Modern farmhouse listing photos in St. Cloud.", "Residential"],
  ["champions-gate-airbnb", "Champions Gate Vacation Home", "airbnb", "Townhome", "Airbnb and vacation-home photos in Champions Gate.", "Townhome"],
  ["harbour-isles-home", "Harbour Isles Home", "residential", "Single Home", "Neighborhood listing photos in Harbour Isles.", "Residential"],
  ["brandon-home", "Brandon Home", "residential", "Single Home", "A polished residential package in Brandon.", "Residential"],
  ["orlando-airbnb", "Orlando Airbnb Home", "airbnb", "Single Home", "Short-term rental media for an Orlando house.", "Airbnb / VRBO"]
];

const reviews = [
  ["Kristina K.", "Tampa Bay agent", "Google Review", "Gator Gaze is top-notch! Omer delivers high-quality work with incredible attention to detail from stunning photos. He’s super professional and great to work with."],
  ["Patty W.", "Broker", "Google Review", "They did a great job. Pictures done well. Came out quick and squeezed my listing in on short notice. Very reasonably priced. I’ll be using them again!"],
  ["Michele D.", "Home seller", "Google Review", "Fast response, a same-week opening, and photos that were easy to upload the next morning. Professional from the first text to delivery."],
  ["Andre P.", "Listing agent", "Google Review", "Reliable, on time, and the pictures look like the house — just cleaner. I’ll book them on the next one."],
  ["Elena S.", "Realtor", "Google Review", "Friendly team, easy scheduling, and a gallery that was ready before my broker tour."],
  ["Chris M.", "Property manager", "Google Review", "The aerials showed the lot better than I could describe it. Lighting was consistent from room to room."],
  ["Priya N.", "Airbnb host", "Google Review", "They treated the rental like a listing and a hospitality shoot at the same time. Guests mention the photos."],
  ["Jordan L.", "Homeowner", "Google Review", "Clear instructions before the shoot, no fuss on site, and the files arrived the next morning."],
  ["Sam R.", "Team lead", "Yelp Review", "Floor plan, property site, and photos showed up together. That is the part my agents actually use."],
  ["Alex T.", "Commercial client", "Google Review", "Straightforward to book, careful with the occupied office, and the edit matched the brand colors we sent."],
  ["Riley H.", "Builder", "Google Review", "Model-home photos were consistent across three elevations. Easy to hand to the marketing team."],
  ["Noah B.", "South Tampa agent", "Google Review", "Twilight frames and the daytime set felt like the same house. Turnaround kept the listing on schedule."]
];

const faqs = [
  ["What services does Gator Gaze Media offer?", "Photo and video for real estate listings (photos, drone, floor plans, Zillow 3D tours, Matterport, reels, cinematic video, virtual staging, and twilight), Airbnb and VRBO rentals, commercial spaces, events, business social content, and agent branding reels and headshots."],
  ["Which areas do you serve?", "Tampa, South Tampa, Brandon, Valrico, Lutz, Wesley Chapel, St. Petersburg and the Pinellas beaches, Bradenton, Anna Maria Island, Longboat Key, Sarasota, Siesta Key, Spring Hill, Lakeland, Orlando, and Kissimmee. For other nearby cities, reach out for a custom quote."],
  ["How can I book a photography session?", "Choose a service on the booking page and place the order online. You can also call (813) 415-6349 or email info@gatorgazemedia.com."],
  ["What is the turnaround time?", "Edited photos are delivered within 24 hours of the shoot. Videos and virtual services are typically delivered within 48–72 hours. Photos are ready by 10:00 AM the morning after the shoot."],
  ["Do you offer same-day services?", "Urgent requests are accommodated when the schedule allows. Contact the studio directly to check same-day availability. Event same-day delivery is a $150 add-on."],
  ["Do you work with both residential and commercial properties?", "Yes. The same team covers residential listings, commercial spaces, vacation rentals, and events."],
  ["How do I prepare my property?", "Have the property completely ready on arrival: all lights on, all blinds and curtains open, and all ceiling fans off. No one should be inside when the shoot starts, including pets, unless absolutely necessary, and no cars may be parked in the driveway. The Home Prep Guide has the full checklist."],
  ["What payment methods do you accept?", "Major credit cards and bank transfers. Payment is typically due when the final files are delivered. No deposit is required."],
  ["Can I reschedule or cancel?", "There is no fee to reschedule or cancel. Please send word at least 24 hours before the appointment."],
  ["How will I receive my photos and videos?", "Through a private online gallery where you can view, download, and share. Galleries include MLS-ready and high-resolution versions. Packages also include a property website."],
  ["Can you add community or amenity photos?", "Yes. Pools, clubhouses, and neighborhood entrances can be added. Community photos are $30 on a photo-only order and included in Standard and above."],
  ["Do you provide virtual staging or twilight edits?", "Yes. Virtual staging is $25 per image and virtual twilight is $15 per image on residential orders. Real twilight is 5 photos for $200."],
  ["Do you offer video walkthroughs or reels?", "Vertical social reels start at $175 and cinematic listing videos are $350. Agent on camera is $100."],
  ["Can you include drone lot lines or map pins?", "Yes. Digital lot lines and pins are a $10 residential add-on and are included in Standard packages and above."],
  ["Who do you work with?", "Realtors, builders, investors, property managers, and homeowners. Each shoot is set up around the listing or the brand."],
  ["What if the weather is bad?", "If rain or the sky will not serve the property, the shoot can be rescheduled at no extra cost. The Blue Sky Guarantee covers sky replacement on delivered photos when a reshoot is not the better call."],
  ["Do you offer weekend shoots?", "Seven days a week, 9:00 AM to 6:00 PM, subject to availability."],
  ["How long does a typical shoot take?", "Most photo shoots take 45–90 minutes depending on size and add-ons. Larger homes and video days run longer."],
  ["Can I be present during the shoot?", "To keep the appointment on time, the home should be empty when the shoot starts, including pets, unless that is impossible. Lockbox access is welcome."],
  ["Do you shoot events?", "Yes. Parties, mixers, fundraisers, and corporate events. Event video starts at $500, photography at $400, and photo plus video at $800, all with a 2-hour minimum."],
  ["What does Agent Branding include?", "Vertical reels edited with music, logo, and captions. An intro reel is $295, 3 reels are $650, 6 reels are $1,150, and 10 reels plus a bio video are $1,750. Headshots are $150 and booked separately."],
  ["How do reel package locations work?", "3 reels cover up to 2 locations, 6 reels up to 3, and 10 reels up to 4. An extra location is $100."],
  ["Do you create social content for businesses?", "Yes. Single videos from $350, plus starter, growth, and pro packages, and monthly plans from $1,100."],
  ["What is an AI video edit?", "An optional $50-per-scene add-on for a more polished look, smoother transitions, or visual effects. A vacant-land-to-property AI video is $350."],
  ["Do you photograph vacant land?", "Yes. $150 for a mix of 15 drone and ground photos. A one-minute drone video and an AI property video can be added."],
  ["Why are Airbnb, commercial, and event shoots priced differently?", "MLS listing photos are licensed for listing marketing. Airbnb, commercial, event, business, and agent-branding work is licensed for broader advertising, so it is priced separately."],
  ["What is the difference between Airbnb and MLS photography?", "Airbnb and VRBO photography has no photo limit and includes an extended usage license, drone photos, lot lines, community photos, and virtual twilight. MLS photos follow the package photo counts."],
  ["Do you offer a Zillow 3D Tour for commercial spaces?", "A commercial Zillow 3D Tour is $200 up to 2,500 sq ft and $225 above that. Commercial Matterport starts at $275."],
  ["How much do agent headshots cost in Tampa?", "$150 for a 30-minute on-location session, one look, and 3 retouched photos within 48 hours."],
  ["How much do business portraits cost?", "$150 per person, on location. A team spotlight video is $400 and can be filmed on the same visit."],
  ["What does a monthly video package cost?", "$1,100 for 4 videos, $2,000 for 8, and $2,800 for 12, from one scheduled shoot. Logo and captions are $50."],
  ["How much do interview and testimonial videos cost?", "An interview is $550, a testimonial is $450, a team spotlight is $400, and a brand or promo video is $900."],
  ["How much is the travel fee outside Tampa?", "The first 30 miles from South Tampa are free. After that it is $15 for every 10 miles, rounded down to the nearest 10 miles, on the one-way distance."],
  ["Do you provide branding or marketing materials?", "Packages include a branded and unbranded property website. A logo, headshot, or contact line can be added to the gallery."]
];

const posts = [
  ["2026-08-31", "Aug 31, 2026", "Articles", "10 min", "Gator Gaze Media Featured on Redfin: What Virtual Tours Show"],
  ["2026-05-05", "May 5, 2026", "Articles", "5 min", "Real Estate Photography Cost in Tampa, FL: 2026 Pricing Guide"],
  ["2026-05-05", "May 5, 2026", "Articles", "5 min", "What Is Zillow Showcase and Why Tampa Agents Need It in 2026"],
  ["2026-05-05", "May 5, 2026", "Tips", "15 min", "Best Real Estate Photographers in Tampa Bay: What to Look For"],
  ["2026-05-05", "May 5, 2026", "Tips", "12 min", "Tampa Home Staging Guide: Prepare Your Home for Photos"],
  ["2026-05-05", "May 5, 2026", "Articles", "8 min", "Drone Real Estate Photography in Tampa: Is It Worth It?"],
  ["2026-05-05", "May 5, 2026", "Articles", "12 min", "Matterport vs. Zillow 3D Home Tour for Tampa Listings"],
  ["2026-05-05", "May 5, 2026", "Tips", "8 min", "Airbnb and VRBO Photography in Tampa Bay: A Host's Guide"],
  ["2026-05-05", "May 5, 2026", "Articles", "5 min", "Virtual Staging vs. Real Staging in Tampa: Cost Comparison"],
  ["2026-05-05", "May 5, 2026", "Articles", "7 min", "South Tampa Real Estate Market 2026: Why Photos Matter"],
  ["2026-05-05", "May 5, 2026", "Tips", "5 min", "Twilight Real Estate Photography in Tampa: Real vs. Virtual"],
  ["2026-05-05", "May 5, 2026", "Articles", "6 min", "Real Estate Floor Plans in Tampa: Why They Matter and Cost"],
  ["2026-05-05", "May 5, 2026", "Articles", "7 min", "Walkthrough vs. Cinematic Real Estate Video in Tampa"],
  ["2026-05-05", "May 5, 2026", "Articles", "7 min", "Agent On Camera: Why Tampa Realtors Should Be on Video"],
  ["2026-05-05", "May 5, 2026", "Articles", "7 min", "Commercial Photography in Tampa, FL: Uses and Pricing"],
  ["2026-09-08", "Sep 8, 2026", "Tips", "5 min", "Anna Maria Island Airbnb Photography: What Photos Must Show"],
  ["2026-09-10", "Sep 10, 2026", "Tips", "6 min", "Photographing Beach Rentals: St. Pete Beach to Madeira Beach"],
  ["2026-09-13", "Sep 13, 2026", "Tips", "5 min", "Beach House Rental Photography: Gulf Light, Glare and Sunsets"],
  ["2026-09-16", "Sep 16, 2026", "Tips", "6 min", "Drone Photos for Beachfront Rentals: What the Aerial Must Prove"],
  ["2026-09-18", "Sep 18, 2026", "Tips", "6 min", "Airbnb Photo Shoot Checklist: How to Prep Your Rental"],
  ["2026-09-22", "Sep 22, 2026", "Articles", "6 min", "St. Petersburg Real Estate Photography: Bungalows to Waterfront"],
  ["2026-09-23", "Sep 23, 2026", "Articles", "6 min", "How Much Does Airbnb Photography Cost in Tampa Bay?"],
  ["2026-09-27", "Sep 27, 2026", "Articles", "6 min", "Siesta Key and Longboat Key Vacation Rental Photography"],
  ["2026-09-27b", "Sep 27, 2026", "Articles", "6 min", "South Tampa Real Estate Photography: Homes and Waterfront"],
  ["2026-09-30", "Sep 30, 2026", "Tips", "6 min", "How to Hire a Vacation Rental Photographer: 8 Questions"],
  ["2026-10-01", "Oct 1, 2026", "Articles", "5 min", "Zillow Showcase Cost: What Agents and Sellers Actually Pay"],
  ["2026-10-02", "Oct 2, 2026", "Tips", "6 min", "How Many Photos Does an Airbnb Listing Need, and What Comes First"],
  ["2026-10-02b", "Oct 2, 2026", "Articles", "5 min", "Zillow Showcase Photographer in Tampa Bay: Get Showcase Ready"],
  ["2026-10-03", "Oct 3, 2026", "Tips", "5 min", "Real Estate Photography Prep Checklist: Before We Arrive"],
  ["2026-10-04", "Oct 4, 2026", "Articles", "5 min", "3D Virtual Tour Prices: Zillow 3D Home vs Matterport in Tampa"],
  ["2026-10-16a", "Oct 16, 2026", "Tips", "6 min", "How Much Does Event Photography and Video Cost in Tampa?"],
  ["2026-10-16b", "Oct 16, 2026", "Articles", "7 min", "Real Estate Agent Reels in Tampa: Packages, Pricing and How Many You Need"],
  ["2026-10-16c", "Oct 16, 2026", "Articles", "7 min", "Business Video and Social Media Content in Tampa: What It Costs"],
  ["2026-10-16d", "Oct 16, 2026", "Articles", "5 min", "AI Video Edit for Real Estate and Property Videos: What It Is and When to Use It"],
  ["2026-10-16e", "Oct 16, 2026", "Articles", "6 min", "Vacant Land Marketing in Tampa: Photos, Drone and AI Property Video"],
  ["2026-10-16f", "Oct 16, 2026", "Tips", "6 min", "Corporate Event Photography in Tampa: A Planning Checklist"],
  ["2026-10-16g", "Oct 16, 2026", "Articles", "6 min", "Which Photo or Video Service Do You Need? A Guide for Tampa Bay"],
  ["2026-10-16h", "Oct 16, 2026", "Articles", "5 min", "Zillow 3D Tour for Commercial Spaces in Tampa: Cost and When It Helps"],
  ["2026-10-16i", "Oct 16, 2026", "Articles", "5 min", "Agent Headshots in Tampa: What to Expect and What It Costs"],
  ["2026-10-16j", "Oct 16, 2026", "Articles", "5 min", "Business Portraits and Team Photos in Tampa: Pricing and Tips"],
  ["2026-10-16k", "Oct 16, 2026", "Articles", "6 min", "Monthly Video Content for Tampa Small Businesses: Packages and Pricing"],
  ["2026-10-16l", "Oct 16, 2026", "Articles", "5 min", "Interview and Testimonial Videos in Tampa: What They Cost"],
  ["2026-10-16m", "Oct 16, 2026", "Articles", "5 min", "Cinematic Video for Commercial Spaces in Tampa: Cost and Use Cases"],
  ["2026-11-04", "Nov 4, 2026", "Tips", "5 min", "Winter Listing Photos in Tampa Bay: Shoot Times, Twilight and Prep Tips"]
];

function slugify(title, id) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return base + (String(id).endsWith("b") || /[a-z]$/.test(String(id).slice(-1)) && String(id).includes("16") ? "" : "");
}

const cities = [
  ["tampa-fl", "Tampa"],
  ["st-petersburg-fl", "St. Petersburg"],
  ["clearwater-fl", "Clearwater"],
  ["sarasota-fl", "Sarasota"],
  ["bradenton-fl", "Bradenton"],
  ["spring-hill-fl", "Spring Hill"],
  ["lakeland-fl", "Lakeland"],
  ["orlando-fl", "Orlando"],
  ["kissimmee-fl", "Kissimmee"],
  ["winter-garden-fl", "Winter Garden"],
  ["anna-maria-island-fl", "Anna Maria Island"],
  ["holmes-beach-fl", "Holmes Beach"],
  ["bradenton-beach-fl", "Bradenton Beach"],
  ["longboat-key-fl", "Longboat Key"],
  ["siesta-key-fl", "Siesta Key"],
  ["st-pete-beach-fl", "St. Pete Beach"],
  ["treasure-island-fl", "Treasure Island"],
  ["madeira-beach-fl", "Madeira Beach"],
  ["indian-rocks-beach-fl", "Indian Rocks Beach"],
  ["indian-shores-fl", "Indian Shores"],
  ["clearwater-beach-fl", "Clearwater Beach"],
  ["south-tampa-fl", "South Tampa"],
  ["brandon-fl", "Brandon"],
  ["valrico-fl", "Valrico"],
  ["lutz-fl", "Lutz"],
  ["wesley-chapel-fl", "Wesley Chapel"],
  ["zephyrhills-fl", "Zephyrhills"],
  ["odessa-fl", "Odessa"]
];

const lineArt = `<svg viewBox="0 0 680 460" fill="none" stroke="#1b4339" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M48 392c70 18 130 22 210 6 90-18 150-8 250 18 40 8 80 6 120-6"/>
  <path d="M120 378c40 16 90 18 140 4 36-10 70-6 110 8"/>
  <ellipse cx="250" cy="386" rx="128" ry="16"/>
  <path d="M168 386v-18M332 386v-14"/>
  <path d="M188 250h250l18 18v112l-18 8H176l-22-10V268z"/>
  <path d="M176 268V214h210v54"/>
  <path d="M168 214h236"/>
  <path d="M150 232h40M168 214l-28 22"/>
  <path d="M196 232h150v70H196z"/>
  <path d="M246 232v70M296 232v70M196 267h150"/>
  <path d="M360 248h70v54h-70z"/>
  <path d="M395 248v54M360 275h70"/>
  <path d="M176 214V176h150"/>
  <path d="M196 196h110"/>
  <path d="M206 176v40M246 176v40M286 176v40"/>
  <path d="M176 196h20"/>
  <path d="M326 176v22h48v-8"/>
  <path d="M334 186h32M350 176v22"/>
  <path d="M150 250h28v28h-20"/>
  <path d="M158 258h12M150 264h28"/>
  <path d="M430 232c28 8 48 28 52 52"/>
  <path d="M470 300c8 10 8 22-2 30"/>
  <path d="M78 360c10-28 18-70 14-96 8 20 22 48 22 78"/>
  <path d="M86 300c16-6 22 8 14 20"/>
  <path d="M560 348c12-40 8-78-8-96"/>
  <path d="M548 280c10 16 22 18 28 8 6 16-4 36-16 48"/>
  <path d="M250 402c20 6 40 6 62 0"/>
  <path d="M40 420h600"/>
</svg>`;

function serviceCard(s, i, root) {
  return `<a class="svc-card" href="${root}services/${s[0]}">
    <div class="thumb" style="background-image:url('${img(s[4] ?? i)}')"><img data-fallback src="${img(s[4] ?? i, 900)}" alt=""></div>
    <div class="body"><h3>${s[1]}</h3><p class="muted">${s[2]}</p><p class="price-line">${s[3]}</p><span class="more-link">View service</span></div>
  </a>`;
}

function home() {
  const featured = services.map((s, i) => serviceCard(s, i, "")).join("");
  const homeFaqs = faqs.slice(0, 6).map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("");
  const homePosts = posts.slice(0, 4).map((p, i) => postCard(p, i, "")).join("");
  const homeProjects = projects.slice(0, 3).map((p, i) => projectCard(p, i, "")).join("");
  return `<section class="hero"><div class="hero-grid">
    <div class="hero-left">
      <h1>Real Estate Photographer in Tampa Bay</h1>
      <p class="hero-sub">By the gators, for the realtors</p>
      <div class="t-rotator">
        <div data-quote><div class="stars" aria-label="5 stars">★★★★★</div><p class="t-text">Gator Gaze is top-notch! Omer delivers high-quality work with incredible attention to detail from stunning photos. He’s super professional and great to work with. <strong>Kristina K.</strong></p></div>
        <div data-quote hidden><div class="stars" aria-label="5 stars">★★★★★</div><p class="t-text">They did a great job. Pictures done well. Came out quick and squeezed my listing in on short notice. Very reasonably priced. I’ll be using them again! <strong>Patty W.</strong></p></div>
        <div data-quote hidden><div class="stars" aria-label="5 stars">★★★★★</div><p class="t-text">Fast response, a same-week opening, and photos that were easy to upload the next morning. Professional from the first text to delivery. <strong>Michele D.</strong></p></div>
      </div>
      <div class="hero-rule" aria-hidden="true"><span></span><span></span><span></span></div>
    </div>
    <div class="hero-right">
      <div class="lineart">${lineArt}</div>
      <p class="hero-side">Listing photos, drone, video, and 3D tours delivered by a local Tampa Bay team.</p>
      <div class="hero-cta"><a class="btn-pill" href="book-now.html">Book Now</a><a class="btn-circle" href="book-now.html" aria-label="Book now">${arrow}</a></div>
    </div>
  </div></section>
  <section class="showcase" style="--photo:url('${img(4, 2000)}')">
    <div class="showcase-inner"><h2>Zillow Showcase Approved</h2><p>High-Impact Media for Every Listing</p></div>
  </section>
  <div class="feature-row">
    <article class="feature-card"><div class="ic">${icon("camera")}</div><h3>Showcase-Optimized Photos</h3><p>High-impact photography built for maximum visibility on Zillow.</p></article>
    <article class="feature-card"><div class="ic">${icon("video")}</div><h3>Cinematic Videos</h3><p>Cinematic walkthroughs that meet Showcase editorial standards.</p></article>
    <article class="feature-card"><div class="ic">${icon("drone")}</div><h3>Aerial Coverage</h3><p>Drone angles that elevate your listing’s story.</p></article>
    <article class="feature-card"><div class="ic">${icon("cube")}</div><h3>3D Tours &amp; Floor Plans</h3><p>Interactive tools buyers love — and Zillow prioritizes.</p></article>
  </div>
  <section class="section"><div class="wrap">
    <div class="section-head"><div><p class="eyebrow">By the numbers</p><h2>A local team with a long list of listings.</h2></div></div>
    <div class="stats">
      <div class="stat"><b><span data-count="1500">0</span>+</b><span>Projects completed across Tampa Bay and Central Florida.</span></div>
      <div class="stat"><b><span data-count="15">0</span>+</b><span>Years in photography, video, and marketing.</span></div>
      <div class="stat"><b><span data-count="1000">0</span>+</b><span>Clients — agents, owners, builders, and hosts.</span></div>
    </div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap split">
    <div class="media-frame"><img data-fallback src="${img(7, 1400)}" alt="Bright living room prepared for listing photos"></div>
    <div class="about-copy"><p class="eyebrow">About us</p><h2 class="block-title">Photos, video, drone, floor plans, and 3D tours.</h2>
      <p>Gator Gaze Media provides real estate photography, video, drone coverage, floor plans, and 3D tours for agents, homeowners, builders, and vacation rental hosts across Tampa Bay. With more than 15 years of experience in photography, videography, and marketing, we know how to photograph a property clearly, work efficiently on site, and deliver media that is ready to use.</p>
      <a class="btn-pill" href="about.html">Know More</a></div>
  </div></section>
  <section class="section" style="padding-top:10px"><div class="wrap">
    <div class="section-head"><div><p class="eyebrow">What we do</p><h2>Services</h2></div><a class="btn-pill" href="services.html">View All Services</a></div>
    <div class="svc-grid">${featured}</div>
  </div></section>
  <section class="section" style="padding-top:20px"><div class="wrap">
    <div class="section-head"><div><p class="eyebrow">Pricing plans</p><h2>Choose your perfect service package</h2></div><a class="more-link" href="pricing.html">Full price tables</a></div>
    <div class="pkg-grid">
      ${pkg("Basic Package", "$190", ["Interior and exterior photos", "Drone photos", "2D floor plan", "Property website", "Community photos", "Touch-ups and item removal", "Digital lot lines", "Blue Sky Guarantee", "24-hour turnaround"], "order/index.html")}
      ${pkg("Standard Package", "$325", ["Everything in Basic", "1 virtual twilight image", "Zillow 3D tour or social reel"], "order/index.html")}
      ${pkg("Premium Package", "$495", ["Everything in Standard", "2 virtual twilight images", "Zillow 3D tour", "Vertical social reel"], "order/index.html")}
      ${pkg("Deluxe Package", "$750", ["4 virtual twilight images", "Zillow 3D or Matterport", "Cinematic video", "Matterport hosting 6 months, then $75"], "order/index.html")}
    </div>
  </div></section>
  <section class="section" style="padding-top:10px"><div class="wrap">
    <div class="section-head"><div><p class="eyebrow">Our portfolio</p><h2>Projects</h2></div><a class="btn-pill" href="projects.html">All Projects</a></div>
    <div class="project-grid">${homeProjects}</div>
    <p style="margin-top:22px">Get inspired by our 1000+ project images. <a class="more-link" href="gallery.html">Explore Gallery</a></p>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="band"><div><p class="eyebrow" style="color:#c9d5cf">Clients’ words</p><h2>Tampa Bay real estate photography, video, and drone.</h2>
      <p>We photograph homes, condos, commercial spaces, and vacation rentals throughout Tampa Bay. Book listing photos on their own or combine them with drone images, cinematic video, floor plans, a 3D tour, and a property website.</p></div>
      <div><a class="btn-pill" href="book-now.html">Start a Project</a></div></div>
  </div></section>
  <section class="section"><div class="wrap spec-grid">
    <div class="quote-block"><p class="eyebrow">Our specialties</p><q>We show up prepared, photograph the property carefully, and keep the process straightforward. Agents should be able to book a shoot, get dependable media, and move on with the listing.</q><p><strong>Omer Sanli</strong><br><span class="muted">Founder, Gator Gaze Media</span></p></div>
    <div><h2 class="block-title" style="font-size:42px">What it’s like to work with Gator Gaze</h2><div class="spec-list">
      <article><h3>Next-Day Delivery</h3><p class="muted">Photos are ready by 10:00 AM the morning after the shoot.</p></article>
      <article><h3>All-in-One Media</h3><p class="muted">Photos, drone, video, 2D and 3D floor plans, virtual tours, and property websites.</p></article>
      <article><h3>Local Expertise</h3><p class="muted">We know the Tampa Bay market and the details buyers pause on.</p></article>
      <article><h3>Hassle-Free Booking</h3><p class="muted">Schedule a shoot online in a few clicks.</p></article>
      <article><h3>Personal Touch</h3><p class="muted">Packages shaped to the property, and a real person on the thread.</p></article>
      <article><h3>Consistent Quality</h3><p class="muted">The same edit, the same care, listing after listing.</p></article>
    </div></div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="section-head"><div><p class="eyebrow">Articles and insights</p><h2>Tips</h2></div><a class="more-link" href="blog.html">All posts</a></div>
    <div class="post-grid">${homePosts}</div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="section-head"><div><p class="eyebrow">Frequently asked questions</p><h2>Your questions, our answers</h2></div><a class="more-link" href="faq.html">All FAQs</a></div>
    <div class="faq">${homeFaqs}</div>
  </div></section>`;
}

function pkg(name, price, items, href) {
  return `<article class="price-card"><h3>${name}</h3><p class="muted">Starting from</p><div class="from">${price}</div><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul><a class="btn-pill" href="${href}">Book</a></article>`;
}

function icon(name) {
  if (name === "video") return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10l6-3v10l-6-3z"/></svg>';
  if (name === "drone") return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="2"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>';
  if (name === "cube") return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>';
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
}

function projectCard(p, i, root) {
  const labels = { residential: "Residential", airbnb: "Airbnb / VRBO", commercial: "Commercial", land: "Vacant Land" };
  return `<a class="project-card" data-cat="${p[2]}" href="${root}projects/${p[0]}.html">
    <div class="thumb" style="background-image:url('${img(i + 3)}')"><img data-fallback src="${img(i + 3, 1000)}" alt=""></div>
    <div class="body"><span class="tag">${labels[p[2]]} · ${p[3]}</span><h3>${p[1]}</h3><p class="muted">${p[4]}</p><span class="more-link">View project</span></div>
  </a>`;
}

function postCard(p, i, root) {
  const slug = postSlugs[i];
  return `<a class="post-card" data-cat="${p[2].toLowerCase()}" href="${root}blog/${slug}.html">
    <div class="thumb" style="background-image:url('${img(i + 8)}')"></div>
    <div class="body"><p class="meta">${p[2]} · ${p[1]} · ${p[3]}</p><h3>${p[4]}</h3><span class="more-link">Read post</span></div>
  </a>`;
}

function postSlug(p) {
  const base = p[4].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);
  if (p[0].endsWith("b")) return base + "-homes";
  if (p[0].length > 10) return base + "-" + p[0].slice(-1);
  return base;
}

const seen = new Set();
function uniqueSlug(p) {
  let s = p[4].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 72);
  if (seen.has(s)) s += "-" + p[0].replace(/[^a-z0-9]/g, "");
  seen.add(s);
  return s;
}

const postSlugs = posts.map((p) => uniqueSlug(p));

function pageHero(eyebrow, title, lede) {
  return `<section class="page-hero"><div class="wrap"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ""}</div></section>`;
}

write("index.html", layout({
  title: "Tampa Bay Real Estate Photography | Gator Gaze Media",
  description: "Listing photos, drone, video, and 3D tours delivered by a local Tampa Bay team. Demo mockup.",
  page: "home",
  main: home()
}));

write("about.html", layout({
  title: "About Us | Gator Gaze Media",
  description: "Tampa Bay real estate media studio with 15+ years in photography, video, and marketing.",
  page: "about",
  main: `${pageHero("About", "About Us", "With over 15 years of experience in photography, videography, and marketing, Gator Gaze Media brings a seasoned approach to Tampa Bay real estate media.")}
  <section class="section" style="padding-top:20px"><div class="wrap split">
    <div class="prose">
      <p>Our mission is simple: help local agents and homeowners showcase properties with high-quality photos, cinematic video tours, drone imagery, 2D and 3D floor plans, and marketing tools. Everything we deliver is fast, consistent, and handled with attention to detail.</p>
      <p>We believe every home has a story to tell. The team works with realtors and homeowners to create visuals that do more than present a property. They give buyers a way to imagine themselves inside it.</p>
      <blockquote class="quote-block"><q>Every listing has a unique story to share. Our role is to capture that story through photography, video, and media that not only showcase the property but also inspire buyers to take the next step.</q><p>Gator Gaze Media Team</p></blockquote>
    </div>
    <div class="media-frame" style="min-height:460px"><img data-fallback src="${img(5, 1400)}" alt="Modern home exterior"></div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap stats">
    <div class="stat"><b>1</b><span>Vision — turn every listing into a visual experience that sells.</span></div>
    <div class="stat"><b>10+</b><span>Counties, from Hillsborough and Pinellas through Orange County.</span></div>
    <div class="stat"><b>1500+</b><span>Projects completed. 1000+ clients. 15+ years.</span></div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap">
    <p class="eyebrow">Mission</p>
    <h2 class="block-title">To empower real estate professionals with reliable visual content.</h2>
    <p class="lede">We’re committed to consistent results through creativity, professionalism, and current tools — content that captures attention, builds trust, and helps properties sell faster.</p>
    <p class="eyebrow" style="margin-top:28px">Values</p>
    <div class="values"><span>Visual excellence</span><span>Local expertise</span><span>Consistency</span><span>Speed and reliability</span><span>Client-centric</span><span>Innovation</span><span>Collaboration</span><span>Attention to detail</span><span>Flexibility</span></div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap">
    <p class="eyebrow">This is our journey with you</p>
    <h2 class="block-title">From booking to delivery</h2>
    <div class="steps" style="margin-top:20px">
      <article class="step-card"><b>01</b><h3>Booking &amp; consultation</h3><p class="muted">Schedule online. We confirm size, services, and special requests.</p></article>
      <article class="step-card"><b>02</b><h3>On-site shoot</h3><p class="muted">We arrive on time for photos, drone, video, and 3D capture.</p></article>
      <article class="step-card"><b>03</b><h3>Editing &amp; production</h3><p class="muted">Color, sky replacement, and touch-ups are part of the edit.</p></article>
      <article class="step-card"><b>04</b><h3>Delivery &amp; support</h3><p class="muted">Media within 24 hours, plus a property website and a real reply if something needs another pass.</p></article>
    </div>
  </div></section>`
}));

write("services.html", layout({
  title: "Services | Gator Gaze Media",
  description: "Listing photography, drone, video, 3D tours, twilight, staging, commercial, Airbnb, events, and agent branding.",
  page: "services",
  main: `${pageHero("Services", "What we do", "One Tampa Bay team for the listing, the rental, the building, the event, and the brand.")}
  <section class="section" style="padding-top:12px"><div class="wrap svc-grid">${services.map((s, i) => serviceCard(s, i, "")).join("")}</div></section>`
}));

services.forEach((s, i) => {
  write("services/" + s[0], layout({
    title: `${s[1]} | Gator Gaze Media`,
    description: s[2],
    root: "../",
    page: "services",
    main: `${pageHero(s[3], s[1], s[2])}
    <section class="section" style="padding-top:10px"><div class="wrap split">
      <div class="media-frame" style="min-height:420px"><img data-fallback src="${img(s[4], 1400)}" alt=""></div>
      <div class="prose">
        <p>${s[2]} ${s[3]}</p>
        <p>Shoots are scheduled seven days a week between 9:00 AM and 6:00 PM. The first 30 miles from South Tampa are free. After that, travel is $15 for every 10 miles, rounded down to the nearest 10, on the one-way distance.</p>
        <p>Photos are delivered within 24 hours. Video and most virtual services land in 48 to 72 hours. Have the property ready before we arrive — lights on, blinds open, fans off, driveway clear.</p>
        <p><a class="btn-pill solid" href="../book-now.html">Book Now</a> <a class="btn-pill" href="../pricing.html" style="margin-left:8px">See pricing</a></p>
      </div>
    </div></section>`
  }));
});

write("pricing.html", layout({
  title: "Photography & Video Pricing | Gator Gaze Media",
  description: "Transparent Tampa Bay real estate media pricing by square foot, plus à la carte services.",
  page: "pricing",
  scripts: '<script src="js/catalog.js"></script><script src="js/pricing.js"></script>',
  main: `<section class="prices-hero"><div class="inner">
    <h1>Prices</h1>
    <p>The first 30 miles are free. After that, it’s $15 for every 10 miles, rounded down to the nearest 10 miles.</p>
    <p>Transparent pricing for Tampa Bay and Central Florida. Choose a package or mix and match add-ons.</p>
    <p>Travel fees may apply based on your location. Travel fees are calculated from South Tampa using the one-way distance.</p>
    <p><strong>Example:</strong> Total distance 101 miles → first 30 miles free → remaining 71 miles → rounded down to 60 billable miles → $90 total travel fee.</p>
    <div class="travel-box">
      <label for="miles">Try a one-way distance from South Tampa</label>
      <div class="travel-row"><input id="miles" type="number" min="0" placeholder="101" aria-label="Miles"><button class="btn-pill" id="miles-go" type="button" style="border-color:#f6f3e6;color:#f6f3e6">Calculate</button></div>
      <p class="travel-result" id="travel-out"></p>
    </div>
  </div></section>
  <div id="pricing-app"></div>`
}));

write("projects.html", layout({
  title: "Projects | Gator Gaze Media",
  description: "Residential, commercial, Airbnb, and vacant-land projects across Tampa Bay and Central Florida.",
  page: "projects",
  main: `${pageHero("Portfolio", "Projects", "A sample of listing, rental, and commercial work. Neighborhood names only — no street addresses.")}
  <section class="section" style="padding-top:8px"><div class="wrap">
    <div class="filters" data-filter="#project-grid">
      <button type="button" data-cat="all" aria-pressed="true">All</button>
      <button type="button" data-cat="residential" aria-pressed="false">Residential</button>
      <button type="button" data-cat="commercial" aria-pressed="false">Commercial</button>
      <button type="button" data-cat="airbnb" aria-pressed="false">Airbnb / VRBO</button>
      <button type="button" data-cat="land" aria-pressed="false">Vacant Land</button>
    </div>
    <div class="project-grid" id="project-grid">${projects.map((p, i) => projectCard(p, i, "")).join("")}</div>
  </div></section>`
}));

projects.forEach((p, i) => {
  write(`projects/${p[0]}.html`, layout({
    title: `${p[1]} | Gator Gaze Media`,
    description: p[4],
    root: "../",
    page: "projects",
    main: `${pageHero(p[3], p[1], p[4])}
    <section class="section" style="padding-top:8px"><div class="wrap">
      <div class="media-frame" style="min-height:460px;margin-bottom:18px"><img data-fallback src="${img(i + 2, 1800)}" alt=""></div>
      <div class="split">
        <div class="prose"><p>${p[5]}. Media for this project was delivered as a single gallery: edited stills, and where the package called for them, drone frames, a floor plan, and a tour or film.</p>
        <p>This demo uses placeholder photography. It is not the client gallery.</p>
        <p><a class="btn-pill solid" href="../book-now.html">Book a similar shoot</a></p></div>
        <div class="svc-grid" style="grid-template-columns:1fr 1fr">
          <div class="media-frame" style="min-height:180px"><img data-fallback src="${img(i + 6, 800)}" alt=""></div>
          <div class="media-frame" style="min-height:180px"><img data-fallback src="${img(i + 9, 800)}" alt=""></div>
        </div>
      </div>
    </div></section>`
  }));
});

const galleryFigs = IDS.map((id, i) => {
  const cat = i % 5 === 0 ? "aerial" : i % 5 === 1 ? "exterior" : i % 5 === 2 ? "interior" : i % 5 === 3 ? "twilight" : "rental";
  return `<figure data-cat="${cat}"><img data-fallback src="${GG.photoUrl(id, 900)}" alt="Placeholder real-estate photograph"></figure>`;
}).join("");

write("gallery.html", layout({
  title: "Gallery | Gator Gaze Media",
  description: "Placeholder gallery of listing interiors, exteriors, aerials, and twilight.",
  page: "gallery",
  main: `${pageHero("Albums", "Gallery", "Tasteful stand-in photographs for this demo. They are not Gator Gaze client files.")}
  <section class="section" style="padding-top:8px"><div class="wrap">
    <div class="filters" data-filter="#gallery">
      <button type="button" data-cat="all" aria-pressed="true">All</button>
      <button type="button" data-cat="interior" aria-pressed="false">Interiors</button>
      <button type="button" data-cat="exterior" aria-pressed="false">Exteriors</button>
      <button type="button" data-cat="aerial" aria-pressed="false">Aerial</button>
      <button type="button" data-cat="twilight" aria-pressed="false">Twilight</button>
      <button type="button" data-cat="rental" aria-pressed="false">Rentals</button>
    </div>
    <div class="gallery-grid" id="gallery">${galleryFigs}</div>
  </div></section>`
}));

write("blog.html", layout({
  title: "Blog | Gator Gaze Media",
  description: "Notes on Tampa Bay listing media, pricing, Showcase, drone, and vacation-rental photography.",
  page: "blog",
  main: `${pageHero("Journal", "Tips, news, and articles", "Titles and dates follow the public blog. The article text in this demo is original placeholder copy, not the published posts.")}
  <section class="section" style="padding-top:8px"><div class="wrap">
    <div class="filters" data-filter="#posts">
      <button type="button" data-cat="all" aria-pressed="true">All</button>
      <button type="button" data-cat="articles" aria-pressed="false">Articles</button>
      <button type="button" data-cat="tips" aria-pressed="false">Tips</button>
    </div>
    <div class="post-grid" id="posts">${posts.map((p, i) => postCard(p, i, "")).join("")}</div>
  </div></section>`
}));

posts.forEach((p, i) => {
  const slug = postSlugs[i];
  write(`blog/${slug}.html`, layout({
    title: `${p[4]} | Gator Gaze Media`,
    description: `Demo article: ${p[4]}`,
    root: "../",
    page: "blog",
    main: `<article class="section"><div class="wrap prose">
      <p class="meta">${p[2]} · ${p[1]} · ${p[3]} read</p>
      <h1 style="font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,60px);line-height:1.05">${p[4]}</h1>
      <div class="media-frame" style="min-height:320px;margin:12px 0 18px"><img data-fallback src="${img(i + 4, 1600)}" alt=""></div>
      <p>This is original placeholder copy for the demo, written so the blog has working pages. It is not the article published on gatorgazemedia.com.</p>
      <p>${p[4].replace(/\?$/, "")} comes up constantly with Tampa Bay agents and hosts. The practical answer is usually a package matched to square footage, plus only the add-ons the listing will actually use: drone if the lot or the view earns it, a 3D tour if the floor plan is hard to understand from stills, twilight if the exterior is the hero.</p>
      <p>Photos are due within 24 hours. Video and most virtual work land in 48 to 72 hours. The first 30 miles from South Tampa are free, then travel is $15 per 10 miles rounded down. Current numbers live on the <a href="../pricing.html">pricing page</a>, and a shoot starts at <a href="../book-now.html">Book Now</a>.</p>
      <p><a class="more-link" href="../blog.html">Back to all posts</a></p>
    </div></article>`
  }));
});

// Fix postCard to use the same slugs
function postCardFixed() {}

write("reviews.html", layout({
  title: "Reviews | Gator Gaze Media",
  description: "What Tampa Bay agents, owners, and hosts say about Gator Gaze Media.",
  page: "reviews",
  main: `${pageHero("Clients’ words", "Reviews", "Published notes from agents, owners, and hosts. This demo reprints the public review page.")}
  <section class="section" style="padding-top:8px"><div class="wrap review-grid">
    ${reviews.map(([name, role, source, quote]) => `<article class="review-card"><div class="stars sm" aria-label="5 stars">★★★★★</div><p>${quote}</p><p class="who">${name}</p><p class="role">${role} · ${source}</p></article>`).join("")}
  </div></section>`
}));

write("faq.html", layout({
  title: "FAQ | Gator Gaze Media",
  description: "Booking, turnaround, travel fees, prep, and pricing questions.",
  page: "faq",
  main: `${pageHero("FAQ", "Your questions, our answers", "Straight answers on services, timing, travel, and how a shoot actually runs.")}
  <section class="section" style="padding-top:8px"><div class="wrap faq">${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`
}));

write("contact.html", layout({
  title: "Contact Gator Gaze Media",
  description: "Request a quote from the Tampa Bay real estate media team.",
  page: "contact",
  main: `<div class="marquee" aria-hidden="true"><div class="marquee-track">– Let’s Talk – Work with us&nbsp;&nbsp;– Let’s Talk – Work with us&nbsp;&nbsp;</div></div>
  <section class="section"><div class="wrap contact-layout">
    <div>
      <p>Tell us about your project and we’ll send you a free quote. Prefer to talk? Give us a call.</p>
      <p><strong>info@gatorgazemedia.com</strong><br>+1 813 415 6349<br>Tampa Bay, Florida</p>
      <p class="muted">Sunday–Saturday · 9:00 AM–6:00 PM</p>
      <h2 class="serif" style="font-size:36px">Service Area</h2>
      <p>Proudly serving Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, Osceola, Lake &amp; Orange County.</p>
      <p class="city-list">City coverage includes: Tampa · South Tampa · Brandon · Valrico · Lutz · Odessa · Wesley Chapel · Zephyrhills · St. Petersburg · St. Pete Beach · Treasure Island · Madeira Beach · Indian Rocks Beach · Indian Shores · Clearwater · Clearwater Beach · Bradenton · Anna Maria Island · Holmes Beach · Bradenton Beach · Longboat Key · Sarasota · Siesta Key · Spring Hill · Lakeland · Orlando · Kissimmee · Winter Garden</p>
    </div>
    <form data-demo>
      <label class="field"><span>Name</span><input name="name" placeholder="Your Name" required></label>
      <label class="field"><span>Email</span><input name="email" type="email" placeholder="name@youremail.com" required></label>
      <label class="field"><span>Phone</span><input name="phone" type="tel" placeholder="(123) 456 78 90"></label>
      <label class="field"><span>Message</span><textarea name="message" placeholder="Tell us about your project and what you need." required></textarea></label>
      <label class="check"><input type="checkbox" data-required-check> I’ve read and agree to the <a href="legal/privacy.html">Privacy Policy</a></label>
      <button class="btn-pill solid" type="submit">Submit</button>
    </form>
  </div></section>`
}));

const books = [
  ["Residential", "MLS photos, video, drone, and 3D tours for home listings.", "residential", img(6)],
  ["Airbnb & VRBO", "Photos and video built for short-term rental listings.", "airbnb", img(10)],
  ["Commercial Spaces", "Photos and video for offices, retail, and commercial properties.", "commercial", img(25)],
  ["Business Content", "Social videos, interviews, and brand content for your business.", "business", img(24)],
  ["Agent Branding", "Reel packages and headshots for real estate agents.", "agent", img(20)],
  ["Events", "Photo and video coverage for parties, mixers, and corporate events.", "events", img(22)]
];

write("book-now.html", layout({
  title: "Book Your Shoot | Gator Gaze Media",
  description: "Choose a service and start a demo order.",
  page: "book",
  main: `${pageHero("Book", "Book your shoot", "Choose a service to get started. The order form is a demo and does not place a real order.")}
  <section class="section" style="padding-top:10px"><div class="wrap book-grid">
    ${books.map(([title, copy, intent]) => `<article class="book-card"><h2>${title}</h2><p>${copy}</p><a class="btn-pill" href="order/index.html?intent=${intent}&active_step=1">Book Now</a></article>`).join("")}
  </div></section>`
}));

write("home-prep.html", layout({
  title: "Home Prep Checklist | Gator Gaze Media",
  description: "How to prepare a Tampa Bay home before the photographer arrives.",
  page: "prep",
  main: `${pageHero("Before we arrive", "Photography pre-shoot checklist", "A quick checklist based on years of photographing homes across Tampa Bay. Please finish it before the photographer arrives.")}
  <section class="section" style="padding-top:8px"><div class="wrap prose">
    <p>Your appointment is reserved for a set block of time, and delays can affect the appointments that follow. When we arrive, the property must be completely ready: all lights on, all blinds and curtains open, and all ceiling fans off. No one should be inside the home when the shoot starts, including pets, unless absolutely necessary, and no cars may be parked in the driveway. There is no fee to reschedule or cancel, but please let us know at least 24 hours before your appointment.</p>
    <p>Questions? Call or text (813) 415-6349 or email info@gatorgazemedia.com.</p>
    <h2>General</h2>
    <ul class="checklist"><li>Declutter each room so it reads as spacious</li><li>Turn on all lights and replace burnt-out bulbs</li><li>Open curtains and blinds</li><li>Clean floors, countertops, windows, and mirrors</li><li>Hide cords, trash bins, pet items, and personal belongings</li><li>Remove family photos and bold décor for a neutral look</li><li>Set the thermostat to a comfortable temperature</li></ul>
    <h2>Living room</h2>
    <ul class="checklist"><li>Fluff pillows and straighten cushions</li><li>Clear coffee tables and bookshelves</li><li>Hide remotes, toys, and extra accessories</li><li>A small plant or throw blanket is enough styling</li></ul>
    <h2>Bedrooms</h2>
    <ul class="checklist"><li>Make the beds and smooth the duvet</li><li>Clear nightstands down to a lamp and one small object</li><li>Close closet doors and hide laundry</li><li>Open blinds and turn lamps on</li></ul>
    <h2>Kitchen</h2>
    <ul class="checklist"><li>Clear countertops of appliances and clutter</li><li>Wipe stainless steel and reflective surfaces</li><li>Remove dish racks, soap, sponges, and towels</li><li>Hide trash cans and pet bowls</li></ul>
    <h2>Bathrooms</h2>
    <ul class="checklist"><li>Close toilet lids</li><li>Remove toothbrushes, razors, and toiletries</li><li>Hang clean, neutral towels</li><li>Wipe mirrors and counters</li></ul>
    <h2>Outdoor and curb appeal</h2>
    <ul class="checklist"><li>Mow, trim, and pick up yard debris</li><li>Sweep porches, patios, and the entry</li><li>Move vehicles out of the driveway</li><li>Hide hoses, tools, and bins</li></ul>
    <p><button class="btn-pill" type="button" onclick="window.print()">Print this checklist</button></p>
    <p class="muted">The live site also offers a downloadable PDF. This demo keeps the checklist on the page.</p>
  </div></section>`
}));

write("login.html", layout({
  title: "Login | Gator Gaze Media",
  description: "Demo stand-in for the customer login.",
  page: "login",
  main: `${pageHero("Account", "Login", "The live site signs customers in through the ordering portal. This demo does not.")}
  <form class="login-card" data-demo>
    <label class="field"><span>Email</span><input type="email" placeholder="name@youremail.com" autocomplete="off"></label>
    <label class="field"><span>Password</span><input type="password" autocomplete="off"></label>
    <button class="btn-pill solid" type="submit">Sign in</button>
    <p class="muted" style="margin-top:12px">Submitting shows a demo notice. No credentials are sent.</p>
  </form>`
}));

write("legal/privacy.html", layout({
  title: "Privacy Policy | Gator Gaze Media Demo",
  description: "Demo privacy note. Not the real Gator Gaze Media policy.",
  root: "../",
  page: "legal",
  main: `<section class="section"><div class="wrap prose"><p class="eyebrow">Legal</p><h1>Privacy Policy</h1>
  <p>This is a demo mockup, not the privacy policy of Gator Gaze Media. Do not submit real personal information.</p>
  <p>The order form and the contact forms store what you type in this browser only, using session storage for the order draft. Nothing is posted to a server. Closing the tab or choosing “Start a new demo order” clears the draft. Map tiles may be requested from OpenStreetMap when the order form loads; the address you type is not sent with those requests.</p>
  <p>The real studio’s policy lives on gatorgazemedia.com. This page exists so footer links in the mock have somewhere to go.</p></div></section>`
}));

write("legal/terms.html", layout({
  title: "Terms and Conditions | Gator Gaze Media Demo",
  description: "Demo terms. Not the real Gator Gaze Media terms.",
  root: "../",
  page: "legal",
  main: `<section class="section"><div class="wrap prose"><p class="eyebrow">Legal</p><h1>Terms and Conditions</h1>
  <p>This website is an unaffiliated demo. It does not sell photography, accept payment, or form a contract. Prices are shown so the mock can be compared with the public pricing page. They are not an offer.</p>
  <p>Placeholder photographs are stock images used as stand-ins. Client project names are neighborhood-level labels drawn from the public portfolio list, without street addresses.</p>
  <p>Demo mockup — not affiliated with Gator Gaze Media.</p></div></section>`
}));

write("service-areas/index.html", layout({
  title: "Service Areas | Gator Gaze Media",
  description: "Tampa Bay and Central Florida cities covered by this demo.",
  root: "../",
  page: "areas",
  main: `${pageHero("Where we shoot", "Service areas", "Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, Osceola, Lake, and Orange County.")}
  <section class="section" style="padding-top:8px"><div class="wrap">
    <div class="two">
      <div><h2 class="serif">Real estate photographer</h2><ul>${cities.map(([slug, name]) => `<li><a href="real-estate-photographer-${slug}.html">${name}, FL</a></li>`).join("")}</ul></div>
      <div><h2 class="serif">Airbnb photographer</h2><ul>${cities.map(([slug, name]) => `<li><a href="airbnb-photographer-${slug}.html">${name}, FL</a></li>`).join("")}</ul></div>
    </div>
  </div></section>`
}));

cities.forEach(([slug, name], i) => {
  ["real-estate-photographer", "airbnb-photographer"].forEach((prefix) => {
    const airbnb = prefix.startsWith("airbnb");
    const title = airbnb ? `Airbnb Photographer in ${name}, FL` : `Real Estate Photographer in ${name}, FL`;
    write(`service-areas/${prefix}-${slug}.html`, layout({
      title: `${title} | Gator Gaze Media`,
      description: `${title}. Listing media from a Tampa Bay team. Demo page.`,
      root: "../",
      page: "areas",
      main: `${pageHero(name + ", FL", title, airbnb
        ? `Short-term rental photos, drone, and 3D tours for hosts in ${name}. Packages start at $250 and include an extended rental license.`
        : `Listing photos, drone, video, floor plans, and 3D tours for ${name} agents and homeowners. Residential packages start at $190.`)}
      <section class="section" style="padding-top:8px"><div class="wrap split">
        <div class="prose">
          <p>Gator Gaze Media is based in Tampa Bay and schedules ${name} alongside the rest of the Gulf coast and Central Florida. The first 30 miles from South Tampa are free. Farther drives are $15 per 10 miles, rounded down, one way.</p>
          <p>Turnaround on stills is 24 hours. Have the property ready: lights on, blinds open, fans off, cars out of the driveway.</p>
          <p><a class="btn-pill solid" href="../book-now.html">${airbnb ? "Book an Airbnb shoot" : "Book a listing shoot"}</a></p>
          <p><a class="more-link" href="${airbnb ? "real-estate-photographer-" + slug + ".html" : "airbnb-photographer-" + slug + ".html"}">${airbnb ? "Listing photography in " + name : "Airbnb photography in " + name}</a></p>
        </div>
        <div class="media-frame" style="min-height:320px"><img data-fallback src="${img(i, 1200)}" alt=""></div>
      </div></section>`
    }));
  });
});

write("404.html", layout({
  title: "Page not found | Gator Gaze Media",
  description: "That demo page is not here.",
  page: "home",
  main: `${pageHero("404", "That page is not in the demo.", "Try the home page, pricing, or the order form.")}<section class="section" style="padding-top:0"><div class="wrap"><a class="btn-pill" href="index.html">Back home</a></div></section>`
}));

console.log("wrote pages", posts.length, "posts", cities.length * 2, "area pages", projects.length, "projects");
