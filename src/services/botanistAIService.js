// Interactive Botanical AI Assistant Service ("Dr. Flora")
import { PLANT_DATABASE } from '../data/plantDatabase';
import { DISEASE_DATABASE } from '../data/diseaseDatabase';

const BOTANIST_KNOWLEDGE_PROMPTS = [
  {
    keywords: ["yellow", "yellowing", "pale", "chlorosis"],
    response: (plantName) => `Yellowing foliage (chlorosis) in **${plantName || "your plant"}** is most commonly caused by either overwatering (which starves roots of oxygen) or an iron/nitrogen deficiency due to improper soil pH. 

🔍 **Immediate Diagnostic Checklist**:
1. **Soil Moisture Check**: Stick your finger 2 inches into the soil. If it feels soggy, hold off watering until topsoil is dry.
2. **Nutrient Feeding**: Apply a diluted liquid chelated iron tonic (Fe-EDTA) or organic compost tea.
3. **Drainage**: Ensure the pot has free-flowing drainage holes so roots don't sit in stagnant water.`
  },
  {
    keywords: ["brown tips", "crispy", "dry", "burnt"],
    response: (plantName) => `Crispy brown edges or leaf tips on **${plantName || "plants"}** typically point to low ambient humidity, tap water minerals (fluoride/chlorine), or underwatering.

💧 **Action Plan**:
- Switch to filtered, distilled, or rainwater for a few weeks to prevent mineral salt burn.
- Increase humidity around the foliage with a pebble tray or room humidifier.
- Trim off completely dead crispy edges with clean sterilized shears.`
  },
  {
    keywords: ["water", "watering", "how often", "schedule"],
    response: (plantName) => {
      const match = PLANT_DATABASE.find(p => plantName && p.name.toLowerCase().includes(plantName.toLowerCase()));
      if (match) {
        return `For **${match.name}**, the recommended watering protocol is: **${match.watering}**.

🌱 **Key Growth Requirements**:
- **Sunlight**: ${match.sunlight}
- **Soil**: ${match.soil}
- **Best Practice**: Water thoroughly until water drains from the bottom, then discard excess tray water.`
      }
      return `Watering frequency depends on light, season, and pot material. As a golden rule:
- **Tropical foliage (Monstera, Pothos, Peace Lily)**: Water when top 2 inches dry out.
- **Succulents & Trees (Snake Plant, Neem, Ficus)**: Allow soil to dry almost completely between deep waterings.
- Always check soil moisture with a finger test rather than relying solely on a fixed calendar!`
    }
  },
  {
    keywords: ["bug", "pest", "spider mite", "aphid", "web", "sticky", "white fuzz"],
    response: (plantName) => `Insects like spider mites, aphids, and mealybugs can rapidly stress **${plantName || "plants"}**.

🚨 **Eradication Protocol**:
1. **Quarantine**: Isolate the affected plant to protect your other greenery.
2. **Shower**: Blast the leaves with a spray hose or shower head to dislodge the majority of bugs.
3. **Organic Spray**: Mix 1 tsp cold-pressed Neem Oil + 1/2 tsp mild dish soap in 1 liter of warm water. Spray top and undersides of leaves every 5 days for 3 cycles.`
  },
  {
    keywords: ["repot", "repotting", "root bound", "pot size"],
    response: (plantName) => `Repotting is best performed during active growth (Spring/Early Summer).

🪴 **Signs your plant needs repotting**:
- Roots are spiraling out of the drainage holes or pushing the plant upwards.
- Water runs straight through without absorbing (hydrophobic root ball).
- Choose a new pot that is **1 to 2 inches larger in diameter** — never jump to a massive container, which can hold too much stagnant moisture.`
  },
  {
    keywords: ["co2", "carbon", "oxygen", "clean air", "nasa"],
    response: (plantName) => `Plants and trees are nature's ultimate carbon sinks! 
- Fast-growing canopy trees like **Neem (25.5 kg/yr)** and **Banyan (48 kg/yr)** absorb massive amounts of carbon while cooling urban microclimates by up to 4°C.
- Indoor species like **Snake Plant** and **Peace Lily** are NASA-certified air purifiers that absorb airborne toxins (benzene, formaldehyde) and release oxygen continuously.`
  }
];

export async function askBotanistAI(userMessage, currentPlantContext = null) {
  // Simulate natural AI thinking delay
  await new Promise(res => setTimeout(res, 600));

  const lower = userMessage.toLowerCase();
  const plantName = currentPlantContext?.name || "";

  for (const item of BOTANIST_KNOWLEDGE_PROMPTS) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.response(plantName);
    }
  }

  // Check if user is asking about a specific plant in our database
  const matchedPlant = PLANT_DATABASE.find(p => 
    lower.includes(p.name.toLowerCase()) || 
    lower.includes(p.scientificName.toLowerCase())
  );

  if (matchedPlant) {
    return `### 🌿 ${matchedPlant.name} (*${matchedPlant.scientificName}*)
**Category**: ${matchedPlant.category} | **Difficulty**: ${matchedPlant.difficulty}

- ☀️ **Sunlight**: ${matchedPlant.sunlight}
- 💧 **Watering**: ${matchedPlant.watering}
- 🪴 **Soil**: ${matchedPlant.soil}
- 🐾 **Pet Safety**: ${matchedPlant.petToxicity}
- 🌍 **Carbon Offset**: ${matchedPlant.co2Absorption} kg CO₂/year

**Expert Tip**: ${matchedPlant.careTips[0]}`;
  }

  // Default intelligent botanical response
  return `Hello! I am **Dr. Flora**, your AI Botanist and Tree Doctor. 

I can assist you with:
- 🔬 **Diagnosing symptoms** (yellow leaves, brown tips, leaf spots, pests)
- 💧 **Custom watering & fertilizer schedules**
- 🌳 **Tree plantation & carbon sequestration metrics**
- 🪴 **Indoor plant selection, lighting, and repotting guides**

Feel free to upload a leaf photo to the **AI Doctor Scanner** or ask me any specific question about your plants!`;
}
