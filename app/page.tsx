'use client';

import { useState } from 'react';

export default function Home() {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setAnalysis('AI is analyzing your chart setup...');

    // Package the file cleanly so it can be sent over the network
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData, // Sending the actual image data here!
      });
      
      const data = await response.json();
      setAnalysis(data.content || 'No response from AI.');
    } catch (error) {
      setAnalysis('Error connecting to AI. Make sure your API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10 flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-amber-500">
          Crypto AI Trading Assistant
        </h1>
        <p className="text-gray-400">
          Upload your chart screenshot below for risk assessment and technical analysis.
        </p>
      </div>

      <div className="border border-red-500/30 bg-red-950/20 p-4 rounded-lg">
        <h3 className="text-red-400 font-semibold mb-1">⚠️ Core Risk Mandate:</h3>
        <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
          <li>Never risk more than 1% per trade.</li>
          <li>Maintain a minimum 1:2 Risk-to-Reward ratio.</li>
          <li>Preserve capital first; avoid high leverage.</li>
        </ul>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col gap-4">
        <label className="block text-sm font-medium text-gray-300">
          Select Chart Screenshot (BTC/ETH/SOL)
        </label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer text-sm text-zinc-400"
        />
      </div>

      {analysis && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl mt-4">
          <h2 className="text-lg font-bold mb-3 text-amber-400 flex items-center gap-2">
            {loading ? '⏳ Processing...' : '🤖 AI Analysis Setup:'}
          </h2>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
            {analysis}
          </p>
        </div>
      )}
    </main>
  );
}