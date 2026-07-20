import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, BookOpen, MessageSquare, Image as ImageIcon, Volume2, 
  Play, Pause, Download, RefreshCw, ArrowRight, ArrowLeft, 
  CheckCircle, Brain, ExternalLink, FileText, Plus, Search, 
  Share2, AlertCircle, HelpCircle, GraduationCap, Code, Check, 
  Trash2, Copy, Layers, Eye, EyeOff
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; uri: string }>;
}

interface Flashcard {
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: string;
}

// Local fallback engines to run the studio completely without an API key
const getLocalChatResponse = (userInput: string): { text: string; sources?: Array<{ title: string; uri: string }> } => {
  const query = userInput.toLowerCase();
  
  if (query.includes('react') || query.includes('component')) {
    return {
      text: `### React Server Components (RSCs) & Component Design\n\nReact Server Components allow you to render components directly on the server, minimizing the bundle size sent to the client.\n\n**Key Advantages:**\n- **Zero Client Bundle Size:** Only the rendered output is streamed to the browser.\n- **Direct Backend Access:** Safely read databases or secure API credentials directly from server-side modules.\n- **Enhanced Performance:** Reduced Hydration overhead for faster Time-to-Interactive.\n\n**Example Pattern:**\n\`\`\`tsx\n// ProductList.tsx (Server Component by default)\nimport { db } from './db';\n\nexport default async function ProductList() {\n  const items = await db.query('SELECT * FROM products');\n  return (\n    <ul className="space-y-2">\n      {items.map(item => (\n        <li key={item.id} className="p-3 bg-white rounded-xl shadow-sm border">\n          {item.name} - \${item.price}\n        </li>\n      ))}\n    </ul>\n  );\n}\n\`\`\``,
      sources: [
        { title: "React Official Reference Docs", uri: "https://react.dev/reference/react/components" },
        { title: "Next.js Rendering Fundamentals", uri: "https://nextjs.org/docs/app/building-your-application/rendering/server-components" }
      ]
    };
  }

  if (query.includes('typescript') || query.includes('ts') || query.includes('roadmap')) {
    return {
      text: `### Structured TypeScript Study Roadmap\n\nHere is a comprehensive framework to transition from standard Javascript to robust TypeScript mastery:\n\n1. **Phase 1: Strong Primitives**\n   - Master explicit type annotations: \`string\`, \`number\`, \`boolean\`, \`any\`, \`unknown\`, and \`never\`.\n   - Leverage strict null checks (\`strictNullChecks: true\`).\n\n2. **Phase 2: Structured Interfaces & Custom Types**\n   - Differentiate \`type\` aliases from \`interface\` declarations (extendability vs composition).\n   - Define unions (\`A | B\`) and intersections (\`A & B\`).\n\n3. **Phase 3: Generics & Dynamic Utilities**\n   - Write reusable generic functions: \`function identity<T>(arg: T): T\`.\n   - Apply built-in utility types: \`Partial<T>\`, \`Required<T>\`, \`Readonly<T>\`, \`Pick<T, K>\`, and \`Record<K, T>\`.\n\n4. **Phase 4: Advanced Type Gymnastics**\n   - Explore conditional types (\`T extends U ? X : Y\`) and key mapping (\`[P in keyof T]\`).`,
      sources: [
        { title: "TypeScript Official Handbook", uri: "https://www.typescriptlang.org/docs/handbook/intro.html" },
        { title: "TS Evolution Updates", uri: "https://github.com/microsoft/TypeScript/wiki/Roadmap" }
      ]
    };
  }

  if (query.includes('idea') || query.includes('brainstorm') || query.includes('creative')) {
    return {
      text: `### Creative Full-Stack Studio Project Concepts\n\nHere are 3 highly scalable, creative product ideas you can build with local databases and voice technologies:\n\n1. **Aetheria: Immersive Roleplay Narrator**\n   - *Concept:* A client-side ambient narrative RPG. Generates text stories, maps visual backdrops on Canvas, and reads descriptions with distinct character voices.\n   - *Tech:* React, Dexie.js, Web Speech API, Tailwind CSS.\n\n2. **Memorise Pro: Voice-Driven Flashcard Engine**\n   - *Concept:* Learn new languages hands-free. The system reads flashcard terms aloud, listens to your response via speech recognition, and updates mastery stats automatically.\n   - *Tech:* Web Speech API, local Audio Context.\n\n3. **EchoScribe: Smart Audio Journal**\n   - *Concept:* Dictate your thoughts, summarize them with an inline LLM model, map key emotional sentiment to color themes, and export beautiful offline HTML journals.`,
      sources: [
        { title: "Web Audio API MDN Guide", uri: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" },
        { title: "IndexedDB Local Persistence", uri: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" }
      ]
    };
  }

  // Generic intelligent fallback
  return {
    text: `### Workspace Outline: "${userInput}"\n\nHere is a beautifully organized, structured summary generated by the Local Sandbox Companion:\n\n- **Core Summary:** You requested a brainstorm session about *"${userInput}"*. This topic touches on crucial software development and creative concepts.\n- **Primary Objectives:**\n  1. Define key building blocks and architectural requirements.\n  2. Establish solid local persistence models (e.g., IndexedDB or state synchronization).\n  3. Integrate rich visual asset layouts with optimized typographic tracking.\n- **Recommended Next Steps:** Explore these ideas by creating an active study deck using our **Study Deck & Flashcards** panel above, or synthesize a studio narration guide using our Voice Synth control panel.`,
    sources: [
      { title: "AI Studio Design Guidelines", uri: "https://ai.studio/build" }
    ]
  };
};

const getLocalFlashcards = (topic: string): Flashcard[] => {
  const norm = topic.toLowerCase();
  
  if (norm.includes('photosynthesis') || norm.includes('science') || norm.includes('plant')) {
    return [
      { front: "What is Photosynthesis?", back: "The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.", category: "Science" },
      { front: "Where does photosynthesis occur inside the cell?", back: "Within specialized double-membrane organelles called chloroplasts.", category: "Biology" },
      { front: "What is the primary green pigment involved?", back: "Chlorophyll, which absorbs light energy from the blue and red parts of the spectrum.", category: "Chemistry" },
      { front: "What are the light-dependent reactions products?", back: "ATP, NADPH, and molecular Oxygen (O2) released as a byproduct.", category: "Science" },
      { front: "What is the Calvin Cycle?", back: "The light-independent phase occurring in the stroma, fixing carbon dioxide into organic sugar molecules.", category: "Biology" }
    ];
  }

  if (norm.includes('api') || norm.includes('rest') || norm.includes('web') || norm.includes('design')) {
    return [
      { front: "What does REST stand for?", back: "Representational State Transfer - an architectural style for designing networked applications.", category: "Web Design" },
      { front: "What are the core HTTP request methods?", back: "GET (retrieve), POST (create), PUT (update), DELETE (remove), and PATCH (partial update).", category: "API Design" },
      { front: "What is the significance of HTTP status code 401 vs 403?", back: "401 means Unauthorized (missing credentials), whereas 403 means Forbidden (valid credentials but insufficient permissions).", category: "Security" },
      { front: "What is Idempotency in API design?", back: "A property where making multiple identical requests has the same effect as making a single request (e.g. GET, PUT, DELETE).", category: "Web Architecture" },
      { front: "What is Rate Limiting?", back: "A defensive technique to control the rate of incoming API traffic to prevent resource exhaustion.", category: "Operations" }
    ];
  }

  // Generic smart generator
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  return [
    { front: `What is the core definition of ${capitalizedTopic}?`, back: `A primary concept exploring modern software structures, architectural design models, and practical application patterns.`, category: capitalizedTopic },
    { front: `What are the typical use cases for ${capitalizedTopic}?`, back: `Creating high-performance pipelines, enabling modular code maintainability, and providing clean user-interactive controls.`, category: capitalizedTopic },
    { front: `What is the primary challenge when implementing ${capitalizedTopic}?`, back: `Managing state scaling securely, preventing unnecessary network trips, and maintaining comprehensive descriptive documents.`, category: "Challenge" },
    { front: `How can we measure the success of ${capitalizedTopic}?`, back: `Through robust integration tests, fast response times, high user engagement, and minimal dependency overhead.`, category: "Metrics" },
    { front: `What is the best practice for learning ${capitalizedTopic}?`, back: `Build modular mini-applications, document code interfaces cleanly, and explain concepts using active study decks!`, category: "Study Tip" }
  ];
};

const getLocalVisualIllustration = (prompt: string): string => {
  const norm = prompt.toLowerCase();
  
  let svgContent = '';
  if (norm.includes('bulb') || norm.includes('idea') || norm.includes('light')) {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full">
        <defs>
          <radialGradient id="bulbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fffbeb" />
            <stop offset="60%" stop-color="#fef08a" />
            <stop offset="100%" stop-color="#fbbf24" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="#312e81" rx="16"/>
        <circle cx="50" cy="50" r="30" fill="url(#bulbGrad)" opacity="0.15"/>
        <circle cx="50" cy="45" r="18" fill="url(#bulbGrad)"/>
        <path d="M42,56 Q50,66 58,56" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <path d="M44,60 L56,60 M46,64 L54,64" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
        <rect x="47" y="68" width="6" height="5" fill="#94a3b8" rx="2"/>
        <line x1="50" y1="15" x2="50" y2="22" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="22" y1="45" x2="29" y2="45" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="71" y1="45" x2="78" y2="45" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="30" y1="25" x2="35" y2="30" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
        <line x1="70" y1="25" x2="65" y2="30" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  } else if (norm.includes('code') || norm.includes('react') || norm.includes('tech') || norm.includes('computer')) {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#0f172a" rx="16"/>
        <circle cx="50" cy="50" r="28" fill="none" stroke="#6366f1" stroke-width="1" stroke-dasharray="2,4"/>
        <path d="M35,42 L25,50 L35,58" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M65,42 L75,50 L65,58" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="54" y1="36" x2="46" y2="64" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="50" cy="50" r="3" fill="#a855f7" />
      </svg>
    `;
  } else if (norm.includes('book') || norm.includes('learn') || norm.includes('school') || norm.includes('study')) {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#1e1b4b" rx="16"/>
        <path d="M22,68 C35,68 45,72 50,78 C55,72 65,68 78,68 L78,28 C65,28 55,32 50,38 C45,32 35,28 22,28 Z" fill="#4338ca"/>
        <path d="M22,64 C35,64 45,68 50,74 C55,68 65,64 78,64 L78,24 C65,24 55,28 50,34 C45,28 35,24 22,24 Z" fill="#eef2ff"/>
        <line x1="50" y1="34" x2="50" y2="74" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M28,34 Q38,36 44,38 M28,44 Q38,46 44,48 M28,54 Q38,56 44,58" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M72,34 Q62,36 56,38 M72,44 Q62,46 56,48 M72,54 Q62,56 56,58" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  } else {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full">
        <defs>
          <linearGradient id="coolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4f46e5" />
            <stop offset="50%" stop-color="#8b5cf6" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="#030712" rx="16"/>
        <g opacity="0.35">
          <circle cx="50" cy="50" r="32" fill="none" stroke="url(#coolGrad)" stroke-width="1.5"/>
          <circle cx="50" cy="50" r="24" fill="none" stroke="url(#coolGrad)" stroke-width="1"/>
          <circle cx="50" cy="50" r="16" fill="none" stroke="url(#coolGrad)" stroke-width="0.5"/>
        </g>
        <polygon points="50,28 69,61 31,61" fill="url(#coolGrad)" opacity="0.85"/>
        <circle cx="50" cy="50" r="6" fill="#ffffff" />
      </svg>
    `;
  }

  const base64 = btoa(svgContent.trim());
  return `data:image/svg+xml;base64,${base64}`;
};

export default function App() {
  // App navigation state
  const [activeTab, setActiveTab] = useState<'brainstorm' | 'flashcards'>('brainstorm');
  
  // State for Chat / Brainstorming
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to your AI Creative Studio! I am your brainstorming companion. Type a topic, request a summary, ask a coding question, or enable **Search Grounding** to research recent information in real-time.",
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  
  // State for Flashcards
  const [studyTopic, setStudyTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      front: "What is Google GenAI SDK?",
      back: "The modern, unified SDK (@google/genai) for calling Gemini 3.5 and 3.1 models from Node, TypeScript, and Python environments.",
      category: "AI",
      mastered: false,
    },
    {
      front: "How do you access the Gemini API key securely?",
      back: "By initializing the GoogleGenAI client exclusively on the server-side, accessing the key via process.env.GEMINI_API_KEY, and never exposing it to the browser client.",
      category: "Security",
      mastered: false,
    },
    {
      front: "What are the core audio voices in Gemini TTS?",
      back: "Gemini TTS features high-quality prebuilt voice profiles including Kore, Zephyr, Puck, Charon, and Fenrir.",
      category: "Audio",
      mastered: false,
    }
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isFlashcardLoading, setIsFlashcardLoading] = useState(false);
  const [flashcardFilter, setFlashcardFilter] = useState<'all' | 'learning' | 'mastered'>('all');

  // State for Image Generation
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // State for TTS (Speech)
  const [speechText, setSpeechText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [isSpeechLoading, setIsSpeechLoading] = useState(false);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  
  // Audio Playback & Visualization Ref
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // General App State
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSandboxMode, setIsSandboxMode] = useState(true); // Default to Sandbox/Demo mode to prevent errors on bad API keys
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Auto-clear notification helper
  const showNotification = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Check for environment parameters on load
  useEffect(() => {
    // Check if GEMINI_API_KEY placeholder exists or key fails
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test-ping' }] })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok && data.error) {
        setApiError(data.error);
        setIsSandboxMode(true); // Automatically fallback to local sandbox mode on leaked key
      } else if (res.status === 401 || (data.error && data.error.includes('Secrets'))) {
        setApiError(data.error || 'Gemini API Key is not set in Secrets.');
        setIsSandboxMode(true);
      } else {
        // Real API works perfectly! Let's default to standard mode
        setIsSandboxMode(false);
      }
    })
    .catch(() => {
      setIsSandboxMode(true);
    });
  }, []);

  // Sync latest chat message text with TTS input field
  useEffect(() => {
    if (messages.length > 0) {
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMsg) {
        setSpeechText(lastAssistantMsg.content.slice(0, 200) + (lastAssistantMsg.content.length > 200 ? '...' : ''));
      }
    }
  }, [messages]);

  // Audio Wave Idling Visualizer
  useEffect(() => {
    let phase = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderIdlingWave = () => {
      if (isPlaying && analyserRef.current) return; // If real audio is playing, skip idling wave

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw beautiful gradient wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)'; // Indigo-400
      ctx.lineWidth = 2.5;

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.015 + phase) * 12 * Math.sin(x * 0.003);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Second secondary wave for depth
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)'; // Purple-400
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.cos(x * 0.02 + phase * 0.8) * 8 * Math.cos(x * 0.004);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      phase += 0.035;
      animationFrameRef.current = requestAnimationFrame(renderIdlingWave);
    };

    renderIdlingWave();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Chat Submission Handler
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: Message = { role: 'user', content: chatInput };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    const textQuery = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    if (isSandboxMode) {
      // Simulate real delay
      setTimeout(() => {
        const localResponse = getLocalChatResponse(textQuery);
        setMessages(prev => [...prev, { role: 'assistant', content: localResponse.text, sources: localResponse.sources }]);
        setIsChatLoading(false);
        showNotification('info', 'Generated response via local sandbox companion.');
      }, 750);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, useSearch }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate chat response.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text, sources: data.sources }]);
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Quick prompt brainstorming templates
  const handleQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
  };

  // Flashcards Generator
  const handleGenerateFlashcards = async () => {
    if (!studyTopic.trim() || isFlashcardLoading) return;
    setIsFlashcardLoading(true);

    if (isSandboxMode) {
      setTimeout(() => {
        const localCards = getLocalFlashcards(studyTopic);
        setFlashcards(localCards.map(c => ({ ...c, mastered: false })));
        setCurrentCardIndex(0);
        setIsCardFlipped(false);
        setStudyTopic('');
        setIsFlashcardLoading(false);
        showNotification('success', `Created ${localCards.length} sandbox study flashcards!`);
      }, 800);
      return;
    }

    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicOrNotes: studyTopic }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate flashcards.');
      }

      const data = await response.json();
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards.map((c: any) => ({ ...c, mastered: false })));
        setCurrentCardIndex(0);
        setIsCardFlipped(false);
        setStudyTopic('');
        showNotification('success', `Created ${data.flashcards.length} structured flashcards!`);
      } else {
        throw new Error('Received empty flashcard response.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsFlashcardLoading(false);
    }
  };

  // Master card state toggle
  const toggleMasterCard = (index: number) => {
    const updated = [...flashcards];
    updated[index].mastered = !updated[index].mastered;
    setFlashcards(updated);
    showNotification('info', updated[index].mastered ? 'Card marked as mastered!' : 'Card back to study deck.');
  };

  const filteredCards = flashcards.filter(card => {
    if (flashcardFilter === 'mastered') return card.mastered;
    if (flashcardFilter === 'learning') return !card.mastered;
    return true;
  });

  const activeCard = filteredCards[currentCardIndex] || null;

  // Image Generation Handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isImageLoading) return;
    setIsImageLoading(true);

    if (isSandboxMode) {
      setTimeout(() => {
        const localImgUrl = getLocalVisualIllustration(imagePrompt);
        setGeneratedImages(prev => [
          {
            url: localImgUrl,
            prompt: imagePrompt,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev
        ]);
        setImagePrompt('');
        setIsImageLoading(false);
        showNotification('success', 'Visual vector illustration created locally!');
      }, 600);
      return;
    }

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate image.');
      }

      const data = await response.json();
      setGeneratedImages(prev => [
        {
          url: data.imageUrl,
          prompt: imagePrompt,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev
      ]);
      setImagePrompt('');
      showNotification('success', 'Visual illustration created!');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsImageLoading(false);
    }
  };

  // TTS Voice Synthesis Handler
  const handleGenerateSpeech = async () => {
    if (!speechText.trim() || isSpeechLoading) return;
    setIsSpeechLoading(true);
    stopAudio();

    if (isSandboxMode) {
      setTimeout(() => {
        setIsSpeechLoading(false);
        if (!('speechSynthesis' in window)) {
          showNotification('error', 'Speech synthesis is not supported in this browser.');
          return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speechText);
        
        const voices = window.speechSynthesis.getVoices();
        if (voice === 'Puck' && voices.length > 0) {
          const pitchVoice = voices.find(v => v.name.includes('Google') || v.lang.startsWith('en'));
          if (pitchVoice) utterance.voice = pitchVoice;
          utterance.pitch = 1.35;
          utterance.rate = 1.1;
        } else if (voice === 'Charon') {
          const lowerVoice = voices.find(v => v.name.includes('male') || v.lang.startsWith('en'));
          if (lowerVoice) utterance.voice = lowerVoice;
          utterance.pitch = 0.65;
          utterance.rate = 0.85;
        } else {
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
        }

        // Setup native visualizer frequency mock to make visual waves play during browser speech!
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = audioContextRef.current || new AudioCtxClass();
        audioContextRef.current = audioCtx;
        
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const analyser = analyserRef.current || audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyserRef.current = analyser;

        const oscNode = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscNode.type = 'sawtooth';
        oscNode.frequency.setValueAtTime(140, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime); // feed analyser without audible hum

        oscNode.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        const pitchTimer = setInterval(() => {
          oscNode.frequency.setValueAtTime(100 + Math.random() * 220, audioCtx.currentTime);
        }, 120);

        utterance.onstart = () => {
          setIsPlaying(true);
          oscNode.start();
          drawFrequencies();
        };

        const handleSpeechStop = () => {
          setIsPlaying(false);
          clearInterval(pitchTimer);
          try { oscNode.stop(); } catch (e) {}
        };

        utterance.onend = handleSpeechStop;
        utterance.onerror = handleSpeechStop;

        window.speechSynthesis.speak(utterance);
        showNotification('success', `Voiceover narrated via local browser synth (${voice})!`);
      }, 400);
      return;
    }

    try {
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText, voice }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to synthesize speech.');
      }

      const data = await response.json();
      const base64Audio = data.audioData;
      
      // Setup browser audio decoding
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Store raw Blob for download support
      const blob = new Blob([bytes.buffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);
      setActiveAudioUrl(audioUrl);

      // Create Web Audio API context & decode
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      audioContextRef.current = audioCtx;

      const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
      audioBufferRef.current = audioBuffer;

      showNotification('success', `Voiceover synthesized in profile "${voice}"!`);
      playAudio();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSpeechLoading(false);
    }
  };

  // Audio Playback Engine with Analyser
  const playAudio = () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    
    // Stop any existing running source
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e){}
    }

    const audioCtx = audioContextRef.current;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBufferRef.current;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    analyserRef.current = analyser;

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Calculate resume offset if paused
    const offset = pausedTimeRef.current;
    source.start(0, offset);
    startTimeRef.current = audioCtx.currentTime - offset;
    audioSourceRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
      // Check if it reached the actual end or was manual stop
      const elapsed = audioCtx.currentTime - startTimeRef.current;
      if (elapsed >= (audioBufferRef.current?.duration || 0) - 0.1) {
        setIsPlaying(false);
        pausedTimeRef.current = 0;
      }
    };

    // Trigger Dynamic Frequency Drawing
    drawFrequencies();
  };

  const pauseAudio = () => {
    if (!audioContextRef.current || !audioSourceRef.current || !isPlaying) return;
    audioSourceRef.current.stop();
    pausedTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
    setIsPlaying(false);
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e){}
    }
    setIsPlaying(false);
    pausedTimeRef.current = 0;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Real-time Canvas Rendering of Speech
  const drawFrequencies = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      if (!isPlaying) return;

      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgb(250, 251, 252)'; // Off-white
      ctx.fillRect(0, 0, width, height);

      // Centered reactive circular or bar visualization
      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Boost magnitude slightly for visual effect
        const barHeight = (dataArray[i] / 255) * height * 1.1;

        // Gradient styling
        const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
        grad.addColorStop(0, '#4f46e5'); // Indigo-600
        grad.addColorStop(1, '#a855f7'); // Purple-500

        ctx.fillStyle = grad;
        // Draw elegant rounded bars
        ctx.beginPath();
        ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, 4);
        ctx.fill();

        x += barWidth;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // Export current workspace session as structured HTML
  const handleExportSession = () => {
    const chatHtml = messages.map(m => `
      <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; background: ${m.role === 'user' ? '#f1f5f9' : '#eef2ff'}; border-left: 5px solid ${m.role === 'user' ? '#64748b' : '#4f46e5'};">
        <strong style="color: #1e293b; text-transform: uppercase; font-size: 12px; font-family: sans-serif;">${m.role === 'user' ? 'User' : 'Assistant'}</strong>
        <p style="margin: 5px 0 0 0; font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">${m.content}</p>
        ${m.sources && m.sources.length > 0 ? `
          <div style="margin-top: 10px; font-size: 12px; color: #6366f1;">
            <strong>Sources:</strong> ${m.sources.map(s => `<a href="${s.uri}" target="_blank" style="color: #4f46e5; margin-right: 10px;">${s.title}</a>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');

    const flashcardsHtml = flashcards.map(c => `
      <div style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; background: #fff;">
        <span style="display: inline-block; background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; font-family: sans-serif; margin-bottom: 8px;">${c.category}</span>
        <div style="font-family: sans-serif; font-weight: 600; color: #0f172a; margin-bottom: 6px;">Q: ${c.front}</div>
        <div style="font-family: sans-serif; color: #475569; font-size: 14px;">A: ${c.back}</div>
      </div>
    `).join('');

    const imagesHtml = generatedImages.map(img => `
      <div style="margin-bottom: 15px; text-align: center;">
        <img src="${img.url}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" />
        <p style="font-size: 12px; color: #64748b; font-family: sans-serif; margin-top: 6px;">"${img.prompt}"</p>
      </div>
    `).join('');

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AI Creative Studio - Exported Session</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; background: #f8fafc; }
          .container { background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
          h1 { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
          h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 32px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>AI Creative Studio Summary</h1>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 30px;">Compiled on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          
          <h2>Brainstorming Transcript</h2>
          ${chatHtml || '<p style="color: #94a3b8; font-style: italic;">No conversation history.</p>'}
          
          <h2>Study Decks & Flashcards</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${flashcardsHtml || '<p style="color: #94a3b8; font-style: italic;">No flashcards created.</p>'}
          </div>

          <h2>Visual Illustrations</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            ${imagesHtml || '<p style="color: #94a3b8; font-style: italic;">No visual assets generated.</p>'}
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative-studio-session-${Date.now()}.html`;
    a.click();
    showNotification('success', 'Exported session notebook document!');
  };

  // Copy assistant response text helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'Copied message transcript to clipboard!');
  };

  // Share visual back into notebook chat
  const handleShareImageToChat = (url: string, prompt: string) => {
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: `Discuss this visual prompt I made: "${prompt}"`,
      },
      {
        role: 'assistant',
        content: `What a magnificent concept! Generating "or describing ${prompt}" opens up an elegant creative avenue. We could brainstorm matching color palettes, write a short narrative scene, or synthesize specific voice guides. What specific ideas do you want to explore based on this theme?`,
      }
    ]);
    setActiveTab('brainstorm');
    showNotification('info', 'Sent visual prompt to chat companion!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-200">
      
      {/* Dynamic Notifications Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border animate-slide-in-right ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
          'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          <Sparkles className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* API Configuration Alert Banner */}
      {apiError && (
        <div className={`py-2.5 px-4 text-center text-sm font-semibold flex items-center justify-center gap-3 shadow-inner transition-colors duration-300 ${
          isSandboxMode 
            ? 'bg-indigo-50 border-b border-indigo-100 text-indigo-900' 
            : 'bg-rose-600 text-white'
        }`}>
          <AlertCircle className={`h-4 w-4 shrink-0 ${isSandboxMode ? 'text-indigo-600' : 'text-white'}`} />
          <span>
            {isSandboxMode 
              ? "Your API key is inactive/leaked, but you are in Offline Sandbox Mode! All features (voice, brainstorm, illustrations, flashcards) are 100% active using local client engines."
              : `Key Issue Detected: ${apiError}`}
          </span>
          {isSandboxMode ? (
            <button
              onClick={() => setIsSandboxMode(false)}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-0.5 rounded text-xs font-bold transition"
            >
              Retry Real API
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSandboxMode(true);
                showNotification('info', 'Switched to Offline Sandbox Mode!');
              }}
              className="bg-rose-800 hover:bg-rose-900 text-white px-3 py-0.5 rounded text-xs font-bold transition"
            >
              Switch to Sandbox Mode
            </button>
          )}
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Brain className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              AI Creative Studio
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                isSandboxMode 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-indigo-50 text-indigo-700'
              }`}>
                {isSandboxMode ? 'Sandbox / Demo' : 'Workspace'}
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              {isSandboxMode 
                ? 'Running offline using high-performance client-side simulation engines' 
                : 'Interactive study notebook & smart full-stack companion'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsSandboxMode(!isSandboxMode);
              showNotification('info', !isSandboxMode ? 'Switched to Offline Sandbox Mode!' : 'Switched to Real API Mode!');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition shadow-sm ${
              isSandboxMode 
                ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600' 
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isSandboxMode ? 'Sandbox Active' : 'Use Sandbox Mode'}
          </button>

          <button 
            onClick={handleExportSession}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            Compile & Export
          </button>
        </div>
      </header>

      {/* Workspace Area */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Notebook Canvas (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[620px]">
          
          {/* Tab Selector Nav */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1">
            <button
              onClick={() => setActiveTab('brainstorm')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                activeTab === 'brainstorm' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Brainstorming Canvas
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                activeTab === 'flashcards' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Study Deck & Flashcards
            </button>
          </div>

          {/* Active Tab Component */}
          <div className="flex-1 flex flex-col p-5">
            {activeTab === 'brainstorm' ? (
              <div className="flex-1 flex flex-col justify-between h-full">
                {/* Chat Message Lists */}
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[460px] pr-2 scrollbar-thin">
                  {messages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[85%] rounded-2xl p-4 shadow-sm border transition duration-150 ${
                        m.role === 'user' 
                          ? 'ml-auto bg-slate-50 border-slate-100 text-slate-800 rounded-tr-none' 
                          : 'bg-indigo-50/40 border-indigo-100 text-indigo-950 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {m.role === 'user' ? 'Notebook Draft' : 'AI Companion'}
                        </span>
                        {m.role === 'assistant' && (
                          <button 
                            onClick={() => copyToClipboard(m.content)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition"
                            title="Copy transcript"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                      {/* Display Grounded Search Results */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-3.5 pt-2.5 border-t border-indigo-100/60">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase block mb-1">Search Grounding Sources:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {m.sources.map((src, sIdx) => (
                              <a 
                                key={sIdx} 
                                href={src.uri} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-1 text-[11px] bg-white border border-indigo-100 hover:border-indigo-300 text-indigo-600 px-2 py-0.5 rounded-md font-medium transition"
                              >
                                {src.title.slice(0, 25)}...
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold bg-indigo-50/50 border border-indigo-100/50 rounded-xl px-4 py-3 max-w-[200px] animate-pulse">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Consulting Gemini...
                    </div>
                  )}
                </div>

                {/* Grounding & Chat Input */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {/* Templates / suggestions */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    <button 
                      onClick={() => handleQuickPrompt('Summarize the concept of React Server Components cleanly.')}
                      className="text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 border border-slate-200/60 px-2.5 py-1 rounded-lg transition font-medium"
                    >
                      💡 Summarize RSCs
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt('Give me a step-by-step roadmap to learn TypeScript in 2026.')}
                      className="text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 border border-slate-200/60 px-2.5 py-1 rounded-lg transition font-medium"
                    >
                      🚀 Learn TS roadmap
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt('Brainstorm 3 creative product ideas combining local databases and generative speech.')}
                      className="text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 border border-slate-200/60 px-2.5 py-1 rounded-lg transition font-medium"
                    >
                      🎨 Idea Generation
                    </button>
                  </div>

                  <form onSubmit={handleSendChat} className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Search Grounding:</span>
                        <button
                          type="button"
                          onClick={() => setUseSearch(!useSearch)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            useSearch ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              useSearch ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Allows real-time web research</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Write something to brainstorm or research..."
                        className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-900 transition"
                      />
                      <button
                        type="submit"
                        disabled={isChatLoading || !chatInput.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 rounded-xl transition shadow-md shadow-indigo-100 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                {/* Topic Creator Input */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Create Study Materials</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={studyTopic}
                      onChange={(e) => setStudyTopic(e.target.value)}
                      placeholder="Enter study topic (e.g., Photosynthesis, REST API design, Spanish verbs)..."
                      className="flex-1 bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                    <button
                      onClick={handleGenerateFlashcards}
                      disabled={isFlashcardLoading || !studyTopic.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isFlashcardLoading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Layers className="h-3.5 w-3.5" />
                      )}
                      Generate Deck
                    </button>
                  </div>
                </div>

                {/* Filter and deck size */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                    <button 
                      onClick={() => { setFlashcardFilter('all'); setCurrentCardIndex(0); }}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-bold transition ${flashcardFilter === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      All ({flashcards.length})
                    </button>
                    <button 
                      onClick={() => { setFlashcardFilter('learning'); setCurrentCardIndex(0); }}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-bold transition ${flashcardFilter === 'learning' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Study Deck ({flashcards.filter(c => !c.mastered).length})
                    </button>
                    <button 
                      onClick={() => { setFlashcardFilter('mastered'); setCurrentCardIndex(0); }}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-bold transition ${flashcardFilter === 'mastered' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Mastered ({flashcards.filter(c => c.mastered).length})
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Card {filteredCards.length > 0 ? currentCardIndex + 1 : 0} of {filteredCards.length}</span>
                </div>

                {/* Flippable 3D Card Stage */}
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  {activeCard ? (
                    <div className="w-full max-w-[420px] aspect-[1.58] perspective-1000">
                      <div 
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className={`relative w-full h-full duration-500 transform-style-3d cursor-pointer ${
                          isCardFlipped ? 'rotate-y-180' : ''
                        }`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 flex flex-col justify-between shadow-lg text-white border border-indigo-400/30">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">{activeCard.category}</span>
                            <Brain className="h-4 w-4 opacity-75" />
                          </div>
                          <p className="text-center text-base md:text-lg font-bold leading-snug my-auto px-2">
                            {activeCard.front}
                          </p>
                          <span className="text-[10px] text-center opacity-60 font-semibold tracking-wider uppercase">Click card to reveal</span>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl p-6 flex flex-col justify-between shadow-lg text-slate-800 border border-indigo-100 rotate-y-180">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{activeCard.category} - Answer</span>
                            <GraduationCap className="h-4 w-4 text-indigo-500" />
                          </div>
                          <p className="text-center text-sm md:text-base text-slate-700 leading-relaxed font-semibold my-auto px-2">
                            {activeCard.back}
                          </p>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMasterCard(flashcards.indexOf(activeCard));
                              }}
                              className={`text-[11px] font-bold flex items-center gap-1 px-2 py-1 rounded-md transition ${
                                activeCard.mastered 
                                  ? 'text-emerald-600 bg-emerald-50' 
                                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                              }`}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              {activeCard.mastered ? 'Mastered!' : 'Mark Mastered'}
                            </button>
                            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Click to flip back</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl w-full max-w-[420px]">
                      <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-2.5" />
                      <p className="text-sm font-semibold text-slate-500">No cards in this filter.</p>
                      <p className="text-xs text-slate-400 mt-1">Generate a study deck or mark mastered cards to study!</p>
                    </div>
                  )}

                  {/* Navigation controls */}
                  {filteredCards.length > 0 && (
                    <div className="flex items-center gap-4 mt-6">
                      <button
                        onClick={() => {
                          setCurrentCardIndex(prev => Math.max(0, prev - 1));
                          setIsCardFlipped(false);
                        }}
                        disabled={currentCardIndex === 0}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition disabled:opacity-50"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-semibold text-slate-500">{currentCardIndex + 1} / {filteredCards.length}</span>
                      <button
                        onClick={() => {
                          setCurrentCardIndex(prev => Math.min(filteredCards.length - 1, prev + 1));
                          setIsCardFlipped(false);
                        }}
                        disabled={currentCardIndex === filteredCards.length - 1}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition disabled:opacity-50"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Creative Tools Pane (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Tool 1: Studio Voice Generator (TTS) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Volume2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Studio Voice</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Synthesize high-fidelity voice guides</p>
                </div>
              </div>

              {/* Voice profiles selector */}
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value="Kore">Kore (Warm/Energetic)</option>
                <option value="Zephyr">Zephyr (Professional)</option>
                <option value="Puck">Puck (Playful)</option>
                <option value="Charon">Charon (Serious)</option>
              </select>
            </div>

            {/* Input area */}
            <div className="space-y-3.5">
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Enter summary or notes to narrate..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-900 transition"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleGenerateSpeech}
                  disabled={isSpeechLoading || !speechText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSpeechLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                  Synthesize Speech
                </button>

                {activeAudioUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={isPlaying ? pauseAudio : playAudio}
                      className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <a
                      href={activeAudioUrl}
                      download={`studio-narration-${voice}.wav`}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 transition"
                      title="Download audio WAV"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Dynamic responsive audio waveform visualizer */}
              <div className="relative border border-slate-100 bg-slate-50 rounded-xl overflow-hidden mt-2.5">
                <canvas 
                  ref={canvasRef} 
                  width={340} 
                  height={55}
                  className="w-full block h-[55px]"
                />
                <div className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded bg-slate-900/60 text-white text-[9px] font-bold tracking-wider uppercase">
                  {isPlaying ? 'ACTIVE FREQUENCY' : 'AMBIENT IDLE'}
                </div>
              </div>
            </div>
          </div>

          {/* Tool 2: Visual Illustrator (Image Gen) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ImageIcon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Illustrator Engine</h2>
                <p className="text-[10px] text-slate-400 font-medium">Create custom vector art or illustrations</p>
              </div>
            </div>

            {/* Input area */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="E.g., A minimalist vector icon of a lightbulb, indigo background..."
                  className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-900 transition"
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isImageLoading || !imagePrompt.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                >
                  {isImageLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Generate
                </button>
              </div>

              {/* Created images gallery stack */}
              {generatedImages.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Generated Assets Gallery:</span>
                  <div className="grid grid-cols-2 gap-3">
                    {generatedImages.map((img, iIdx) => (
                      <div key={iIdx} className="group relative rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shadow-inner flex flex-col justify-between">
                        <img 
                          src={img.url} 
                          alt={img.prompt}
                          className="w-full aspect-square object-cover" 
                        />
                        <div className="p-2 bg-white flex flex-col gap-1.5">
                          <p className="text-[10px] text-slate-600 leading-tight font-medium line-clamp-2">"{img.prompt}"</p>
                          <div className="flex justify-between items-center pt-1.5 border-t border-slate-50">
                            <span className="text-[9px] text-slate-400 font-medium">{img.timestamp}</span>
                            <button
                              onClick={() => handleShareImageToChat(img.url, img.prompt)}
                              className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded transition"
                              title="Discuss with AI Companion"
                            >
                              <Plus className="h-3 w-3" />
                              Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                  <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-500">No illustrations generated yet.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Describe custom art prompts to visually seed your notes!</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-slate-100 bg-white py-4 text-center mt-auto">
        <p className="text-[11px] text-slate-400 font-medium">AI Creative Studio &copy; 2026. Made with Gemini models and Google AI Studio.</p>
      </footer>
    </div>
  );
}
