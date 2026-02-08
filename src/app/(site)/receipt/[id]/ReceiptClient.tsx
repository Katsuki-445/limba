"use client";

import { Printer, Copy, Check, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function ReceiptClient({ reference, customerName }: { reference: string, customerName: string }) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Ensure title matches desired filename exactly
    const originalTitle = document.title;
    document.title = `Limba-Receipt-${reference}`;
    
    return () => {
      document.title = originalTitle;
    };
  }, [reference]);

  const handleDownload = () => {
    // Directly use native print/save-as-pdf functionality
    window.print();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard API failed, falling back to legacy copy", err);
      // Fallback for older browsers or non-secure contexts (like local network IP)
      const textArea = document.createElement("textarea");
      textArea.value = reference;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("Copy failed", e);
        alert("Could not copy automatically. Please copy the ID manually: " + reference);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 md:static md:w-auto md:bg-transparent md:border-none md:p-0 md:bottom-8 md:right-8 print:hidden flex flex-row md:flex-col gap-4 items-center md:items-end justify-center z-50">
      <button 
        onClick={copyToClipboard}
        className="flex-1 md:flex-none bg-white text-black border border-black px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-100 active:scale-95 transition-all justify-center whitespace-nowrap text-sm md:text-base"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? "Copied!" : "Copy ID"}
      </button>

      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex-1 md:flex-none bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-800 active:scale-95 transition-all justify-center whitespace-nowrap text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={18} />
        Save as PDF
      </button>
    </div>
  );
}
