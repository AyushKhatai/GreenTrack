import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Zap,
  ScanLine,
  TreePine
} from 'lucide-react';
import { SAMPLE_AI_PRESETS } from '../../services/plantVisionService';
import { SectionHeader, StatusBadge } from '../ui';

export default function ScannerHUD({
  onAnalyzeImage,
  isAnalyzing,
  onSelectSamplePreset,
  activeTreeTarget = null
}) {
  const [mode, setMode] = useState('upload');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

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
    <div className="space-y-4 animate-enter">

      {/* Targeted tree banner */}
      {activeTreeTarget && (
        <div className="card p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-surface-2 border border-line-elev flex items-center justify-center text-[15px]">
              🌳
            </div>
            <div>
              <div className="eyebrow text-fg-subtle">Targeted diagnostic</div>
              <div className="text-h3 text-fg mt-1">{activeTreeTarget.name}</div>
            </div>
          </div>
          <StatusBadge variant="live" label="Health check" size="xs" pulse />
        </div>
      )}

      {/* Main scanner surface */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <SectionHeader
            eyebrow="Vision scanner"
            title="AI Plant Doctor"
            description="Identify species & diagnose leaf pathologies with computer vision."
            icon={ScanLine}
            size="md"
            align="left"
          />

          <div className="tabs shrink-0" role="tablist" aria-label="Input mode">
            <button
              role="tab"
              aria-selected={mode === 'upload'}
              onClick={() => { stopCamera(); setMode('upload'); }}
              className={`tab ${mode === 'upload' ? 'tab-active' : ''}`}
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
              <span>Upload</span>
            </button>
            <button
              role="tab"
              aria-selected={mode === 'camera'}
              onClick={startCamera}
              className={`tab ${mode === 'camera' ? 'tab-active' : ''}`}
            >
              <Camera className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* View area */}
        <div className="relative">
          {mode === 'upload' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full h-80 sm:h-96 rounded-lg border-2 border-dashed transition-colursor-pointer relative overflow-hidden flex flex-col items-center justify-center p-6 text-center ${
                isDragging
                  ? 'border-emerald-500 bg-[#111111]'
                  : 'border-[#262626] hover:border-[#3a3a3a] bg-[#0a0a0a]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                accept="image/*"
                className="sr-only"
                aria-label="Upload a plant image"
              />

              {previewUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Uploaded plant specimen preview"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />

                  {isAnalyzing && (
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden rounded-md bg-[#0a0a0a]/80 flex flex-col items-center justify-center gap-3"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="absolute inset-0 scanner-sweep" aria-hidden="true" />
                      <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" strokeWidth={2} aria-hidden="true" />
                      <span className="text-[13px] font-medium text-white relative">
                        Analyzing leaf pigments & lesions…
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 h-[2px] overflow-hidden rounded-full bg-[#262626]">
                        <div className="h-full scanner-sweep-bar" style={{ background: 'var(--accent)' }} />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-[#161616] border border-[#262626] px-2.5 py-1 rounded-md text-[11px] font-medium text-[#a1a1a1] flex items-center gap-1.5 focus-ring"
                    aria-label="Replace the uploaded image"
                  >
                    <ImageIcon className="w-3 h-3" strokeWidth={2} aria-hidden="true" /> Click to replace
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center max-w-sm">
                  <div className="w-12 h-12 rounded-md bg-[#161616] border border-[#262626] flex items-center justify-center text-emerald-500 mb-4" aria-hidden="true">
                    <Upload className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h4 className="font-medium text-white text-[14px] mb-1">
                    Upload or drag a leaf photo
                  </h4>
                  <p className="text-[12px] text-[#6b6b6b] mb-4">
                    JPG, PNG, or WEBP. Close-up of the leaf blade gives the best results.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary"
                  >
                    Browse file
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-80 sm:h-96 rounded-lg bg-black relative overflow-hidden border border-[#262626] flex flex-col items-center justify-center">
              {cameraError ? (
                <div className="p-6 text-center max-w-md">
                  <p className="text-[13px] text-[#a1a1a1] mb-4">{cameraError}</p>
                  <button
                    onClick={() => setMode('upload')}
                    className="btn btn-primary"
                  >
                    Switch to upload
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

                  <div className="absolute inset-8 sm:inset-12 border border-[#262626] rounded-lg pointer-events-none">
                    <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-emerald-500" />
                    <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-emerald-500" />
                    <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-emerald-500" />
                    <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-emerald-500" />

                    <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-emerald-500 font-semibold flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dot-pulse" />
                      LIVE HUD
                    </div>
                  </div>

                  <div className="absolute bottom-6 flex items-center gap-4">
                    <button
                      onClick={captureSnapshot}
                      aria-label="Capture"
                      className="capture-ring w-14 h-14 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-emerald-500"
                      title="Capture"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-[#052e16]" strokeWidth={2.5} />
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sample presets */}
      <div className="surface p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[11px] uppercase tracking-wider text-[#6b6b6b] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
            1-click test presets
          </h3>
          <span className="text-[10px] text-[#6b6b6b]">No upload required</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SAMPLE_AI_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectSamplePreset(preset)}
              className="p-3 rounded-md border border-[#262626] bg-[#0a0a0a] hover:border-[#3a3a3a] hover:bg-[#111111] text-left transition-colors group focus-ring"
              aria-label={`Try sample preset ${preset.label}: ${preset.desc}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[18px]" aria-hidden="true">
                  {preset.svgIcon}
                </span>
              </div>
              <div className="font-medium text-white text-[12px] truncate">{preset.label}</div>
              <div className="text-[10px] text-[#6b6b6b] truncate mt-0.5">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}