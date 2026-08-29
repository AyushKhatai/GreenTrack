import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  Image as ImageIcon,
  Zap,
  Leaf
} from 'lucide-react';
import { SAMPLE_AI_PRESETS } from '../../services/plantVisionService';

export default function ScannerHUD({ 
  onAnalyzeImage, 
  isAnalyzing, 
  onSelectSamplePreset,
  activeTreeTarget = null 
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'camera'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle Drag and drop
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onAnalyzeImage(file, url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Start webcam
  const startCamera = async () => {
    setMode('camera');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera unavailable or permission denied. Please upload an image instead.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        stopCamera();
        setMode('upload');
        onAnalyzeImage(file, url);
      }
    }, 'image/jpeg', 0.92);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
      
      {/* Target Tree banner if targeted from passport */}
      {activeTreeTarget && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              🌳
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Targeted Tree Diagnostic
              </div>
              <div className="font-bold text-white text-sm">{activeTreeTarget.name}</div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
            Health Check Mode
          </span>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            AI Plant Doctor & Vision Scanner
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify species & diagnose 10+ leaf pathologies using real-time computer vision
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-emerald-500/20 text-xs">
          <button
            onClick={() => { stopCamera(); setMode('upload'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'upload'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          
          <button
            onClick={() => { startCamera(); }}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'camera'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
        </div>
      </div>

      {/* Main Scanner View Area */}
      <div className="relative mb-6">
        
        {mode === 'upload' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className={`w-full h-80 sm:h-96 rounded-3xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center p-6 text-center group ${
              isDragging 
                ? 'border-emerald-400 bg-emerald-950/40' 
                : 'border-emerald-500/30 hover:border-emerald-400/60 bg-slate-900/40 hover:bg-slate-900/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Uploaded plant specimen"
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-xl"
                />
                
                {/* Laser scan animation overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-laser absolute" />
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center">
                      <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-2xl flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                        <span className="text-xs font-bold text-white tracking-wide">
                          Analyzing leaf pigments & lesions...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Click to replace
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center max-w-sm">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">
                  Upload or Drag & Drop Plant Leaf Photo
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Supports JPG, PNG, WEBP. Close-up photo of leaf blade produces highest diagnostic precision.
                </p>
                <span className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20">
                  Browse File
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Live Camera HUD */
          <div className="w-full h-80 sm:h-96 rounded-3xl bg-black relative overflow-hidden flex flex-col items-center justify-center border-2 border-emerald-500/40 shadow-2xl">
            {cameraError ? (
              <div className="p-6 text-center text-red-400 max-w-md">
                <p className="font-semibold text-sm mb-2">{cameraError}</p>
                <button
                  onClick={() => setMode('upload')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Switch to Upload
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Laser framing HUD overlay */}
                <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/70 rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  {/* Corner notches */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400" />
                  
                  {/* Center reticle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                  </div>

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE SENSOR HUD
                  </div>
                </div>

                {/* Shutter Capture Button */}
                <div className="absolute bottom-6 flex items-center gap-4">
                  <button
                    onClick={captureSnapshot}
                    className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-emerald-600"
                    title="Capture photo"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Camera className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* 1-Click Sample Test Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick 1-Click AI Test Presets (Zero Upload Required)
          </span>
          <span className="text-[10px] text-emerald-400/80">Click any preset to test AI instant diagnosis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SAMPLE_AI_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectSamplePreset(preset)}
              className="p-3 rounded-2xl bg-slate-900/70 border border-emerald-500/15 hover:border-emerald-400 hover:bg-emerald-950/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {preset.svgIcon}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 ${preset.accent}`}>
                  {preset.badge}
                </span>
              </div>
              <div className="font-bold text-white text-xs truncate">{preset.label}</div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
