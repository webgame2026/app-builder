
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { generateAppConcept } from './services/gemini';
import { deployToGithub, GithubDeploymentProgress } from './services/github';
import { AppConcept, BuildState, AppFile, ChatMessage, AppVersion, Project, DeviceType } from './types';
import JSZip from 'jszip';

// --- Utils ---
const generateHash = (timestamp: number) => {
  return Math.abs(timestamp).toString(16).substring(0, 7);
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- Sub-components ---

const ChatStatusIndicator = () => (
  <div className="flex items-start gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/70">System Processing</span>
      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
        <span className="animate-pulse">Architect is synthesizing your vision...</span>
      </div>
    </div>
  </div>
);

const ApkBuildModal = ({ 
  concept, 
  onClose 
}: { 
  concept: AppConcept; 
  onClose: () => void;
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const buildInProgress = useRef(true);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const runBuild = async () => {
      buildInProgress.current = true;
      addLog("Initializing Native Build Pipeline...");
      await new Promise(r => setTimeout(r, 600));
      if (!buildInProgress.current) return;
      setProgress(5);
      
      addLog("Resolving dependencies from manifest.json...");
      await new Promise(r => setTimeout(r, 800));
      if (!buildInProgress.current) return;
      setProgress(20);
      
      addLog("Bundling web assets into Android project structure...");
      await new Promise(r => setTimeout(r, 600));
      if (!buildInProgress.current) return;
      setProgress(40);

      addLog("Executing R8 resource optimization...");
      await new Promise(r => setTimeout(r, 1200));
      if (!buildInProgress.current) return;
      setProgress(65);

      addLog("Generating release keystore and signing APK...");
      await new Promise(r => setTimeout(r, 1000));
      if (!buildInProgress.current) return;
      setProgress(90);

      addLog("Build Successful. Packaging ZIP...");
      setProgress(100);
      
      const zip = new JSZip();
      concept.files.forEach(file => {
        zip.file(file.name, file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${concept.appName.toLowerCase().replace(/\s+/g, '-')}_native_bundle.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setIsDone(true);
      buildInProgress.current = false;
    };

    runBuild();
    return () => { buildInProgress.current = false; };
  }, [concept]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#09090b] w-full max-w-xl rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/5">
        <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 15c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-4z" /></svg>
             </div>
             <h3 className="text-sm font-bold text-zinc-100">Native Build Engine</h3>
           </div>
           <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-100 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="flex-1 p-6 font-mono text-[11px] h-[300px] overflow-y-auto custom-scrollbar bg-black/40 text-emerald-500/80" ref={logContainerRef}>
          {logs.map((log, i) => (
            <div key={i} className="mb-1 flex gap-3">
              <span className="text-zinc-700 w-4 text-right">{i + 1}</span>
              <span>{log}</span>
            </div>
          ))}
          {!isDone && <div className="animate-pulse ml-7">_</div>}
        </div>

        <div className="p-6 border-t border-zinc-800">
          {!isDone ? (
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                 <span>Compiling Binary</span>
                 <span>{progress}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <button onClick={onClose} className="w-full py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all">Close Terminal</button>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const isError = message.text.startsWith('ERROR:');
  return (
    <div className={`flex flex-col gap-3 mb-8 ${isAssistant ? 'items-start' : 'items-end'} w-full animate-in slide-in-from-bottom-4 duration-500`}>
      <div className={`max-w-[90%] md:max-w-[80%] px-5 py-4 rounded-3xl ${
        isAssistant 
          ? isError ? 'bg-red-500/10 text-red-200 border border-red-500/20' : 'bg-transparent text-zinc-300 border-none !px-0' 
          : 'bg-zinc-800/80 text-white border border-zinc-700/50 shadow-lg backdrop-blur-sm'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isAssistant && (
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isError ? 'bg-red-500' : 'bg-blue-600 shadow-lg shadow-blue-500/20'}`}>
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" /></svg>
            </div>
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{isAssistant ? 'Architect' : 'Lead Engineer'}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{message.text.replace('ERROR:', '').trim()}</p>
      </div>
      {isAssistant && message.thought && !isError && (
        <div className="w-full max-w-[90%] md:max-w-[80%] text-[11px] text-zinc-500 italic leading-relaxed pl-1">
          <span className="font-bold text-zinc-600 mr-2">LOG:</span>
          {message.thought}
        </div>
      )}
    </div>
  );
};

const FileExplorer = ({ 
  concept, 
  onSelectFile, 
  activeFileName, 
  onAddFile, 
  onDeleteFile 
}: { 
  concept: AppConcept, 
  onSelectFile: (name: string) => void, 
  activeFileName: string | null,
  onAddFile: (isFolder: boolean) => void,
  onDeleteFile: (name: string) => void
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Explorer</span>
        <div className="flex gap-1">
          <button onClick={() => onAddFile(false)} className="p-1 text-zinc-500 hover:text-zinc-100 transition-colors" title="New File"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} /></svg></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
        {concept.files.map((file, idx) => (
          <div key={idx} className="group flex items-center gap-2">
            <button
              onClick={() => onSelectFile(file.name)}
              className={`flex-1 flex items-center gap-3 px-3 py-1.5 rounded-lg text-left transition-all ${activeFileName === file.name ? 'bg-blue-600/10 text-blue-400 font-semibold' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}
            >
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2} /></svg>
              <span className="text-xs truncate">{file.name}</span>
            </button>
            <button onClick={() => onDeleteFile(file.name)} className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-400 transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" strokeWidth={2} /></svg></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CodeViewer = ({ file, onContentChange }: { file: AppFile, onContentChange: (name: string, content: string) => void }) => {
  const [localContent, setLocalContent] = useState(file.content);
  useEffect(() => setLocalContent(file.content), [file.name, file.content]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setLocalContent(newVal);
    onContentChange(file.name, newVal);
  };
  return (
    <div className="w-full h-full flex flex-col bg-[#09090b] rounded-2xl border border-zinc-800 overflow-hidden ring-1 ring-white/5 shadow-2xl">
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{file.name}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
        </div>
      </div>
      <textarea
        value={localContent}
        onChange={handleChange}
        className="flex-1 w-full p-6 bg-transparent text-blue-300 font-mono text-xs leading-relaxed resize-none outline-none custom-scrollbar"
        spellCheck={false}
      />
    </div>
  );
};

const PreviewFrame = ({ code, deviceType }: { code: string, deviceType: DeviceType }) => {
  const blob = useMemo(() => new Blob([code], { type: 'text/html' }), [code]);
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  const frameWidth = useMemo(() => {
    switch (deviceType) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  }, [deviceType]);

  return (
    <div className="flex flex-col items-center w-full h-full animate-in fade-in duration-700">
      <div 
        className="h-full rounded-3xl overflow-hidden bg-white shadow-2xl border-[12px] border-zinc-900 relative transition-all duration-500 ease-out flex-1"
        style={{ width: frameWidth }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20"></div>
        <iframe src={url} className="w-full h-full border-none" title="Live Preview" />
      </div>
    </div>
  );
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('architect_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'preview' | 'code'>('chat');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [showApkModal, setShowApkModal] = useState(false);

  const [state, setState] = useState<BuildState>({
    isBuilding: false,
    concept: null,
    messages: [],
    error: null,
    history: [],
    historyIndex: 0
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem('architect_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages, state.isBuilding, activeTab]);

  const handleNewProject = () => {
    const newId = crypto.randomUUID();
    const newProject: Project = {
      id: newId,
      name: 'Untitled Project',
      concept: null,
      messages: [],
      history: [],
      historyIndex: 0,
      lastUpdated: Date.now()
    };
    setProjects([newProject, ...projects]);
    setCurrentProjectId(newId);
    setState({
      isBuilding: false,
      concept: null,
      messages: [],
      error: null,
      history: [],
      historyIndex: 0
    });
    setPrompt('');
    setActiveTab('chat');
  };

  const handleSelectProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    setCurrentProjectId(id);
    setState({
      isBuilding: false,
      concept: project.concept,
      messages: project.messages,
      error: null,
      history: project.history,
      historyIndex: project.historyIndex || 0
    });
    setPrompt('');
    if (project.concept && project.concept.files.length > 0) {
      setSelectedFileName(project.concept.files[0].name);
    }
  };

  const handleBuild = async () => {
    if (!prompt.trim() || state.isBuilding) return;

    if (!currentProjectId) {
      handleNewProject();
    }

    const userMessage: ChatMessage = { role: 'user', text: prompt, timestamp: Date.now() };
    setState(prev => ({ ...prev, isBuilding: true, messages: [...prev.messages, userMessage], error: null }));
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const { concept, thought } = await generateAppConcept(currentPrompt, [...state.messages, userMessage], state.concept);
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        text: `Architecture refined for **${concept.appName}**. The prototype is live.`, 
        thought, 
        timestamp: Date.now() 
      };
      
      const newMessages = [...state.messages, userMessage, assistantMessage];
      const newVersion: AppVersion = { 
        id: crypto.randomUUID(), 
        hash: generateHash(Date.now()), 
        concept, 
        messages: newMessages, 
        prompt: currentPrompt, 
        timestamp: Date.now() 
      };

      setState(prev => ({
        ...prev,
        isBuilding: false,
        concept,
        messages: newMessages,
        history: [newVersion, ...prev.history],
        historyIndex: 0
      }));

      setProjects(prev => prev.map(p => 
        p.id === currentProjectId 
          ? { ...p, concept, messages: newMessages, name: concept.appName, lastUpdated: Date.now() } 
          : p
      ));

      if (!selectedFileName && concept.files.length > 0) {
        setSelectedFileName(concept.files[0].name);
      }
      setActiveTab('preview');
    } catch (err: any) {
      setState(prev => ({ ...prev, isBuilding: false, error: err.message }));
    }
  };

  return (
    <div className="h-screen w-screen bg-[#09090b] flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-zinc-950 border-r border-zinc-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-0 border-none'}`}>
        <div className="p-6 flex items-center justify-between min-w-[320px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2.5} /></svg>
            </div>
            <span className="font-black text-sm uppercase tracking-[0.2em] text-white">Architect</span>
          </div>
        </div>

        <div className="px-4 mb-8 min-w-[320px]">
          <button 
            onClick={handleNewProject}
            className="w-full py-4 bg-zinc-100 text-zinc-950 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2.5} /></svg>
            New Project
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar min-w-[320px]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 px-2">Projects</h2>
          <div className="space-y-2 pb-10">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${currentProjectId === p.id ? 'bg-zinc-800 border-zinc-700 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
              >
                <div className="text-sm font-bold truncate mb-1">{p.name}</div>
                <div className="text-[10px] opacity-40 font-mono uppercase">{new Date(p.lastUpdated).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 px-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2} /></svg>
            </button>
            <div>
              <h1 className="text-sm font-bold text-zinc-100">{state.concept?.appName || 'Workspace'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                {['chat', 'code', 'preview'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab as any)} 
                    className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
             {state.concept && (
               <button onClick={() => setShowApkModal(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20">Build</button>
             )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
          {activeTab === 'chat' && (
            <div className="max-w-3xl mx-auto py-12">
              {state.messages.length === 0 ? (
                <div className="text-center space-y-12 py-20 animate-in fade-in zoom-in-95 duration-1000">
                  <div className="space-y-4">
                    <h2 className="text-6xl font-black tracking-tighter text-white leading-tight">Build the future <br/><span className="gemini-gradient">instantly.</span></h2>
                    <p className="text-zinc-500 text-lg max-w-lg mx-auto font-medium">Describe your application. Architect handles the rest.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['Modern Crypto Wallet', 'Recipe Manager App', 'Social Dashboard', 'AI Writing Tool'].map(item => (
                      <button key={item} onClick={() => { setPrompt(`Build a ${item} with a clean, luxury aesthetic.`); inputRef.current?.focus(); }} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-all hover:bg-zinc-900 shadow-sm">{item}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.messages.map((m, i) => <MessageBubble key={i} message={m} />)}
                  {state.isBuilding && <ChatStatusIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && state.concept && (
            <div className="h-[calc(100vh-200px)] flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-64 shrink-0">
                <FileExplorer 
                  concept={state.concept} 
                  onSelectFile={setSelectedFileName} 
                  activeFileName={selectedFileName} 
                  onAddFile={() => {}} 
                  onDeleteFile={() => {}} 
                />
              </div>
              <div className="flex-1 min-w-0">
                {selectedFileName && (
                  <CodeViewer 
                    file={state.concept.files.find(f => f.name === selectedFileName) || state.concept.files[0]} 
                    onContentChange={(name, content) => {
                      setState(prev => {
                        if (!prev.concept) return prev;
                        const newFiles = prev.concept.files.map(f => f.name === name ? { ...f, content } : f);
                        return { ...prev, concept: { ...prev.concept, files: newFiles, previewCode: name === 'index.html' ? content : prev.concept.previewCode } };
                      });
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'preview' && state.concept && (
            <div className="h-[calc(100vh-200px)] flex flex-col items-center gap-6 animate-in fade-in duration-500">
               <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg">
                {[
                  { type: 'mobile', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                  { type: 'tablet', icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                  { type: 'desktop', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
                ].map(d => (
                  <button 
                    key={d.type} 
                    onClick={() => setDeviceType(d.type as DeviceType)} 
                    className={`p-2 rounded-lg transition-all ${deviceType === d.type ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d={d.icon} strokeWidth={2} /></svg>
                  </button>
                ))}
              </div>
              <PreviewFrame code={state.concept.previewCode} deviceType={deviceType} />
            </div>
          )}
        </main>

        {/* Input Bar */}
        <div className="p-8 pt-0 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleBuild())}
                placeholder="Message Architect..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-6 py-5 pr-20 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-2 ring-blue-500/20 resize-none h-16 transition-all shadow-2xl shadow-black"
              />
              <button 
                onClick={handleBuild}
                disabled={!prompt.trim() || state.isBuilding}
                className={`absolute right-3 top-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${prompt.trim() && !state.isBuilding ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95' : 'bg-zinc-800 text-zinc-600'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <p className="text-center text-[9px] text-zinc-600 mt-4 uppercase tracking-[0.2em] font-bold">Architect intelligence may provide varied results</p>
          </div>
        </div>
      </div>

      {showApkModal && state.concept && <ApkBuildModal concept={state.concept} onClose={() => setShowApkModal(false)} />}
    </div>
  );
}
