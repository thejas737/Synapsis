import { useState, useEffect } from 'react';

export default function App() {
  const [problemStatement, setProblemStatement] = useState('');
  const [flaggedUrls, setFlaggedUrls] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Load data from Chrome's local storage when the popup opens
  useEffect(() => {
    // We check if 'chrome.storage' exists so the app doesn't crash if you run it locally in a browser tab
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['problemStatement', 'flaggedUrls'], (result) => {
        if (result.problemStatement) setProblemStatement(result.problemStatement);
        if (result.flaggedUrls) setFlaggedUrls(result.flaggedUrls);
      });
    }
  }, []);

  // 2. Save the problem statement whenever the user types
  const handleProblemChange = (e) => {
    const text = e.target.value;
    setProblemStatement(text);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ problemStatement: text });
    }
  };

  // Helper to save URLs to both React state and Chrome storage
  const saveUrls = (newUrls) => {
    setFlaggedUrls(newUrls);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ flaggedUrls: newUrls });
    }
  };

  // 3. Flag the active browser tab
  const handleFlagCurrentTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.url) {
          // Prevent adding duplicates
          if (!flaggedUrls.some(item => item.url === currentTab.url)) {
            saveUrls([...flaggedUrls, { title: currentTab.title, url: currentTab.url }]);
          }
        }
      });
    } else {
      // Mock data so you can test the UI in your normal browser using 'npm run dev'
      const mockUrl = { title: 'Local Dev Mock Website', url: `https://example.com/research-${Date.now()}` };
      saveUrls([...flaggedUrls, mockUrl]);
    }
  };

  // 4. Remove a flagged URL
  const removeUrl = (urlToRemove) => {
    saveUrls(flaggedUrls.filter(item => item.url !== urlToRemove));
  };

  // 5. Placeholder for the backend trigger
  const handleInitiateResearch = () => {
    if (!problemStatement || flaggedUrls.length === 0) {
      setStatusMessage('Please add a problem statement and flag at least one URL.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    setStatusMessage('Research Initiated! (Backend coming next)');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="w-[400px] h-[550px] bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h1 className="text-xl font-bold tracking-wide">Synapsis</h1>
        </div>
        <span className="text-xs font-medium bg-indigo-500 px-2 py-1 rounded-full">Alpha</span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        
        {/* Anchor Slot (Problem Statement) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            1. The Anchor
          </label>
          <textarea
            className="w-full p-3 text-sm border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white transition-all"
            rows="4"
            placeholder="Paste your hackathon problem statement here to guide the AI..."
            value={problemStatement}
            onChange={handleProblemChange}
          />
        </div>

        {/* Action Button: Flag Tab */}
        <button
          onClick={handleFlagCurrentTab}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Flag Current Tab
        </button>

        {/* Flagged URLs List */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex justify-between">
            <span>2. Research Queue</span>
            <span className="bg-slate-200 text-slate-600 px-2 rounded-full text-xs flex items-center">
              {flaggedUrls.length}
            </span>
          </label>
          
          <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm p-2 overflow-y-auto max-h-[140px]">
            {flaggedUrls.length === 0 ? (
              <p className="text-slate-400 text-xs text-center mt-10">No URLs flagged yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {flaggedUrls.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100 group">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium text-slate-700 truncate w-[280px]">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate w-[280px]">
                        {item.url}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeUrl(item.url)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      title="Remove URL"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="p-4 bg-white border-t border-slate-200 shrink-0">
        {statusMessage && (
          <div className="mb-3 text-center text-xs font-medium text-indigo-600 animate-pulse">
            {statusMessage}
          </div>
        )}
        <button
          onClick={handleInitiateResearch}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Initiate Research
        </button>
      </footer>
    </div>
  );
}