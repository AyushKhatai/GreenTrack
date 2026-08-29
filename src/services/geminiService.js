// Google Gemini Multimodal AI Service for Plant Identification & Botanical Chat
import { generateSyntheticDiagnosis } from './plantVisionService';
import { PLANT_DATABASE } from '../data/plantDatabase';
import { DISEASE_DATABASE } from '../data/diseaseDatabase';

const GEMINI_STORAGE_KEY = 'greentrack_gemini_api_key';

/**
 * Gets the active Gemini API Key from LocalStorage or environment variable
 */
export function getGeminiApiKey() {
  const localKey = localStorage.getItem(GEMINI_STORAGE_KEY);
  if (localKey && localKey.trim()) return localKey.trim();
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

/**
 * Saves or clears user Gemini API key in LocalStorage
 */
export function setGeminiApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  }
}

/**
 * Checks if a Gemini API key is configured
 */
export function hasGeminiApiKey() {
  return Boolean(getGeminiApiKey());
}

/**
 * Analyzes plant image with Gemini Vision API (gemini-1.5-flash / gemini-2.0-flash)
 */
export async function analyzePlantWithGemini(imageSource) {
  const apiKey = getGeminiApiKey();

  // If no API key configured, use our internal vision analyzer fallback
  if (!apiKey) {
    console.log("No Gemini API key provided. Using built-in botanical analyzer.");
    return null;
  }

  try {
    let base64Data = '';
    let mimeType = 'image/jpeg';

    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
      const parts = imageSource.split(',');
      mimeType = parts[0].match(/:(.*?);/)[1] || 'image/jpeg';
      base64Data = parts[1];
    } else {
      base64Data = await convertBlobToBase64(imageSource);
    }

    const prompt = `You are Dr. Flora, a world-class AI botanist, urban forester, and plant pathologist.
Analyze this plant photo carefully. Respond ONLY with valid, raw JSON (no markdown formatting, no \`\`\`json wrappers) following this exact schema:
{
  "speciesName": "Common Name of the plant or tree",
  "scientificName": "Scientific Name in Latin",
  "family": "Botanical Family",
  "category": "Urban & Shade Tree | Indoor Foliage | Medicinal | Fruit & Flowering",
  "confidence": 95.5,
  "healthScore": 88,
  "conditionName": "Healthy Vigor | Bacterial Leaf Spot | Leaf Chlorosis | Powdery Mildew | Severe Dehydration | Pest Infestation | Root Rot | Sun Scorch",
  "severity": "None | Moderate | High | Critical",
  "symptoms": ["Detailed symptom 1", "Detailed symptom 2"],
  "primaryCause": "Detailed scientific cause of this condition",
  "immediateAction": "Immediate steps the planter should take today",
  "sevenDayPlan": [
    { "day": "Day 1", "action": "Step 1", "status": "Sanitation / Urgent" },
    { "day": "Day 3", "action": "Step 2", "status": "Hydration / Care" },
    { "day": "Day 7", "action": "Step 3", "status": "Evaluation" }
  ],
  "organicRemedy": "Eco-friendly, organic cure using neem, compost, baking soda, etc.",
  "chemicalRemedy": "Targeted chemical or mineral fallback if severe",
  "preventionTips": "How to prevent this in the future",
  "annualCo2Kg": 25.0,
  "careGuide": {
    "sunlight": "Full Sun / Bright Indirect",
    "watering": "How often to water",
    "soil": "Ideal soil type and pH",
    "petToxicity": "Safe or toxic to dogs/cats"
  }
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Gemini API returned error:", res.status, errText);
      return null;
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    // Clean JSON if needed
    const cleanedText = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Map to app structure
    const speciesObj = {
      id: parsed.speciesName.toLowerCase().replace(/\s+/g, '-'),
      name: parsed.speciesName,
      scientificName: parsed.scientificName || "Flora",
      family: parsed.family || "Botanical",
      category: parsed.category || "Urban Plant",
      difficulty: "Moderate",
      sunlight: parsed.careGuide?.sunlight || "Bright Indirect Light",
      watering: parsed.careGuide?.watering || "Moderate",
      soil: parsed.careGuide?.soil || "Well-draining rich soil",
      co2Absorption: parsed.annualCo2Kg || 22.0,
      petToxicity: parsed.careGuide?.petToxicity || "Check pet safety",
      careTips: [parsed.immediateAction, parsed.preventionTips].filter(Boolean),
      description: `Identified with Gemini AI: ${parsed.speciesName} (${parsed.scientificName}).`,
      badge: "AI Identified"
    };

    const diseaseObj = {
      id: parsed.conditionName.toLowerCase().replace(/\s+/g, '-'),
      name: parsed.conditionName,
      category: parsed.severity === 'None' ? 'Healthy' : 'Pathology',
      severity: parsed.severity || "None",
      symptoms: parsed.symptoms || [],
      causes: parsed.primaryCause || "Environmental condition",
      immediateActions: [parsed.immediateAction],
      sevenDayPlan: parsed.sevenDayPlan || [
        { day: "Day 1", action: parsed.immediateAction, status: "Immediate Care" },
        { day: "Day 3", action: "Check moisture and sunlight exposure.", status: "Care Check" },
        { day: "Day 7", action: "Evaluate foliage recovery.", status: "Review" }
      ],
      organicRemedy: parsed.organicRemedy || "Use diluted neem oil or vermicompost tea.",
      chemicalRemedy: parsed.chemicalRemedy || "None needed unless critical.",
      prevention: parsed.preventionTips || "Maintain clean watering and good airflow."
    };

    return {
      species: speciesObj,
      disease: diseaseObj,
      healthScore: parsed.healthScore || 90,
      confidence: parsed.confidence || 95.0,
      ratios: {
        healthyGreen: parsed.healthScore >= 80 ? 88.0 : 55.0,
        chlorosisYellow: parsed.healthScore < 80 ? 25.0 : 6.0,
        necrosisBrown: parsed.healthScore < 60 ? 30.0 : 4.0,
        powderyWhite: parsed.conditionName.includes("Mildew") ? 25.0 : 1.0
      },
      lesionCount: parsed.healthScore < 80 ? 18 : 0,
      isGeminiPowered: true,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error("Gemini Vision processing error:", err);
    return null;
  }
}

/**
 * Conversational botanical assistant powered by Gemini API
 */
export async function chatWithGemini(userMessage, chatHistory = [], plantContext = null) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return null; // Signals to use built-in assistant
  }

  try {
    const contextPrompt = plantContext 
      ? `User is currently managing plant: "${plantContext.name}" (${plantContext.scientificName || ''}). Category: ${plantContext.category || ''}.`
      : 'User is asking about plants, tree planting, urban forestry, gardening, or plant pathology.';

    const systemInstruction = `You are Dr. Flora, an expert botanical specialist, urban forestry scientist, and plant doctor.
${contextPrompt}
Answer the user's questions clearly, concisely, and encouragingly. Use friendly formatting with bullet points and emojis. Keep answers practical and focused on helping plants thrive and survive.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const formattedHistory = chatHistory.slice(-6).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    formattedHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      console.warn("Gemini Chat API returned error:", res.status);
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    console.error("Gemini Chat error:", e);
    return null;
  }
}

function convertBlobToBase64(blobOrFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blobOrFile);
  });
}
