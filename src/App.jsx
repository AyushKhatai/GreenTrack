import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
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
  Key,
  Plus,
  MapPin,
  BarChart3,
  History,
  ScanLine,
  BookOpen,
  Users
} from 'lucide-react';
import { PageHero, SectionHeader, StatNumber, StatTile, StatusBadge, ConfirmDialog, ToastProvider, useToast } from './components/ui';

function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

export default App;

function AppInner() {
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

  // Confirm dialog state (replaces window.confirm)
  const [confirmState, setConfirmState] = useState(null);
  const confirmResolverRef = useRef(null);

  const { toast } = useToast();

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

  const showToast = (msg, opts) => toast(msg, opts);

  const askConfirm = ({ title, description, confirmLabel, cancelLabel, tone }) => {
    return new Promise((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmState({
        title,
        description,
        confirmLabel,
        cancelLabel,
        tone,
      });
    });
  };

  const handleConfirmResolve = (result) => {
    if (confirmResolverRef.current) {
      confirmResolverRef.current(result);
      confirmResolverRef.current = null;
    }
    setConfirmState(null);
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
      showToast(`AI Diagnosis complete: ${result.species.name} (${result.healthScore}% health score)`, { variant: 'success', title: 'Diagnosis ready' });

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
      showToast(`Loaded sample: ${preset.label}`, { variant: 'info' });
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
    showToast(`Registered "${created.name}" (+120 Clan XP)`, { variant: 'success', title: 'Sapling registered' });
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
    showToast(`Watered ${tree.name} (+15 Clan XP)`, { variant: 'info' });
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
      showToast("Please register a tree first to log diagnosis.", { variant: 'warning', title: 'No tree selected' });
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
    showToast(`Saved AI scan to ${targetTree.name} passport! (+40 Clan XP)`, { variant: 'success', title: 'Scan archived' });
    setTargetTreeForAI(null);
  };

  const handleDeleteTree = async (treeId) => {
    const ok = await askConfirm({
      title: 'Delete tree record?',
      description: 'This permanently removes the sapling, its timeline, and its carbon model. This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      tone: 'destructive',
    });
    if (!ok) return;
    const updated = deleteTree(treeId);
    setTrees(updated);
    setSelectedTree(null);
    showToast('Tree record removed.', { variant: 'info' });
  };

  const handleResetData = async () => {
    const ok = await askConfirm({
      title: 'Reset to demo dataset?',
      description: 'All trees, quests, and local progress will be replaced with the demo dataset. Cloud data is not touched.',
      confirmLabel: 'Reset',
      cancelLabel: 'Cancel',
      tone: 'warning',
    });
    if (!ok) return;
    const reset = resetToDemoData();
    setTrees(reset);
    showToast('Reset to demo dataset.', { variant: 'info' });
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] flex flex-col antialiased overflow-x-hidden">

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        aggregateImpact={aggregateImpact}
        onOpenPlantModal={() => { setPlantModalCoords(null); setPlantModalOpen(true); }}
        onOpenQRScanner={() => setQrScannerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* VIEW 1: MY FOREST & DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-10">

            <PageHero
              eyebrow="Your forest"
              title={trees.length === 0 ? 'Start your canopy' : 'A living record of every sapling under your care'}
              description={
                trees.length === 0
                  ? 'Register a sapling, log its watering schedule, and watch your urban canopy take root over time.'
                  : `${trees.length} tree${trees.length === 1 ? '' : 's'} under active care · ${aggregateImpact.survivalRate}% survival rate across the registry`
              }
              chip={{ label: 'Live registry', tone: 'live' }}
              cta={{
                label: 'Plant a tree',
                onClick: () => { setPlantModalCoords(null); setPlantModalOpen(true); },
                icon: Plus,
              }}
              action={{
                label: 'Open map',
                onClick: () => setCurrentTab('map'),
                icon: MapPin,
              }}
              meta={
                <>
                  <StatTile
                    label="Trees tracked"
                    value={aggregateImpact.totalTrees}
                    size="lg"
                    sub={`${aggregateImpact.healthyCount} healthy · ${aggregateImpact.attentionCount} attention`}
                  />
                  <StatTile
                    label="Survival rate"
                    value={`${aggregateImpact.survivalRate}%`}
                    tone={aggregateImpact.survivalRate >= 80 ? 'healthy' : aggregateImpact.survivalRate >= 60 ? 'attention' : 'critical'}
                    size="lg"
                    sub="AI-verified"
                  />
                  <StatTile
                    label="CO₂ sequestered"
                    value={aggregateImpact.totalCo2Kg >= 1000 ? `${(aggregateImpact.totalCo2Kg / 1000).toFixed(2)}t` : `${Math.round(aggregateImpact.totalCo2Kg)}`}
                    unit={aggregateImpact.totalCo2Kg >= 1000 ? 'tonnes' : 'kg'}
                    size="lg"
                    sub={`${aggregateImpact.carKmOffset.toLocaleString()} car-km offset`}
                  />
                  <StatTile
                    label="Eco guardians"
                    value={aggregateImpact.guardiansCount}
                    size="lg"
                    sub="Community powered"
                  />
                </>
              }
            />

            <div className="stagger-item" style={{ '--stagger-index': 1 }}>
              <MyForest
                trees={trees}
                onSelectTree={(tree) => setSelectedTree(tree)}
                onWaterTree={handleWaterTree}
                onRunAIScan={handleRunAIScan}
                onOpenPlantModal={() => { setPlantModalCoords(null); setPlantModalOpen(true); }}
              />
            </div>

            <section className="space-y-4 stagger-item" style={{ '--stagger-index': 2 }}>
              <SectionHeader
                eyebrow="Field telemetry"
                title="Canopy analytics"
                description="Live carbon trajectory, canopy health mix, and environmental equivalents derived from your registered trees."
                icon={BarChart3}
                trailing={<StatusBadge variant="live" label="Live model" pulse />}
              />
              <ImpactAnalytics aggregateImpact={aggregateImpact} trees={trees} />
            </section>

            <section className="space-y-4 stagger-item" style={{ '--stagger-index': 3 }}>
              <SectionHeader
                eyebrow="Sapling passports"
                title="Field registry"
                description="Every registered sapling, sortable by health and traceable on the GIS map."
                icon={History}
                trailing={
                  <button
                    type="button"
                    onClick={() => setCurrentTab('map')}
                    className="btn btn-secondary"
                  >
                    <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Open map</span>
                  </button>
                }
              />
              <RecentActivity
                trees={trees}
                onSelectTree={(tree) => setSelectedTree(tree)}
                onRunAIScan={handleRunAIScan}
                onWaterTree={handleWaterTree}
                onViewMap={() => setCurrentTab('map')}
              />
            </section>

          </div>
        )}

        {/* VIEW 2: GUILDS & QUESTS */}
        {currentTab === 'guilds' && (
          <div className="space-y-8 animate-enter">
            <PageHero
              eyebrow="Community"
              title="Guilds, quests, and standings"
              description="Team up with your campus or neighborhood guild, contribute to active quests, and climb the survival leaderboard."
              icon={Trophy}
              chip={{ label: 'Live leaderboard', tone: 'live' }}
            />
            <GuildsHub
              onPlantForGuild={() => { setPlantModalCoords(null); setPlantModalOpen(true); }}
              onOpenMap={() => setCurrentTab('map')}
            />
          </div>
        )}

        {/* VIEW 3: AI PLANT DOCTOR & VISION SCANNER */}
        {currentTab === 'doctor' && (
          <div className="space-y-8 animate-enter">

            <PageHero
              eyebrow="AI Plant Doctor"
              title="Diagnose leaf health in seconds"
              description="Upload a photo, scan a leaf with the camera, or pick a 1-click test preset. The Doctor identifies species, scores chlorophyll, and prescribes a 7-day care plan."
              icon={ScanLine}
              chip={{ label: 'Dr. Flora online', tone: 'live' }}
            />

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
          <div className="space-y-6 animate-enter">
            <PageHero
              eyebrow="GIS registry"
              title="Every sapling, on the map"
              description="Search any place, scan the field, or click anywhere on the map to drop a new sapling. Each pin links to its digital twin."
              icon={MapPin}
              chip={{ label: 'Free tiles', tone: 'live' }}
            />
            <TreeGISMap
              trees={trees}
              onSelectTree={(tree) => setSelectedTree(tree)}
              onOpenPlantModalWithCoords={handleOpenPlantModalWithCoords}
            />
          </div>
        )}

        {/* VIEW 5: PLANT ENCYCLOPEDIA */}
        {currentTab === 'encyclopedia' && (
          <div className="space-y-6 animate-enter">
            <PageHero
              eyebrow="Botanical encyclopedia"
              title="Care guides for the canopy"
              description="Light, water, soil, toxicity, and carbon absorption across the species you can plant or rescue."
              icon={BookOpen}
              chip={{ label: 'Verified species', tone: 'live' }}
            />
            <PlantDirectory
              onSelectPlantForDiagnosis={handleSelectPlantForDiagnosis}
              onOpenPlantDetail={(plant) => setPlantDetailModal(plant)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#6b6b6b]">
          <div className="flex items-center gap-2">
            <Sprout className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
            <span className="text-[#a1a1a1] font-medium">GreenTrack</span>
            <span className="text-[#262626]">·</span>
            <span>AI-verified urban tree care</span>
          </div>
          <div>Community-powered canopy survival</div>
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
            showToast("Logged timeline event.", { variant: 'success' });
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
          showToast(`Loaded digital passport for ${tree.name}`, { variant: 'success', title: 'Tree loaded' });
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

      {/* 5. Generic confirm dialog (replaces window.confirm) */}
      <ConfirmDialog
        open={!!confirmState}
        onClose={() => handleConfirmResolve(false)}
        onConfirm={() => handleConfirmResolve(true)}
        title={confirmState?.title || ''}
        description={confirmState?.description}
        confirmLabel={confirmState?.confirmLabel}
        cancelLabel={confirmState?.cancelLabel}
        tone={confirmState?.tone}
      />

    </div>
  );
}
