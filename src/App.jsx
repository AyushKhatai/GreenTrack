import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/Dashboard/StatCard';
import ImpactAnalytics from './components/Dashboard/ImpactAnalytics';
import RecentActivity from './components/Dashboard/RecentActivity';
import MyForest from './components/MyForest/MyForest';
import GuildsHub from './components/Guilds/GuildsHub';
import ScannerHUD from './components/PlantDoctor/ScannerHUD';
import DiagnosisResult from './components/PlantDoctor/DiagnosisResult';
import TreatmentPlan from './components/PlantDoctor/TreatmentPlan';
import BotanistChat from './components/PlantDoctor/BotanistChat';
import TreeGISMap from './components/MapTracker/TreeGISMap';
import PlantNewModal from './components/MapTracker/PlantNewModal';
import TreeDetailModal from './components/DigitalTwin/TreeDetailModal';
import QRScannerModal from './components/DigitalTwin/QRScannerModal';
import PlantDirectory from './components/Encyclopedia/PlantDirectory';
import PlantDetailModal from './components/Encyclopedia/PlantDetailModal';

import { 
  loadTrees, 
  saveTrees, 
  syncTreesFromCloud,
  addTree, 
  updateTree, 
  addTreeEvent, 
  deleteTree, 
  resetToDemoData 
} from './services/storageService';
import { calculateAggregateImpact } from './services/carbonCalculator';
import { 
  analyzePlantImage, 
  generateSyntheticDiagnosis 
} from './services/plantVisionService';
import { analyzePlantWithGemini } from './services/geminiService';
import { addXpToGuild, getUserGuild } from './data/guildsData';
import { PLANT_DATABASE, getPlantById } from './data/plantDatabase';
import { 
  Sparkles, 
  Sprout, 
  TreePine, 
  Trophy,
  Flame,
  Key
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [trees, setTrees] = useState([]);
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'guilds' | 'doctor' | 'map' | 'encyclopedia'

  // Modals state
  const [selectedTree, setSelectedTree] = useState(null);
  const [plantModalOpen, setPlantModalOpen] = useState(false);
  const [plantModalCoords, setPlantModalCoords] = useState(null);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [plantDetailModal, setPlantDetailModal] = useState(null);

  // AI Vision state
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetTreeForAI, setTargetTreeForAI] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load trees on mount & sync with Supabase Cloud
  useEffect(() => {
    const loaded = loadTrees();
    setTrees(loaded);

    // Asynchronously sync from cloud if connected
    syncTreesFromCloud().then((cloudTrees) => {
      if (cloudTrees && cloudTrees.length > 0) {
        setTrees(cloudTrees);
      }
    });
  }, []);

  const aggregateImpact = calculateAggregateImpact(trees);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // AI Scanner handlers with real Gemini Multi-Modal integration
  const handleAnalyzeImage = async (fileOrBlob, previewUrl) => {
    setIsAnalyzing(true);
    try {
      // 1. Try Gemini Vision API first
      let result = await analyzePlantWithGemini(previewUrl || fileOrBlob);

      // 2. Fallback to pixel chromatic lesion analyzer if no key or error
      if (!result) {
        result = await analyzePlantImage(previewUrl || fileOrBlob);
      }

      setDiagnosisResult(result);
      showToast(`AI Diagnosis complete: ${result.species.name} (${result.healthScore}% health score)`);

      // Award XP to active user Guild
      addXpToGuild(getUserGuild(), 50);

      setTimeout(() => {
        document.getElementById('diagnosis-result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error("Analysis failed:", e);
      const fallback = generateSyntheticDiagnosis("neem-tree", "healthy-vigor");
      setDiagnosisResult(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSamplePreset = (preset) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = generateSyntheticDiagnosis(preset.speciesId, preset.diseaseId);
      setDiagnosisResult(result);
      setIsAnalyzing(false);
      showToast(`Loaded sample: ${preset.label}`);
      setTimeout(() => {
        document.getElementById('diagnosis-result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 450);
  };

  // Tree action handlers
  const handleAddTree = (newTreeData) => {
    const created = addTree(newTreeData);
    setTrees(loadTrees());
    addXpToGuild(getUserGuild(), 120);
    showToast(`🌱 Registered "${created.name}" (+120 Clan XP)`);
  };

  const handleWaterTree = (treeId) => {
    const tree = trees.find(t => t.id === treeId);
    if (!tree) return;

    addTreeEvent(treeId, {
      type: "Watering",
      title: "Hydration Logged",
      note: "Deep root zone watering applied.",
      icon: "Droplets",
      health: tree.status,
      author: "Eco Guardian",
      aiVerified: false
    });

    setTrees(loadTrees());
    addXpToGuild(getUserGuild(), 15);
    showToast(`💧 Watered ${tree.name} (+15 Clan XP)`);
  };

  const handleRunAIScan = (tree) => {
    setTargetTreeForAI(tree);
    setCurrentTab('doctor');
    const speciesId = tree.speciesId || "neem-tree";
    const diseaseId = tree.status === "Critical" 
      ? "bacterial-leaf-spot" 
      : tree.status === "Needs Attention" 
        ? "dehydration-drought-stress" 
        : "healthy-vigor";
    const diag = generateSyntheticDiagnosis(speciesId, diseaseId);
    setDiagnosisResult(diag);
  };

  const handleSaveDiagnosisToTree = (diagResult) => {
    const targetTree = targetTreeForAI || (trees.length > 0 ? trees[0] : null);
    if (!targetTree) {
      showToast("Please register a tree first to log diagnosis.");
      return;
    }

    const healthStatus = diagResult.healthScore >= 80 
      ? "Healthy" 
      : diagResult.healthScore >= 55 
        ? "Needs Attention" 
        : "Critical";

    addTreeEvent(targetTree.id, {
      type: "AI Health Scan",
      title: `AI Scan: ${diagResult.disease.name}`,
      note: `Diagnostic Score: ${diagResult.healthScore}%. Disease: ${diagResult.disease.name}. Confidence: ${diagResult.confidence}%.`,
      icon: "ShieldCheck",
      health: healthStatus,
      healthScore: diagResult.healthScore,
      author: "AI Vision Doctor",
      aiVerified: true
    });

    setTrees(loadTrees());
    addXpToGuild(getUserGuild(), 40);
    showToast(`✅ Saved AI scan to ${targetTree.name} passport! (+40 Clan XP)`);
    setTargetTreeForAI(null);
  };

  const handleDeleteTree = (treeId) => {
    if (confirm("Are you sure you want to delete this tree record?")) {
      const updated = deleteTree(treeId);
      setTrees(updated);
      setSelectedTree(null);
      showToast("Tree record removed.");
    }
  };

  const handleResetData = () => {
    if (confirm("Reset all trees back to initial demo dataset?")) {
      const reset = resetToDemoData();
      setTrees(reset);
      showToast("Reset to demo dataset.");
    }
  };

  const handleOpenPlantModalWithCoords = (lat, lng) => {
    setPlantModalCoords({ lat, lng });
    setPlantModalOpen(true);
  };

  const handleSelectPlantForDiagnosis = (plant) => {
    const diag = generateSyntheticDiagnosis(plant.id, "healthy-vigor");
    setDiagnosisResult(diag);
    setCurrentTab('doctor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-enter border border-emerald-300">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        aggregateImpact={aggregateImpact}
        onOpenPlantModal={() => { setPlantModalCoords(null); setPlantModalOpen(true); }}
        onOpenQRScanner={() => setQrScannerOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* VIEW 1: MY FOREST & DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8 animate-enter">
            
            {/* My Active Forest Cards */}
            <MyForest
              trees={trees}
              onSelectTree={(tree) => setSelectedTree(tree)}
              onWaterTree={handleWaterTree}
              onRunAIScan={handleRunAIScan}
              onOpenPlantModal={() => { setPlantModalCoords(null); setPlantModalOpen(true); }}
            />

            {/* KPI Stat Cards */}
            <div className="pt-4 border-t border-emerald-500/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Urban Forestry Survival Metrics
              </h3>
              <StatCards aggregateImpact={aggregateImpact} />
            </div>

            {/* Visual Analytics & Trajectory */}
            <ImpactAnalytics aggregateImpact={aggregateImpact} trees={trees} />

            {/* Activity Table */}
            <RecentActivity
              trees={trees}
              onSelectTree={(tree) => setSelectedTree(tree)}
              onRunAIScan={handleRunAIScan}
              onWaterTree={handleWaterTree}
              onViewMap={() => setCurrentTab('map')}
            />

          </div>
        )}

        {/* VIEW 2: GUILDS & QUESTS */}
        {currentTab === 'guilds' && (
          <GuildsHub
            onPlantForGuild={() => { setPlantModalCoords(null); setPlantModalOpen(true); }}
            onOpenMap={() => setCurrentTab('map')}
          />
        )}

        {/* VIEW 3: AI PLANT DOCTOR & VISION SCANNER */}
        {currentTab === 'doctor' && (
          <div className="space-y-8 animate-enter">
            
            {/* Top Vision Scanner HUD */}
            <ScannerHUD
              onAnalyzeImage={handleAnalyzeImage}
              isAnalyzing={isAnalyzing}
              onSelectSamplePreset={handleSelectSamplePreset}
              activeTreeTarget={targetTreeForAI}
            />

            {/* Diagnosis Result if available */}
            {diagnosisResult && (
              <div id="diagnosis-result-section" className="space-y-8 animate-enter">
                <DiagnosisResult
                  result={diagnosisResult}
                  onSaveToTree={handleSaveDiagnosisToTree}
                  onAskBotanist={(res) => {
                    const elem = document.getElementById('dr-flora-chat');
                    elem?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onViewEncyclopedia={(specId) => {
                    const plant = getPlantById(specId);
                    if (plant) setPlantDetailModal(plant);
                  }}
                  selectedTreeForLog={targetTreeForAI}
                />

                {/* 7-Day Treatment Plan */}
                <TreatmentPlan
                  disease={diagnosisResult.disease}
                  species={diagnosisResult.species}
                />
              </div>
            )}

            {/* Interactive "Dr. Flora" Botanical Chatbot */}
            <div id="dr-flora-chat">
              <BotanistChat 
                activePlantContext={diagnosisResult?.species} 
              />
            </div>

          </div>
        )}

        {/* VIEW 4: GIS MAP TRACKER */}
        {currentTab === 'map' && (
          <div className="animate-enter">
            <TreeGISMap
              trees={trees}
              onSelectTree={(tree) => setSelectedTree(tree)}
              onOpenPlantModalWithCoords={handleOpenPlantModalWithCoords}
            />
          </div>
        )}

        {/* VIEW 5: PLANT ENCYCLOPEDIA */}
        {currentTab === 'encyclopedia' && (
          <div className="animate-enter">
            <PlantDirectory
              onSelectPlantForDiagnosis={handleSelectPlantForDiagnosis}
              onOpenPlantDetail={(plant) => setPlantDetailModal(plant)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-500/10 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-300">GreenTrack Clans</span>
            <span>•</span>
            <span>AI-Verified Campus & Urban Tree Care</span>
          </div>
          <div>
            Built with 💚 for Community Tree Survival & Gamified Urban Ecology
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Register Tree Modal */}
      <PlantNewModal
        isOpen={plantModalOpen}
        onClose={() => setPlantModalOpen(false)}
        onAddTree={handleAddTree}
        initialCoords={plantModalCoords}
      />

      {/* 2. Digital Twin Tree Passport Modal */}
      {selectedTree && (
        <TreeDetailModal
          tree={selectedTree}
          onClose={() => setSelectedTree(null)}
          onWaterTree={handleWaterTree}
          onRunAIScan={handleRunAIScan}
          onDeleteTree={handleDeleteTree}
          onAddCustomEvent={(treeId, evt) => {
            addTreeEvent(treeId, evt);
            setTrees(loadTrees());
            const updated = loadTrees().find(t => t.id === treeId);
            setSelectedTree(updated);
            showToast("Logged timeline event.");
          }}
        />
      )}

      {/* 3. QR Camera Scanner Modal */}
      <QRScannerModal
        isOpen={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        trees={trees}
        onFoundTree={(tree) => {
          setSelectedTree(tree);
          showToast(`Loaded digital passport for ${tree.name}`);
        }}
      />

      {/* 4. Plant Encyclopedia Detail Modal */}
      {plantDetailModal && (
        <PlantDetailModal
          plant={plantDetailModal}
          onClose={() => setPlantDetailModal(null)}
          onDiagnoseThisPlant={handleSelectPlantForDiagnosis}
        />
      )}

    </div>
  );
}
