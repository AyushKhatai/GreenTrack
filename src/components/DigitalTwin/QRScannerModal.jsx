import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  X, 
  QrCode, 
  Search, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  TreePine
} from 'lucide-react';

export default function QRScannerModal({ 
  isOpen, 
  onClose, 
  trees = [], 
  onFoundTree 
}) {
  const [manualToken, setManualToken] = useState('');
  const [scanError, setScanError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize HTML5 QR Code Scanner
    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          handleDecodedToken(decodedText);
          scanner.clear();
        },
        (error) => {
          // Scanner frame error (ignore periodic missed frames)
        }
      );

      scannerRef.current = scanner;
    } catch (e) {
      console.warn("Could not start HTML5 scanner:", e);
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
      }
    };
  }, [isOpen]);

  const handleDecodedToken = (rawText) => {
    // Extract token (e.g. from URL "https://greentrack.ai/tree/GT-TREE-BGLR-101" or raw "GT-TREE-BGLR-101")
    const cleanToken = rawText.split('/').pop().replace('TreeID:', '').trim();
    
    const matchedTree = trees.find(t => 
      (t.qrCodeToken && t.qrCodeToken.toLowerCase() === cleanToken.toLowerCase()) ||
      t.id.toString().toLowerCase() === cleanToken.toLowerCase() ||
      (t.name && t.name.toLowerCase().includes(cleanToken.toLowerCase()))
    );

    if (matchedTree) {
      onFoundTree(matchedTree);
      onClose();
    } else {
      setScanError(`No tree found matching token: "${cleanToken}". Please check code.`);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleDecodedToken(manualToken.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-emerald-500/30 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-enter">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Scan Tree QR Tag</h3>
              <p className="text-xs text-slate-400">Point camera at tree's digital tag</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* QR Camera Reader Container */}
          <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900/80 p-2 relative">
            <div id="qr-reader-container" className="w-full text-slate-200 text-xs" />
          </div>

          {scanError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Quick Manual Token Input Fallback */}
          <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or Enter Token / Tree ID Manually
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. GT-TREE-BGLR-101"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="glass-input flex-1 px-4 py-2 rounded-xl text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Look Up
              </button>
            </div>
          </form>

          {/* Quick sample chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Quick Test Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {trees.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleDecodedToken(t.qrCodeToken || t.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-[10px] font-mono text-emerald-400"
                >
                  {t.qrCodeToken || t.id}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
