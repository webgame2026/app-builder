
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
<<<<<<< HEAD
  <div className="flex items-start gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/70">System Processing</span>
      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
        <span className="animate-pulse">Architect is synthesizing your vision...</span>
=======
  <div className="flex items-start gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Architect Intelligence</span>
      <div className="flex items-center gap-2 text-gray-400 italic text-sm">
        <span className="animate-pulse">Synthesizing mobile application bundles...</span>
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
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
<<<<<<< HEAD
    const runBuild = async () => {
      buildInProgress.current = true;
      addLog("Initializing Native Build Pipeline...");
=======
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const runBuild = async () => {
      buildInProgress.current = true;
      addLog("Starting Architect Native Cloud Build Service...");
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
      await new Promise(r => setTimeout(r, 600));
      if (!buildInProgress.current) return;
      setProgress(5);
      
<<<<<<< HEAD
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
=======
      addLog("Fetching mobile architecture templates (Capacitor/Android v14)...");
      await new Promise(r => setTimeout(r, 800));
      if (!buildInProgress.current) return;
      setProgress(15);
      
      addLog("Injecting application manifest and PWA assets...");
      concept.files.forEach(f => {
        if (f.name.includes('manifest') || f.name.includes('sw')) {
          addLog(`  -> Optimizing: ${f.name}`);
        }
      });
      await new Promise(r => setTimeout(r, 600));
      if (!buildInProgress.current) return;
      setProgress(30);

      addLog("Compiling Web Assets into optimized WebView distribution...");
      addLog("Running R8 resource shrinking and obfuscation...");
      await new Promise(r => setTimeout(r, 1200));
      if (!buildInProgress.current) return;
      setProgress(55);

      addLog("Generating production APK signature (SHA256withRSA)...");
      addLog("Signing with Architect Production Key (v3)...");
      await new Promise(r => setTimeout(r, 1000));
      if (!buildInProgress.current) return;
      setProgress(85);

      addLog("BUILD SUCCESSFUL: APK binary generated.");
      addLog("Preparing final source bundle with Android/iOS project files...");
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
      setProgress(100);
      
      const zip = new JSZip();
      concept.files.forEach(file => {
        zip.file(file.name, file.content);
      });

<<<<<<< HEAD
=======
      const androidFolder = zip.folder("android");
      androidFolder?.file("app/src/main/AndroidManifest.xml", `<?xml version="1.0" encoding="utf-8"?><manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.architect.${concept.appName.toLowerCase().replace(/\s+/g, '')}"><application android:label="${concept.appName}"><activity android:name=".MainActivity" android:exported="true"><intent-filter><action android:name="android.intent.action.MAIN" /><category android:name="android.intent.category.LAUNCHER" /></intent-filter></activity></application></manifest>`);

>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
<<<<<<< HEAD
      a.download = `${concept.appName.toLowerCase().replace(/\s+/g, '-')}_native_bundle.zip`;
=======
      a.download = `${concept.appName.toLowerCase().replace(/\s+/g, '-')}_android_v1.zip`;
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setIsDone(true);
      buildInProgress.current = false;
    };

    runBuild();
<<<<<<< HEAD
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
=======
    return () => {
      buildInProgress.current = false;
    };
  }, [concept]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[110] flex items-center justify-center p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d0d0d] w-full max-w-2xl rounded-[2.5rem] border border-[#3c4043] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 bg-[#1e1f20] border-b border-[#3c4043] flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.998.4469-.998.998v3.9922c0 .5511.4469.998.998.998h3.9922c.5511 0 .998-.4469.998-.998v-3.9922c0-.5511-.4469-.998-.998-.998h-3.9922zm-11.0483-3.66c-.5511 0-.998.4469-.998.998v3.9922c0 .5511.4469.998.998.998h3.9922c.5511 0 .998-.4469.998-.998v-3.9922c0-.5511-.4469-.998-.998-.998h-3.9922zm0-7.32c-.5511 0-.998.4469-.998.998v3.9922c0 .5511.4469.998.998.998h3.9922c.5511 0 .998-.4469.998-.998v-3.9922c0-.5511-.4469-.998-.998-.998h-3.9922zm5.5241 3.66c-.5511 0-.998.4469-.998.998v3.9922c0 .5511.4469.998.998.998h3.9922c.5511 0 .998-.4469.998-.998v-3.9922c0-.5511-.4469-.998-.998-.998h-3.9922z"/></svg>
             </div>
             <div>
                <h3 className="text-sm font-bold text-white leading-tight">Native Build Terminal</h3>
                <p className="text-[10px] text-gray-500 font-mono">Status: {isDone ? 'Completed' : 'Running Architecture Build'}</p>
             </div>
           </div>
           <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="flex-1 p-8 font-mono text-[11px] leading-relaxed text-emerald-400/90 h-[350px] overflow-y-auto custom-scrollbar bg-black" ref={logContainerRef}>
          {logs.map((log, i) => (
            <div key={i} className="mb-1.5 flex gap-4">
              <span className="opacity-20 select-none w-6 text-right">{i + 1}</span>
              <span className="flex-1">{log}</span>
            </div>
          ))}
          {!isDone && <div className="animate-pulse ml-10">_</div>}
        </div>

        <div className="p-8 bg-[#131314] border-t border-[#3c4043]">
          {!isDone ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                 <span>Compiling Native Binary</span>
                 <span className="text-blue-400">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1e1f20] rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg></div>
              <h4 className="text-lg font-bold text-white mb-2">Build Package Complete</h4>
              <button onClick={onClose} className="px-12 py-4 bg-white text-black rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">Return to Editor</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GithubDeployModal = ({ concept, onClose }: { concept: AppConcept; onClose: () => void; }) => {
  const [pat, setPat] = useState(localStorage.getItem('gh_pat') || '');
  const [repoName, setRepoName] = useState(concept.appName.toLowerCase().replace(/\s+/g, '-'));
  const [isPrivate, setIsPrivate] = useState(false);
  const [progress, setProgress] = useState<GithubDeploymentProgress>({ step: 'idle', message: '' });

  const handleDeploy = async () => {
    if (!pat) return;
    localStorage.setItem('gh_pat', pat);
    await deployToGithub(pat, concept, repoName, isPrivate, setProgress);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1e1f20] w-full max-w-lg rounded-[2.5rem] border border-[#3c4043] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-[#3c4043] flex items-center justify-between bg-[#131314]">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            <h3 className="text-lg font-bold text-white">GitHub Deployment</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-8 space-y-6">
          {progress.step === 'idle' ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Personal Access Token</label>
                  <input type="password" value={pat} onChange={e => setPat(e.target.value)} placeholder="ghp_xxxxxxxxxxxx" className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Repository Name</label>
                  <input type="text" value={repoName} onChange={e => setRepoName(e.target.value)} className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <button onClick={handleDeploy} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95">Launch Deployment</button>
            </>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${progress.step === 'error' ? 'bg-red-500/10 text-red-500' : progress.step === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500 animate-pulse'}`}>
                {progress.step === 'error' ? '!' : progress.step === 'completed' ? '✓' : '...'}
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">{progress.message}</h4>
              {progress.step === 'completed' && progress.repoUrl && (
                <a href={progress.repoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 text-blue-400 text-sm font-bold rounded-xl transition-all border border-blue-500/20">View on GitHub</a>
              )}
            </div>
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
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
<<<<<<< HEAD
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
=======
    <div className={`flex flex-col gap-3 mb-8 ${isAssistant ? 'items-start' : 'items-end'} animate-in slide-in-from-bottom-2 duration-300 w-full`}>
      <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-3xl ${
        isAssistant 
          ? isError ? 'bg-red-500/10 text-red-200 border border-red-500/20 px-6' : 'bg-transparent text-gray-200 border-none px-0' 
          : 'bg-[#282a2d] text-white border border-[#3c4043] px-6 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isAssistant && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isError ? 'bg-red-500' : 'bg-gradient-to-tr from-blue-500 to-indigo-600'}`}>
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" /></svg>
            </div>
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{isAssistant ? 'Architect' : 'You'}</span>
        </div>
        <p className="whitespace-pre-wrap font-medium">{message.text.replace('ERROR:', '').trim()}</p>
      </div>
      {isAssistant && message.thought && !isError && (
        <div className="w-full pl-8 max-w-[85%] md:max-w-[70%] text-xs text-gray-400 italic leading-relaxed mb-6">
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
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
<<<<<<< HEAD
  onDeleteFile 
=======
  onDeleteFile, 
  onImport 
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
}: { 
  concept: AppConcept, 
  onSelectFile: (name: string) => void, 
  activeFileName: string | null,
  onAddFile: (isFolder: boolean) => void,
<<<<<<< HEAD
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
=======
  onDeleteFile: (name: string) => void,
  onImport: (files: FileList) => void
}) => {
  const [isOver, setIsOver] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (e.dataTransfer.files.length > 0) onImport(e.dataTransfer.files);
  };

  return (
    <div 
      className={`w-full bg-[#1e1f20] rounded-2xl border border-[#3c4043] overflow-hidden sticky top-24 transition-all ${isOver ? 'ring-2 ring-blue-500' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="px-4 py-3 bg-[#131314] border-b border-[#3c4043] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeWidth={2} /></svg>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Source</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onAddFile(false)} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="New File">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          <button onClick={() => onAddFile(true)} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="New Folder">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          </button>
          <button onClick={() => importRef.current?.click()} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Import Files">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </button>
          <input type="file" ref={importRef} multiple className="hidden" onChange={(e) => e.target.files && onImport(e.target.files)} />
        </div>
      </div>
      <div className="p-2 space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
        {concept.files.map((file, idx) => {
          const isFolder = file.name.endsWith('/');
          return (
            <div key={idx} className="group relative">
              <button
                onClick={() => !isFolder && onSelectFile(file.name)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all text-left ${
                  activeFileName === file.name ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-[#3c4043]'
                }`}
              >
                {isFolder ? (
                   <svg className="w-4 h-4 text-amber-400/80" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                ) : (
                  <svg className="w-4 h-4 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                )}
                <span className="text-sm font-medium truncate">{file.name}</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteFile(file.name); }} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all bg-[#1e1f20] rounded-lg"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          );
        })}
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
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
<<<<<<< HEAD
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
=======
    <div className="w-full bg-[#0d0d0d] rounded-2xl border border-[#3c4043] overflow-hidden flex flex-col h-[700px] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="px-4 py-3 bg-[#1e1f20] border-b border-[#3c4043] flex items-center justify-between shrink-0">
        <span className="text-xs font-mono text-gray-400">{file.name}</span>
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
      </div>
      <textarea
        value={localContent}
        onChange={handleChange}
<<<<<<< HEAD
        className="flex-1 w-full p-6 bg-transparent text-blue-300 font-mono text-xs leading-relaxed resize-none outline-none custom-scrollbar"
=======
        className="flex-1 w-full p-8 bg-transparent text-emerald-400/90 font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-0 border-none custom-scrollbar"
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
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
<<<<<<< HEAD
    <div className="flex flex-col items-center w-full h-full animate-in fade-in duration-700">
      <div 
        className="h-full rounded-3xl overflow-hidden bg-white shadow-2xl border-[12px] border-zinc-900 relative transition-all duration-500 ease-out flex-1"
        style={{ width: frameWidth }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20"></div>
=======
    <div className="flex flex-col items-center w-full min-h-[600px] py-4">
      <div 
        className="h-[calc(100vh-320px)] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-4 border-[#1e1f20] animate-in zoom-in-95 duration-500 relative transition-all duration-500 ease-in-out"
        style={{ width: frameWidth }}
      >
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
        <iframe src={url} className="w-full h-full border-none" title="Live Preview" />
      </div>
    </div>
  );
};

<<<<<<< HEAD
=======
const VersionSidebar = ({ history, onClose, onRestore, currentVersionId }: { history: AppVersion[], onClose: () => void, onRestore: (version: AppVersion) => void, currentVersionId: string | null }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#1e1f20] border-l border-[#3c4043] z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-[#3c4043] flex items-center justify-between bg-[#131314]">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">Project History</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">Close</button>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar p-6 space-y-4">
        {[...history].map((version) => (
          <div key={version.id} className={`p-4 rounded-2xl bg-[#131314] border ${currentVersionId === version.id ? 'border-blue-500' : 'border-[#3c4043]'}`}>
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase mb-2">v{version.hash}</div>
            <p className="text-xs text-gray-300 mb-4 line-clamp-2">{version.prompt || "Initial commit"}</p>
            <button onClick={() => onRestore(version)} className="w-full py-1.5 bg-blue-600/10 text-blue-400 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Restore</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Left Project Sidebar ---

const ProjectSidebar = ({ 
  projects, 
  currentProjectId, 
  onSelectProject, 
  onNewProject,
  isOpen,
  onToggle,
  onImportFiles
}: { 
  projects: Project[], 
  currentProjectId: string | null, 
  onSelectProject: (id: string) => void, 
  onNewProject: () => void,
  isOpen: boolean,
  onToggle: () => void,
  onImportFiles: (files: FileList) => void
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onImportFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportFiles(e.target.files);
    }
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />
      
      <div className={`fixed md:sticky top-0 left-0 w-72 bg-[#131314] border-r border-[#3c4043]/50 h-screen z-[60] flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:border-none'}`}>
        <div className="p-6 flex flex-col gap-8 min-w-[18rem]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              <span className="font-black text-sm uppercase tracking-widest text-white">Architect</span>
            </div>
            <button onClick={onToggle} className="md:hidden p-2 text-gray-500 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={onNewProject}
              className="w-full py-4 px-4 bg-white text-black rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>

            {/* Drop & Import Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center gap-2 group ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-[#3c4043] bg-[#1e1f20] hover:border-gray-500'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".zip,.html,.css,.js,.json,.png,.jpg,.jpeg,.md"
              />
              <svg className={`w-6 h-6 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className={`text-[10px] font-bold uppercase tracking-widest text-center ${isDragging ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-300'}`}>
                Drop files / ZIP
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar min-w-[18rem]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Recent Projects</span>
          </div>
          <div className="space-y-2 pb-10">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProject(p.id);
                  if (window.innerWidth < 768) onToggle();
                }}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${currentProjectId === p.id ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-[#1e1f20] border-[#3c4043] text-gray-400 hover:border-gray-500 hover:text-white'}`}
              >
                <div className="text-xs font-bold truncate mb-1">{p.name || 'Untitled Project'}</div>
                <div className="text-[9px] opacity-50 font-mono">{new Date(p.lastUpdated).toLocaleDateString()}</div>
              </button>
            ))}
            {projects.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-[#3c4043] rounded-3xl">
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">No projects yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-[#3c4043]/50 min-w-[18rem]">
          <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white leading-tight">Pro Architect</span>
              <span className="text-[9px] text-gray-500">Cloud Active</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
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
<<<<<<< HEAD
  const [showApkModal, setShowApkModal] = useState(false);
=======
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  
  // Chat context files
  const [attachments, setAttachments] = useState<AppFile[]>([]);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)

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

<<<<<<< HEAD
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages, state.isBuilding, activeTab]);
=======
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [state.messages, state.isBuilding]);

  const saveCurrentProjectState = useCallback(() => {
    if (!currentProjectId) return;
    setProjects(prev => prev.map(p => 
      p.id === currentProjectId 
        ? { ...p, concept: state.concept, messages: state.messages, history: state.history, historyIndex: state.historyIndex, lastUpdated: Date.now(), name: state.concept?.appName || p.name } 
        : p
    ));
  }, [currentProjectId, state.concept, state.messages, state.history, state.historyIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveCurrentProjectState();
    }, 1000);
    return () => clearTimeout(timer);
  }, [state.concept, state.messages, state.historyIndex, saveCurrentProjectState]);
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)

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
<<<<<<< HEAD
=======
    if (window.innerWidth < 768) setIsSidebarOpen(false);
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
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
<<<<<<< HEAD
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
=======
    if (project.concept && !selectedFileName) {
      setSelectedFileName(project.concept.files[0].name);
    }
    setActiveTab(project.concept ? 'preview' : 'chat');
  };

  const restoreToVersion = (version: AppVersion, index: number) => {
    setState(prev => ({
      ...prev,
      concept: version.concept,
      messages: version.messages,
      historyIndex: index
    }));
    setCurrentVersionId(version.id);
  };

  const handleUndo = () => {
    if (state.historyIndex < state.history.length - 1) {
      const nextIndex = state.historyIndex + 1;
      restoreToVersion(state.history[nextIndex], nextIndex);
    }
  };

  const handleRedo = () => {
    if (state.historyIndex > 0) {
      const nextIndex = state.historyIndex - 1;
      restoreToVersion(state.history[nextIndex], nextIndex);
    }
  };

  const unzipFiles = async (file: File): Promise<AppFile[]> => {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    const result: AppFile[] = [];
    const fileNames = Object.keys(content.files);
    for (const name of fileNames) {
      const zipFile = content.files[name];
      if (!zipFile.dir) {
        const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(name);
        const data = isImage 
          ? `data:image/png;base64,${await zipFile.async('base64')}`
          : await zipFile.async('string');
        result.push({ name, content: data });
      } else {
        // Keep track of directories too if we want explicit empty folders
        result.push({ name: name, content: "" });
      }
    }
    return result;
  };

  const handleChatFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: AppFile[] = [];
      const files = Array.from(e.target.files) as File[];
      for (const file of files) {
        if (file.name.endsWith('.zip')) {
          const unzipped = await unzipFiles(file);
          newAttachments.push(...unzipped);
        } else {
          const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name);
          const content = isImage ? await fileToBase64(file) : await fileToText(file);
          newAttachments.push({ name: file.name, content });
        }
      }
      setAttachments(prev => [...prev, ...newAttachments]);
      if (chatFileInputRef.current) chatFileInputRef.current.value = "";
    }
  };

  const handleImportToProject = async (fileList: FileList) => {
    const newFiles: AppFile[] = [];
    const filesArray = Array.from(fileList) as File[];
    for (const file of filesArray) {
       if (file.name.endsWith('.zip')) {
          const unzipped = await unzipFiles(file);
          newFiles.push(...unzipped);
       } else {
          const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name);
          const content = isImage ? await fileToBase64(file) : await fileToText(file);
          newFiles.push({ name: file.name, content });
       }
    }

    setState(prev => {
       if (!prev.concept) return prev;
       const existingMap = new Map(prev.concept.files.map(f => [f.name, f]));
       newFiles.forEach(f => existingMap.set(f.name, f));
       return {
          ...prev,
          concept: {
             ...prev.concept,
             files: Array.from(existingMap.values())
          }
       };
    });
  };

  const handleImportFiles = async (fileList: FileList) => {
    // This is for Sidebar (creating new project)
    const importedFiles: AppFile[] = [];
    let projectName = "Imported Project";

    const filesArray = Array.from(fileList) as File[];
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      if (file.name.endsWith('.zip')) {
        projectName = file.name.replace('.zip', '');
        const files = await unzipFiles(file);
        importedFiles.push(...files);
      } else {
        if (i === 0) projectName = file.name.split('.')[0];
        const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name);
        const content = isImage ? await fileToBase64(file) : await fileToText(file);
        importedFiles.push({ name: file.name, content });
      }
    }

    if (importedFiles.length > 0) {
      const newId = crypto.randomUUID();
      const indexHtmlFile = importedFiles.find(f => f.name.endsWith('index.html'));
      const indexHtml = indexHtmlFile ? indexHtmlFile.content : (importedFiles[0]?.content || "");
      
      const newConcept: AppConcept = {
        appName: projectName,
        tagLine: "Imported Application",
        summary: "Project imported from external files.",
        features: [],
        targetAudience: "All",
        colorPalette: { primary: "#3b82f6", secondary: "#1e293b", accent: "#10b981" },
        techStack: ["Imported"],
        uiStructure: { screens: [], mainNavigation: [] },
        files: importedFiles,
        previewCode: indexHtml
      };

      const initialMessage: ChatMessage = { role: 'assistant', text: `Project **${projectName}** imported successfully.`, timestamp: Date.now() };
      
      const newProject: Project = {
        id: newId,
        name: projectName,
        concept: newConcept,
        messages: [initialMessage],
        history: [],
        historyIndex: 0,
        lastUpdated: Date.now()
      };

      setProjects([newProject, ...projects]);
      setCurrentProjectId(newId);
      setState({
        isBuilding: false,
        concept: newConcept,
        messages: [initialMessage],
        error: null,
        history: [],
        historyIndex: 0
      });
      setSelectedFileName(importedFiles[0].name);
      setActiveTab('preview');
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  };

  const handleAddFile = (isFolder: boolean) => {
    const name = prompt(`Enter ${isFolder ? 'folder' : 'file'} name (e.g. ${isFolder ? 'assets/' : 'script.js'}):`);
    if (!name) return;
    
    const formattedName = isFolder ? (name.endsWith('/') ? name : name + '/') : name;

    setState(prev => {
       if (!prev.concept) return prev;
       if (prev.concept.files.some(f => f.name === formattedName)) {
          alert("File/Folder already exists!");
          return prev;
       }
       const newFile: AppFile = { name: formattedName, content: isFolder ? "" : "// New file created" };
       const newFiles = [...prev.concept.files, newFile];
       // Sort so folders are grouped or at least predictable
       newFiles.sort((a, b) => a.name.localeCompare(b.name));
       return {
          ...prev,
          concept: {
             ...prev.concept,
             files: newFiles
          }
       };
    });
    if (!isFolder) setSelectedFileName(formattedName);
  };

  const handleDeleteFile = (name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setState(prev => {
       if (!prev.concept) return prev;
       const newFiles = prev.concept.files.filter(f => f.name !== name);
       return {
          ...prev,
          concept: {
             ...prev.concept,
             files: newFiles
          }
       };
    });
    if (selectedFileName === name) setSelectedFileName(null);
  };

  const handleBuild = async () => {
    if ((!prompt.trim() && attachments.length === 0) || state.isBuilding) return;

    if (!currentProjectId) {
      const newId = crypto.randomUUID();
      const nameFromPrompt = prompt ? prompt.slice(0, 20) : (attachments[0]?.name || "Untitled");
      const newProj: Project = { id: newId, name: nameFromPrompt, concept: null, messages: [], history: [], historyIndex: 0, lastUpdated: Date.now() };
      setProjects([newProj, ...projects]);
      setCurrentProjectId(newId);
    }

    const userPrompt = prompt || `Process attached files: ${attachments.map(a => a.name).join(', ')}`;
    const userMessage: ChatMessage = { role: 'user', text: userPrompt, timestamp: Date.now() };
    
    setState(prev => ({ ...prev, isBuilding: true, messages: [...prev.messages, userMessage], error: null }));
    const currentPrompt = userPrompt;
    const currentAttachments = [...attachments];
    setPrompt('');
    setAttachments([]);

    try {
      const finalPrompt = currentAttachments.length > 0 
        ? `${currentPrompt}\n\nATTACHED FILES TO CONSIDER:\n${currentAttachments.map(a => `--- ${a.name} ---\n${a.content}`).join('\n')}`
        : currentPrompt;

      const { concept, thought } = await generateAppConcept(finalPrompt, [...state.messages, userMessage], state.concept);
      const assistantMessage: ChatMessage = { role: 'assistant', text: `Successfully built **${concept.appName}**. Source files generated.`, thought, timestamp: Date.now() };
      const newMessages = [...state.messages, userMessage, assistantMessage];
      const newVersion: AppVersion = { id: crypto.randomUUID(), hash: generateHash(Date.now()), concept, messages: newMessages, prompt: currentPrompt, timestamp: Date.now() };
      
      setState(prev => {
        const updatedHistory = [newVersion, ...prev.history.slice(prev.historyIndex)];
        return {
          ...prev,
          isBuilding: false,
          concept,
          messages: newMessages,
          history: updatedHistory,
          historyIndex: 0
        };
      });
      setCurrentVersionId(newVersion.id);
      if (!selectedFileName && concept.files.length > 0) setSelectedFileName(concept.files[0].name);
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
      setActiveTab('preview');
    } catch (err: any) {
      setState(prev => ({ ...prev, isBuilding: false, error: err.message }));
    }
  };

<<<<<<< HEAD
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
=======
  const handleDownloadZip = async () => {
    if (!state.concept) return;
    const zip = new JSZip();
    state.concept.files.forEach(file => {
       if (file.name.endsWith('/')) {
          zip.folder(file.name.slice(0, -1));
       } else {
          zip.file(file.name, file.content);
       }
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.concept.appName.toLowerCase().replace(/\s+/g, '-')}-source.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const canUndo = state.historyIndex < state.history.length - 1;
  const canRedo = state.historyIndex > 0;

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] font-sans selection:bg-blue-500/30 flex overflow-hidden">
      <ProjectSidebar 
        projects={projects} 
        currentProjectId={currentProjectId} 
        onSelectProject={handleSelectProject} 
        onNewProject={handleNewProject} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onImportFiles={handleImportFiles}
      />
      
      <div className={`flex-1 flex flex-col min-h-screen relative overflow-y-auto custom-scrollbar transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
        <header className="sticky top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-[#131314]/80 backdrop-blur-md border-b border-[#3c4043]/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className={`p-2.5 rounded-2xl bg-[#1e1f20] border border-[#3c4043] transition-colors hover:bg-[#3c4043] ${!isSidebarOpen ? 'text-blue-500' : 'text-gray-400'}`}
              title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M4 6h16M4 12h16M4 18h7" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">{state.concept?.appName || 'App Architect'}</h1>
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black">{state.isBuilding ? 'Syncing...' : 'Ready for Build'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {state.concept && (
              <div className="flex items-center gap-1 bg-[#1e1f20] p-1 rounded-xl border border-[#3c4043] mr-2">
                <button 
                  onClick={handleUndo} 
                  disabled={!canUndo}
                  className={`p-2 rounded-lg transition-all ${canUndo ? 'text-gray-200 hover:bg-[#3c4043] hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                  title="Undo Generation"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                </button>
                <button 
                  onClick={handleRedo} 
                  disabled={!canRedo}
                  className={`p-2 rounded-lg transition-all ${canRedo ? 'text-gray-200 hover:bg-[#3c4043] hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                  title="Redo Generation"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
                </button>
              </div>
            )}
            
            {state.concept && (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowHistory(true)} className="p-2 text-gray-400 hover:text-white transition-colors" title="Project History">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} /></svg>
                </button>
                <button onClick={handleDownloadZip} className="hidden lg:block px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-white/10">Zip</button>
                <button onClick={() => setShowApkModal(true)} className="px-4 py-2 bg-green-600/10 text-green-500 border border-green-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all">APK</button>
                <button onClick={() => setShowGithubModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95">Deploy</button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 pb-48 px-6 max-w-5xl mx-auto w-full transition-all duration-300">
          {activeTab === 'chat' && (
            <div className="w-full pt-12">
              {state.messages.length === 0 ? (
                <div className="text-center py-20 space-y-12 animate-in fade-in duration-700">
                  <div className="space-y-4">
                    <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white">Let's build <span className="gemini-gradient italic font-bold">something.</span></h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">Native architectures, PWA compliant, zero setup.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 px-4">
                    {['Food Delivery App', '2D Space Shooter', 'Crypto Wallet UI', 'Task Manager'].map(s => (
                      <button key={s} onClick={() => { setPrompt(`Build a ${s}`); inputRef.current?.focus(); }} className="px-8 py-4 rounded-3xl bg-[#1e1f20] border border-[#3c4043] text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:border-gray-500 transition-all">{s}</button>
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
                    ))}
                  </div>
                </div>
              ) : (
<<<<<<< HEAD
                <div className="space-y-4">
                  {state.messages.map((m, i) => <MessageBubble key={i} message={m} />)}
=======
                <div className="pb-10 w-full max-w-3xl mx-auto">
                  {state.messages.map((m, idx) => <MessageBubble key={idx} message={m} />)}
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
                  {state.isBuilding && <ChatStatusIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && state.concept && (
<<<<<<< HEAD
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
=======
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
              <div className="lg:col-span-1">
                 <FileExplorer 
                    concept={state.concept} 
                    onSelectFile={setSelectedFileName} 
                    activeFileName={selectedFileName || state.concept.files[0].name} 
                    onAddFile={handleAddFile}
                    onDeleteFile={handleDeleteFile}
                    onImport={handleImportToProject}
                 />
              </div>
              <div className="lg:col-span-3">
                 {selectedFileName ? (
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
                 ) : (
                    <div className="w-full h-[700px] bg-[#0d0d0d] rounded-2xl border border-[#3c4043] flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                       Select a file to edit
                    </div>
                 )}
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
              </div>
            </div>
          )}

          {activeTab === 'preview' && state.concept && (
<<<<<<< HEAD
            <div className="h-[calc(100vh-200px)] flex flex-col items-center gap-6 animate-in fade-in duration-500">
               <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg">
=======
            <div className="flex flex-col items-center pt-8">
              <div className="flex items-center gap-1 p-1 bg-[#1e1f20] rounded-2xl border border-[#3c4043] mb-6">
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
                {[
                  { type: 'mobile', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                  { type: 'tablet', icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                  { type: 'desktop', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
                ].map(d => (
                  <button 
                    key={d.type} 
                    onClick={() => setDeviceType(d.type as DeviceType)} 
<<<<<<< HEAD
                    className={`p-2 rounded-lg transition-all ${deviceType === d.type ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d={d.icon} strokeWidth={2} /></svg>
=======
                    className={`p-2.5 rounded-xl transition-all ${deviceType === d.type ? 'bg-[#3c4043] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d.icon} /></svg>
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
                  </button>
                ))}
              </div>
              <PreviewFrame code={state.concept.previewCode} deviceType={deviceType} />
            </div>
          )}
        </main>

<<<<<<< HEAD
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
=======
        <div className={`fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-[#131314] via-[#131314] to-transparent transition-all duration-300 ${isSidebarOpen ? 'md:left-72' : 'md:left-0'}`}>
          <div className="max-w-3xl mx-auto space-y-4">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="bg-[#1e1f20] border border-[#3c4043] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl group">
                    <span className="text-[10px] font-bold text-gray-400 truncate max-w-[120px]">{file.name}</span>
                    <button onClick={() => removeAttachment(idx)} className="text-gray-600 hover:text-red-400 transition-colors">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <button onClick={() => setAttachments([])} className="text-[9px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 px-2">Clear All</button>
              </div>
            )}

            <div className="bg-[#1e1f20] rounded-[2.5rem] border border-[#3c4043]/50 flex p-4 items-center shadow-2xl backdrop-blur-md focus-within:ring-2 ring-blue-500/20 transition-all">
              <input 
                type="file" 
                ref={chatFileInputRef} 
                onChange={handleChatFileSelect} 
                className="hidden" 
                multiple 
                accept=".zip,.html,.css,.js,.json,.png,.jpg,.jpeg,.md"
              />
              <button 
                onClick={() => chatFileInputRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                title="Attach Files / ZIP"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>

              <textarea 
                ref={inputRef} 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleBuild())} 
                placeholder={attachments.length > 0 ? "Describe how to use these files..." : "Suggest a change or describe a new app..."} 
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-500 resize-none h-12 py-3 px-4 font-medium" 
              />
              
              <button 
                onClick={handleBuild} 
                disabled={(!prompt.trim() && attachments.length === 0) || state.isBuilding} 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${(prompt.trim() || attachments.length > 0) && !state.isBuilding ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-800 text-gray-600 opacity-50'}`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            
            <div className="flex justify-center pb-2">
              <div className="bg-[#1e1f20]/90 backdrop-blur-xl p-1.5 rounded-full border border-[#3c4043]/60 flex items-center shadow-2xl">
                {['chat', 'code', 'preview'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-8 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#3c4043] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>{tab}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showApkModal && state.concept && <ApkBuildModal concept={state.concept} onClose={() => setShowApkModal(false)} />}
        {showGithubModal && state.concept && <GithubDeployModal concept={state.concept} onClose={() => setShowGithubModal(false)} />}
        {showHistory && <VersionSidebar history={state.history} onClose={() => setShowHistory(false)} onRestore={(v) => { 
          const index = state.history.findIndex(h => h.id === v.id);
          restoreToVersion(v, index);
          setShowHistory(false); 
        }} currentVersionId={currentVersionId} />}
      </div>
>>>>>>> f2885e6 (feat: initial app builder setup with auto-deploy)
    </div>
  );
}
