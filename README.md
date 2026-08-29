# 🌳 GreenTrack AI 2.0: Phygital Tree Survival & Urban Forestry Platform

> **A full-fledged, state-of-the-art web application to track, verify, and sustain post-plantation tree survival through AI computer vision diagnostics, QR Digital Twins, and community gamification.**

---

## 🚀 The Core Problem
Millions of saplings are planted globally every year in green drives, but **up to 50% die within the first 12 months** due to lack of post-plantation monitoring and care. Most initiatives only count trees planted on Day 1 — **GreenTrack tracks their survival for life**.

---

## 🌟 Key Features

### 1. 🌿 Advanced AI Plant Doctor & Species Identifier
* **Multi-Species Identification:** Instant recognition across 35+ common urban trees, garden plants, and houseplants with botanical taxonomy, family, and confidence ratings.
* **Computer Vision Lesion Analysis:** Pixel-level chromatic extraction that mathematically identifies healthy chlorophyll, chlorosis (yellowing), fungal/bacterial necrotic lesions, and powdery mildew spores.
* **Health Score (0-100%):** Real-time vigor score with visual lesion heatmap overlay and severity ratings.
* **7-Day Actionable Care Prescription:** Day 1 emergency intervention, Day 3 moisture check, Day 7 follow-up protocol with organic and chemical remedies.
* **1-Click Test Presets & Live Camera HUD:** Instant testing with built-in specimen presets or live camera scanning with targeting reticle.

### 2. 🤖 Dr. Flora (Interactive AI Botanist)
* Interactive AI chatbot assistant trained in plant pathology, symptoms, soil pH, organic pest control, and custom watering schedules.
* Quick-action prompt chips for instant answers on common plant issues.

### 3. 🗺️ Interactive GIS Map Tracker
* High-performance Leaflet.js map with custom color-coded pins (*Optimal Vigor*, *Needs Attention*, *Critical / Blight*).
* Real-time GPS coordinate acquisition, reverse geocoding addresses via OpenStreetMap, and layer switcher (Voyager, Satellite, Street, Topo).
* Click-anywhere pin-drop to register saplings on-site in the field.

### 4. 🔗 QR Digital Twins & Live Tag Scanner
* Generates unique, high-resolution QR tokens for every sapling.
* Built-in camera QR scanner to scan real-world physical tree tags and pull up their digital passport, watering history, and growth logs.

### 5. 🌍 Scientific Environmental Impact Engine
* Real-time carbon sequestration calculation (kg CO₂/year) based on species biomass, canopy diameter, and age.
* Real-world equivalents: Gasoline car km offset, full smartphone charges, stormwater gallons filtered, and Oxygen generated (kg O₂/yr).

### 6. 🏆 Community Gamification & Leaderboard
* Guardian rankings, XP levels, sustained survival rate %, and achievement badges (*"Forest Guardian"*, *"AI Doctor"*, *"Century Planter"*).

### 7. 📖 Botanical Encyclopedia & Care Almanac
* Searchable and filterable database of indoor plants, urban shade trees, medicinal herbs, and fruit trees with light, water, soil, and pet toxicity profiles.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 18 + Vite
* **Styling & Theme:** Tailwind CSS + Vanilla CSS Variables + Custom Glassmorphism System
* **Icons:** Lucide React + FontAwesome 6
* **Mapping & GIS:** Leaflet.js + OpenStreetMap Nominatim Geocoding + Esri World Imagery
* **Data Visualization:** Chart.js + React-Chartjs-2
* **QR Engine:** QRCode.react + Html5-QRCode
* **Gamification:** Canvas-Confetti
* **Data Persistence:** LocalStorage & IndexedDB with JSON/CSV export and import

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushKhatai/GreenTrack.git
   cd GreenTrack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Created by
Made with 💚 by **Ayush Khatai**
