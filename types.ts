
export interface AppFile {
  name: string;
  content: string;
}

export interface AppConcept {
  appName: string;
  tagLine: string;
  summary: string;
  features: string[];
  targetAudience: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  techStack: string[];
  uiStructure: {
    screens: string[];
    mainNavigation: string[];
  };
  files: AppFile[];
  previewCode: string; 
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  thought?: string;
  filesUpdated?: string[];
  timestamp: number;
}

export interface AppVersion {
  id: string;
  hash: string; // Git-style short hash
  concept: AppConcept;
  messages: ChatMessage[];
  prompt: string;
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  concept: AppConcept | null;
  messages: ChatMessage[];
  history: AppVersion[];
  historyIndex: number;
  lastUpdated: number;
}

export interface BuildState {
  isBuilding: boolean;
  concept: AppConcept | null;
  messages: ChatMessage[];
  error: string | null;
  history: AppVersion[];
  historyIndex: number;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
