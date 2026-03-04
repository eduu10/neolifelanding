'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function ExportCSV() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleExport() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads/export');
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Extract filename from Content-Disposition header or fallback
      const disposition = res.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
      a.download = filenameMatch?.[1] || 'leads.csv';

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Error handling: silently fail or could add toast
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-dash-border bg-dash-bg/50 px-3.5 text-xs font-medium text-dash-secondary transition-colors hover:bg-dash-border/50 hover:text-dash-text disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Exportar CSV
    </button>
  );
}
