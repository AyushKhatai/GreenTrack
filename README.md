# 🌳 GreenTrack: AI-Verified Tree Survival Platform

> **Submission for [Hackathon Name]**
> A web platform to track, verify, and sustain post-plantation tree care through community participation and AI diagnostics.

---

## 🚀 The Problem
Millions of trees are planted every year during drives, but **up to 50% die within the first year** due to lack of aftercare. There is currently no transparent way to verify if a sapling is still alive, healthy, or being watered after the initial planting day.

## 💡 The Solution
**GreenTrack** is a "Phygital" (Physical + Digital) platform that gamifies tree care. We don't just count planted trees; we track their **survival**.

### 🌟 Key Features
* **🤖 AI Tree Doctor:** Uses `TensorFlow.js` and a custom-trained model to diagnose plant health. It detects if a plant is healthy, dead, or missing.
* **📍 Smart Geo-Tagging:** Automatically converts GPS coordinates into readable addresses (Reverse Geocoding) for every tree.
* **🔗 QR Digital Twin:** Generates a unique QR code for every sapling. Scan the real tree to see its digital history.
* **📈 Impact Metrics:** Real-time calculation of Survival Rate and CO₂ Offset.
* **🏆 Community Leaderboard:** Gamifies the experience to encourage top "Guardians."

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, JavaScript (ES6+)
* **Styling:** Tailwind CSS (CDN)
* **Mapping:** Leaflet.js + OpenStreetMap API
* **AI / ML:** Google Teachable Machine + TensorFlow.js
* **Utilities:** QRCode.js, LocalStorage (Demo Database)
* **Deployment:** GitHub Pages

---

## 🤖 How the AI Works
We use a hybrid approach to ensure accuracy:
1.  **Object Detection:** A custom model trained on **Google Teachable Machine** classifies the image into `Healthy`, `Dead`, or `Not a Plant`.
2.  **Pixel Analysis:** If the AI is unsure, our fallback algorithm analyzes the **Green-to-Brown pixel ratio** to detect dehydration or disease.

## 🚀 How to Run Locally
1.  Clone the repository:
    ```bash
    git clone [https://github.com/YOUR_USERNAME/green-track.git](https://github.com/YOUR_USERNAME/green-track.git)
    ```
2.  Open `index.html` in your browser.
3.  **Note:** GPS features require a secure context (HTTPS) or `localhost`.

## 🔮 Future Scope
* Integration with Polygon Blockchain for "Tree NFTs".
* IoT Soil Moisture sensors integration.
* Corporate sponsoring for "Adopting" high-performing trees.

---

Made with 💚 by Ayush Khatai
