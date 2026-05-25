import { useState, useEffect } from 'react';

export default function App() {
  const [problemStatement, setProblemStatement] = useState('');
  const [flaggedUrls, setFlaggedUrls] = useState([]);
  const [importedDoc, setImportedDoc] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
      
      @keyframes blink { 50% { opacity: 0; } }
      .cursor-blink { animation: blink 1s step-end infinite; }

      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(300%); }
      }
      
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      .pulse-dot { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      
      .font-typewriter { font-family: 'Special Elite', monospace; }
      
      .film-grain { position: relative; }
      .film-grain::after {
        content: "";
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.05;
        pointer-events: none;
        z-index: 50;
      }

      .scanlines::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent 0%, rgba(16,185,129,0.08) 50%, transparent 100%);
        animation: scanline 8s linear infinite;
        pointer-events: none;
        z-index: 45;
      }
      
      .tooltip .tooltip-text { visibility: hidden; opacity: 0; transition: opacity 0.2s; }
      .tooltip:hover .tooltip-text { visibility: visible; opacity: 1; }
      
      .footer-pattern {
        background-color: rgb(0, 0, 0);
        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='2' y='18' font-family='Courier New' font-size='6' fill='rgba(52, 211, 153, 0.3)' font-weight='black' transform='rotate(-45 15 15)'%3ESYNAPSIS%3C/text%3E%3C/svg%3E");
      }
      
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleFlagCurrentTab = () => {
    const mockUrl = { title: 'Research Doc ' + (flaggedUrls.length + 1), url: `https://example.com/paper-${Date.now()}`, type: 'web' };
    setFlaggedUrls([...flaggedUrls, mockUrl]);
  };

  const handleFileUpload = (setter, e) => {
    const file = e.target.files[0];
    if (file) {
      if (setter === 'problem') {
        setImportedDoc({ title: file.name, type: 'doc' });
      } else {
        setFlaggedUrls([...flaggedUrls, { title: file.name, url: '[LOCAL_DOC]', type: 'doc' }]);
      }
    }
  };

  const removeUrl = (urlToRemove) => {
    setFlaggedUrls(flaggedUrls.filter(item => item.url !== urlToRemove));
  };

  return (
    <div className="film-grain scanlines w-[400px] h-[550px] bg-black flex flex-col font-['Courier_New',monospace] border-4 border-slate-800 shadow-[8px_8px_0px_0px_rgba(52,211,153,0.15)] overflow-hidden">
      <header className="pt-3 pb-6 flex flex-col items-center justify-center bg-black shrink-0 relative z-10 border-b-2 border-slate-800">
        <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[8px] text-white font-bold tracking-widest uppercase">
          <div className="w-1.5 h-1.5 bg-emerald-500 pulse-dot"></div>
          Online
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-emerald-400 flex items-center font-typewriter">
          {"/*"}
          <span className="relative">
            Synapsis
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[8px] text-emerald-600 uppercase tracking-[0.3em] font-bold whitespace-nowrap font-['Courier_New',monospace] leading-normal">
              Intelligent Research Assistant
            </span>
          </span>
          {"..."}
          <span className="cursor-blink ml-1 text-emerald-400 font-black">_</span>
        </h1>
      </header>

      <div className="w-full bg-black flex justify-between px-4 pb-2 shrink-0 select-none">
        {['...', '-.--', '-.', '.-', '.--.', '...', '..', '...'].map((char, i) => (
          <span key={i} className="text-xs text-emerald-800/80 font-bold tracking-widest">{char}</span>
        ))}
      </div>

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <div className="flex flex-col gap-2 shrink-0">
          <label className="text-xs font-black text-emerald-500 uppercase tracking-widest flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              &gt; ANCHOR_CONTEXT
              <div className="relative tooltip cursor-help">
                <span className="text-emerald-700 hover:text-emerald-300 transition-colors">[?]</span>
                <div className="tooltip-text absolute top-full mt-1 left-0 w-48 bg-gradient-to-br from-emerald-950/95 to-black/95 backdrop-blur-sm border border-emerald-800/80 text-emerald-100 text-[10px] p-2 z-50 normal-case tracking-normal font-normal shadow-lg shadow-black">
                  Input the problem statement as a PDF, DOCX, or plain text.
                </div>
              </div>
            </div>
            
            <label htmlFor="anchor-upload" className="relative tooltip cursor-pointer text-emerald-700 hover:text-emerald-400 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              <div className="tooltip-text absolute top-full mt-2 right-0 w-max bg-gradient-to-br from-emerald-950/95 to-black/95 backdrop-blur-sm border border-emerald-800/80 text-emerald-100 text-[10px] p-1.5 z-50 normal-case tracking-normal font-normal shadow-lg shadow-black">
                Import document
              </div>
            </label>
            <input id="anchor-upload" type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => handleFileUpload('problem', e)} />
          </label>
          
          <div className="w-full bg-black border-2 border-slate-800 overflow-hidden">
            <textarea
              className="w-full p-3 text-xs bg-black outline-none resize-none text-emerald-100 placeholder-emerald-800 uppercase"
              rows="3"
              placeholder="[SYSTEM_PROMPT_WAITING...]"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
            />
            
            {importedDoc && (
              <div className="flex bg-slate-900/50 p-1.5 border-t border-slate-800 items-center">
                <div className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M14 2H6a0 0 0 0 0-0 0v16a0 0 0 0 0 0 0h12a0 0 0 0 0 0-0V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-emerald-100 font-bold truncate">{importedDoc.title}</div>
                </div>
                <button onClick={() => setImportedDoc(null)} className="text-emerald-700 hover:text-red-500 font-bold text-xs px-2 self-center transition-colors">
                  [X]
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleFlagCurrentTab}
          className="w-full bg-black border-2 border-emerald-800 text-emerald-300 font-bold py-2 hover:bg-emerald-950/40 hover:border-emerald-500 hover:text-emerald-100 uppercase tracking-widest text-xs shrink-0 transition-colors"
        >
          [ FLAG_CURRENT_TAB ]
        </button>

        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <label className="text-xs font-black text-emerald-500 uppercase tracking-widest flex justify-between items-center shrink-0 w-full">
            <div className="flex items-center gap-2">
              &gt; RESEARCH_QUEUE
              <div className="relative tooltip cursor-help">
                <span className="text-emerald-700 hover:text-emerald-300 transition-colors">[?]</span>
                <div className="tooltip-text absolute top-full mt-1 left-0 w-48 bg-gradient-to-br from-emerald-950/95 to-black/95 backdrop-blur-sm border border-emerald-800/80 text-emerald-100 text-[10px] p-2 z-50 normal-case tracking-normal font-normal shadow-lg shadow-black">
                  Tabs you've flagged for Synapsis to analyze.
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-emerald-600">[{flaggedUrls.length}]</span>
              <label htmlFor="queue-upload" className="relative tooltip cursor-pointer text-emerald-700 hover:text-emerald-400 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                <div className="tooltip-text absolute top-full mt-2 right-0 w-max bg-gradient-to-br from-emerald-950/95 to-black/95 backdrop-blur-sm border border-emerald-800/80 text-emerald-100 text-[10px] p-1.5 z-50 normal-case tracking-normal font-normal shadow-lg shadow-black">
                  Import document
                </div>
              </label>
              <input id="queue-upload" type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => handleFileUpload('queue', e)} />
            </div>
          </label>
          
          <div className="flex-1 bg-black border-2 border-slate-800 p-2 overflow-y-auto no-scrollbar">
            {flaggedUrls.length === 0 ? (
              <p className="text-emerald-700/70 text-[10px] text-center mt-10 uppercase font-bold tracking-widest">QUEUE_EMPTY</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {flaggedUrls.map((item, idx) => (
                  <li key={idx} className="flex bg-black/80 backdrop-blur-sm p-1.5 border border-slate-800 items-center hover:border-slate-700 transition-colors">
                    <div className="mr-2">
                      {item.type === 'web' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M14 2H6a0 0 0 0 0-0 0v16a0 0 0 0 0 0 0h12a0 0 0 0 0 0-0V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-emerald-100 font-bold truncate">{item.title}</div>
                      <div className="text-[8px] text-emerald-600 truncate mt-0.5">{item.url}</div>
                    </div>
                    <button onClick={() => removeUrl(item.url)} className="text-emerald-700 hover:text-red-500 font-bold text-xs px-2 self-center transition-colors">
                      [X]
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <footer className="footer-pattern px-4 py-2 border-t-4 border-slate-800 shrink-0 flex flex-col items-center">
        <button className="w-full bg-gradient-to-r from-emerald-950/80 via-emerald-700/50 to-emerald-950/80 backdrop-blur-lg border-2 border-emerald-400 text-emerald-50 font-black py-2.5 uppercase tracking-widest text-sm hover:from-emerald-900 hover:via-emerald-600/80 hover:to-emerald-900 hover:scale-[1.01] transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          INITIATE_RESEARCH
        </button>
        <span className="text-[8px] text-emerald-700/80 tracking-[0.2em] font-bold uppercase select-none pt-1">
          v0.1.0
        </span>
      </footer>
    </div>
  );
}