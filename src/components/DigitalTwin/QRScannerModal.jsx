import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, AlertCircle, Search, TreePine } from 'lucide-react';
import { Modal, EmptyState } from '../ui';

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

    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scanner.render(
        (decodedText) => {
          handleDecodedToken(decodedText);
          scanner.clear();
        },
        (error) => {
          // Ignore periodic misses
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
      setScanError(`No tree found matching: "${cleanToken}"`);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleDecodedToken(manualToken.trim());
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Scan QR tag"
      subtitle="Point camera at the tree's tag"
      icon={QrCode}
      size="md"
    >
      <div className="space-y-5">

        <div className="rounded-md overflow-hidden border border-[#262626] bg-[#0a0a0a] p-2">
          <div id="qr-reader-container" className="w-full text-[#a1a1a1] text-[12px]" />
        </div>

        {scanError && (
          <div
            className="p-3 rounded-md border text-[12px] flex items-center gap-2"
            style={{
              borderColor: 'var(--status-critical-border)',
              background: 'var(--status-critical-bg)',
              color: 'var(--status-critical-fg)',
            }}
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            <span>{scanError}</span>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="space-y-2 pt-3 border-t border-line">
          <label htmlFor="qr-manual-token" className="block eyebrow text-fg-subtle">
            Or enter token
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2} aria-hidden="true" />
              <input
                id="qr-manual-token"
                type="text"
                placeholder="e.g. GT-TREE-BGLR-101"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="input w-full h-9 pl-9 pr-3 text-[13px]"
                aria-label="Tree token"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary text-[12px] focus-ring"
            >
              Look up
            </button>
          </div>
        </form>

        <div className="space-y-1.5">
          <span className="eyebrow text-fg-subtle">Quick test tags</span>
          {trees.length === 0 ? (
            <EmptyState
              size="sm"
              icon={TreePine}
              title="No trees registered"
              description="Register a sapling first, then scan its QR tag to open the digital passport."
            />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {trees.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleDecodedToken(t.qrCodeToken || t.id)}
                  aria-label={`Look up tree with token ${t.qrCodeToken || t.id}`}
                  className="px-2.5 py-1 rounded-md border border-line bg-surface-inset hover:border-line-elev text-[11px] font-mono text-accent transition-colors focus-ring"
                >
                  {t.qrCodeToken || t.id}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}