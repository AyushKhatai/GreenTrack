// Comprehensive Plant Pathology & Health Condition Database
export const DISEASE_DATABASE = [
  {
    id: "healthy-vigor",
    name: "Healthy Plant (Optimal Vigor)",
    category: "Healthy",
    severity: "None",
    severityLevel: 0,
    healthScoreRange: [90, 100],
    colorCode: "#10b981",
    symptoms: [
      "Vibrant green leaf pigmentation with uniform turgidity",
      "No active fungal sporulation, necrosis, or chlorosis spots",
      "Sturdy petioles and healthy active vegetative growth points",
      "Clean leaf margin without crispy brown necrosis"
    ],
    causes: "Balanced hydration, proper light spectrum, healthy root oxygenation, and adequate mineral nutrition.",
    immediateActions: [
      "No corrective intervention required! Maintain existing care regimen.",
      "Dust or wipe foliage monthly with clean water to preserve high photosynthetic rate."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Inspect underside of leaves for early insect hitchhikers.", status: "Routine Check" },
      { day: "Day 3", action: "Check topsoil moisture level before scheduled watering.", status: "Hydration" },
      { day: "Day 7", action: "Rotate pot 45 degrees towards natural light source for symmetrical branching.", status: "Lighting" }
    ],
    organicRemedy: "Apply a diluted seaweed tonic or balanced compost tea once every 4 weeks during active growth season.",
    chemicalRemedy: "None required.",
    prevention: "Keep consistent watering routines, provide adequate air circulation, and sanitize pruning shears between plants."
  },
  {
    id: "chlorosis-nutrient-deficiency",
    name: "Leaf Chlorosis (Iron / Nitrogen Deficiency)",
    category: "Nutritional / Soil pH",
    severity: "Moderate",
    severityLevel: 2,
    healthScoreRange: [55, 75],
    colorCode: "#eab308",
    symptoms: [
      "Interveinal yellowing (veins remain green while leaf blades turn pale/yellow)",
      "General pale chartreuse discoloration across new or older foliage",
      "Slowed new shoot elongation and reduced leaf size"
    ],
    causes: "Alkaline soil pH (>7.5) locking out micronutrients, iron (Fe) or nitrogen (N) deficiency, or root compaction preventing nutrient uptake.",
    immediateActions: [
      "Test soil pH with a test strip or digital probe.",
      "Flush soil if fertilizer salts have accumulated, or apply chelated iron foliar spray.",
      "Ensure drainage holes are not blocked."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Apply foliar chelated iron (Fe-EDDHA) or mild liquid nitrogen fertilizer.", status: "Urgent Feeding" },
      { day: "Day 3", action: "Measure soil pH and amend with organic compost or sulfur if pH is above 7.2.", status: "pH Balance" },
      { day: "Day 7", action: "Inspect new growth tips for greener pigmentation returning.", status: "Evaluation" }
    ],
    organicRemedy: "Top-dress with well-rotted vermicompost, Epsom salt (1 tsp per gallon water for magnesium), and coffee grounds.",
    chemicalRemedy: "Chelated Iron spray (Fe-EDTA for acidic soil, Fe-EDDHA for alkaline soil) and balanced 20-20-20 micro-fertilizer.",
    prevention: "Avoid over-liming soil and use balanced organic fertilizers containing secondary micronutrients."
  },
  {
    id: "bacterial-leaf-spot",
    name: "Bacterial & Fungal Leaf Spot (Cercospora / Septoria)",
    category: "Fungal / Bacterial",
    severity: "High",
    severityLevel: 3,
    healthScoreRange: [35, 60],
    colorCode: "#f97316",
    symptoms: [
      "Circular or irregular dark brown to black necrotic spots with yellow chlorotic halos",
      "Spots may merge causing premature leaf blight and defoliation",
      "Water-soaked lesions on the underside of foliage during humid conditions"
    ],
    causes: "Fungal/bacterial pathogens thriving in prolonged wet foliage, high humidity, overhead watering, and poor air movement.",
    immediateActions: [
      "Sterilize shears and snip off heavily infected leaves immediately (dispose in trash, DO NOT compost).",
      "Cease all overhead misting or leaf wetting; water strictly at soil level.",
      "Increase room air circulation with a gentle oscillating fan."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Prune and isolate all diseased foliage. Disinfect shears with 70% alcohol.", status: "Sanitation" },
      { day: "Day 2", action: "Apply organic copper fungicide spray or neem oil solution covering both sides of remaining leaves.", status: "Treatment" },
      { day: "Day 5", action: "Check for new spots forming; repeat bio-fungicide if active lesions expand.", status: "Re-application" },
      { day: "Day 7", action: "Assess stability. Ensure topsoil is dry between watering sessions.", status: "Recovery" }
    ],
    organicRemedy: "Organic Copper Octanoate Fungicide spray or cold-pressed Neem Oil emulsion (5ml per liter with mild Castile soap).",
    chemicalRemedy: "Chlorothalonil or Mancozeb broad-spectrum fungicide spray.",
    prevention: "Always water at the base of the stem early in the morning so foliage stays dry. Space plants for maximum air passage."
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew (Erysiphales)",
    category: "Fungal",
    severity: "Moderate",
    severityLevel: 2,
    healthScoreRange: [50, 70],
    colorCode: "#a855f7",
    symptoms: [
      "White or grey powdery fungal dust patches coating upper leaf surfaces and buds",
      "Leaves may curl upwards, distort, dry out, and turn yellow-brown",
      "In severe cases, entire stems and flower buds become covered in white mycelium"
    ],
    causes: "Airborne fungal spores thriving in warm, dry microclimates with high relative humidity and stagnant shade.",
    immediateActions: [
      "Wipe off mild surface mildew with a damp milk/water solution.",
      "Prune congested center branches to allow direct light and airflow.",
      "Move plant to an area with improved sunlight exposure."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Prune dense overlapping leaves and apply Potassium Bicarbonate spray.", status: "Foliar Spray" },
      { day: "Day 3", action: "Ensure plant receives at least 4-6 hours of good bright light.", status: "Light Exposure" },
      { day: "Day 6", action: "Repeat bio-fungicide spray to eliminate emerging micro-spores.", status: "Follow-up" }
    ],
    organicRemedy: "Potassium Bicarbonate spray (1 tbsp + 1 tsp horticultural oil per gallon) or diluted milk spray (40% milk, 60% water in direct sun).",
    chemicalRemedy: "Myclobutanil or Sulfur-based systemic fungicide.",
    prevention: "Provide adequate plant spacing, avoid high-nitrogen fertilizers that create excessively soft tender foliage, and maximize morning sun."
  },
  {
    id: "root-rot-overwatering",
    name: "Root Rot & Edema (Overwatering / Hypoxia)",
    category: "Root System",
    severity: "Critical",
    severityLevel: 4,
    healthScoreRange: [20, 45],
    colorCode: "#ef4444",
    symptoms: [
      "Leaves turning yellow, soft, translucent, and dropping rapidly",
      "Soil remains soggy/wet for over 10 days with a sour musty odor",
      "Stems feel squishy or black near soil line; roots are dark brown and mushy instead of firm and white"
    ],
    causes: "Anaerobic conditions in waterlogged soil starving root cells of oxygen, leading to opportunistic Pythium/Phytophthora root decay.",
    immediateActions: [
      "STOP watering immediately. Remove pot saucer containing stagnant runoff water.",
      "Gently slide plant out of pot to inspect root ball; snip away all black/mushy rotting roots with sterilized scissors.",
      "Repot in fresh, dry, highly porous chunky mix with perlite or pumice."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Emergency root surgery: prune rotting roots and soak remaining healthy roots in diluted 3% hydrogen peroxide (1 part H2O2 to 4 parts water).", status: "Emergency Repot" },
      { day: "Day 2", action: "Repot in clean container with fresh chunky potting medium. Do NOT water for 48 hours.", status: "Drying Period" },
      { day: "Day 4", action: "Lightly bottom-water once soil has settled; place in warm, bright indirect light.", status: "Hydration Check" },
      { day: "Day 7", action: "Check stem firmness. If no further leaf drop occurs, plant has stabilized.", status: "Recovery" }
    ],
    organicRemedy: "3% Hydrogen Peroxide root dip + Cinnamon powder (natural anti-fungal agent) dusted on cut root ends.",
    chemicalRemedy: "Phosphorous acid (Fosetyl-Al) systemic root fungicide drench.",
    prevention: "Always use pots with functional drainage holes and aerated soil mixes. Never water on a strict calendar — feel top 2 inches of soil first."
  },
  {
    id: "dehydration-drought-stress",
    name: "Severe Dehydration / Drought Stress",
    category: "Hydration",
    severity: "Moderate to High",
    severityLevel: 2,
    healthScoreRange: [40, 65],
    colorCode: "#d97706",
    symptoms: [
      "Limp, severely drooping stems and curled crispy leaf margins",
      "Soil has pulled away from pot edges, completely dry and hydrophobic",
      "Lower leaves drying to a crisp brown paper texture and dropping"
    ],
    causes: "Prolonged lack of moisture, high ambient temperatures, low humidity, or root-bound pot where water runs straight through without absorbing.",
    immediateActions: [
      "Bottom-water (submerge pot in a tub of tepid water for 30-45 minutes until topsoil is re-hydrated).",
      "Move away from direct heat registers, radiators, or scorching afternoon window glass.",
      "Mist surrounding air or turn on a room humidifier."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Submerge pot in water tub for 40 mins to re-saturate hydrophobic peat soil.", status: "Deep Soak" },
      { day: "Day 2", action: "Observe leaf turgidity returning over 12-24 hours.", status: "Turgidity Check" },
      { day: "Day 4", action: "Snip away fully dead, crispy brown leaves to conserve plant energy.", status: "Pruning" },
      { day: "Day 7", action: "Establish regular watering schedule before soil completely shrinks.", status: "Routine" }
    ],
    organicRemedy: "Soak soil with water infused with a drop of organic liquid seaweed extract to relieve abiotic drought shock.",
    chemicalRemedy: "None needed. Pure clean water.",
    prevention: "Set up a moisture meter or finger test weekly. Apply organic bark mulch to soil surface to reduce evaporation."
  },
  {
    id: "spider-mites-pest-infestation",
    name: "Pest Infestation (Spider Mites / Aphids / Mealybugs)",
    category: "Entomological Pest",
    severity: "High",
    severityLevel: 3,
    healthScoreRange: [30, 55],
    colorCode: "#dc2626",
    symptoms: [
      "Fine silky webbing across leaf joints and undersides (spider mites)",
      "Stippled yellow pinpoint speckling on leaf surfaces from sap sucking",
      "Cottony white fuzzy clusters in stem axils (mealybugs) or sticky honeydew coating (aphids)"
    ],
    causes: "Hot, dry indoor air allowing rapid reproduction of pest colonies, or introducing un-quarantined new plants.",
    immediateActions: [
      "Immediately quarantine plant away from all other houseplants to prevent spread!",
      "Blast foliage in the shower or with a hose to physically knock off 80% of the pest population.",
      "Wipe remaining clusters with a cotton swab dipped in 70% Isopropyl alcohol."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Isolate plant, shower thoroughly, and apply Insecticidal Soap spray.", status: "Quarantine & Spray" },
      { day: "Day 3", action: "Spot-treat stubborn clusters with alcohol swab. Wipe leaf undersides.", status: "Spot Treatment" },
      { day: "Day 5", action: "Apply Neem Oil / Horticultural oil spray to kill freshly hatched eggs.", status: "Egg Eradication" },
      { day: "Day 7", action: "Inspect with magnifying glass; maintain quarantine for 7 more days.", status: "Inspection" }
    ],
    organicRemedy: "Cold-pressed Neem Oil (1 tsp + 1/2 tsp dish soap per liter) or pure Horticultural Rosemary/Thyme oil spray.",
    chemicalRemedy: "Pyrethrin spray, Spinosad bio-insecticide, or Imidacloprid systemic granules (for non-flowering houseplants).",
    prevention: "Maintain humidity above 55% (spider mites hate humidity). Inspect new plants for 14 days before introducing to plant collection."
  },
  {
    id: "sun-scorch-sunburn",
    name: "Foliage Scorch / Phototoxicity (Sunburn)",
    category: "Environmental",
    severity: "Moderate",
    severityLevel: 2,
    healthScoreRange: [60, 80],
    colorCode: "#ea580c",
    symptoms: [
      "Bleached white, silver, or dry crispy brown patches on leaves facing direct sun",
      "Only top and outward-facing foliage affected; bottom sheltered leaves remain deep green",
      "Leaf tissue feels thin and brittle in scorched areas"
    ],
    causes: "Sudden transition from low light to intense direct midday sun without acclimation, or magnifying water droplets under scorching light.",
    immediateActions: [
      "Move plant back 3-5 feet from intense sun window or draw sheer curtains.",
      "Do not fertilize while foliage is recovering from heat stress.",
      "Ensure adequate soil hydration."
    ],
    sevenDayPlan: [
      { day: "Day 1", action: "Relocate to gentle morning sun or bright indirect light.", status: "Relocation" },
      { day: "Day 3", action: "Keep soil evenly moist to help remaining foliage cool through transpiration.", status: "Hydration" },
      { day: "Day 7", action: "Prune severely scorched leaves once new healthy growth emerges.", status: "Pruning" }
    ],
    organicRemedy: "Provide temporary 50% shade cloth for outdoor saplings and foliar kelp spray to reduce heat shock.",
    chemicalRemedy: "None needed.",
    prevention: "Acclimate indoor plants outdoors gradually over 10-14 days ('hardening off'). Avoid spraying leaves in intense midday sunshine."
  }
];

export function getDiseaseById(id) {
  return DISEASE_DATABASE.find(d => d.id === id) || null;
}
