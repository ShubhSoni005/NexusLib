import { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, Link2, Bot, User, Loader, X, FileText, 
  Globe, Sparkles, HelpCircle, LayoutDashboard, BookOpen, 
  Settings, Award, Cpu, Book, Layers, CheckCircle 
} from 'lucide-react';
import './StudyGuidePage.css';

const WELCOME = {
  role: 'assistant',
  content: `Hi! I'm your AI Study Guide. I can help you with:\n\n• **Exam preparation** — ask about any GTU subject\n• **Upload a PDF** — I'll analyze your notes or syllabus\n• **Paste a URL** — I'll read and summarize any webpage\n• **Study plans** — tell me your exam date and I'll plan your schedule\n\nWhat would you like help with today?`,
};

const SUGGESTIONS = [
  'Explain AI search algorithms for GTU exam',
  'Create a 2-week study plan for Semester 6',
  'What are the important topics in DBMS?',
  'Summarize Unit 1 of Computer Networks',
];

function escapeHtml(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMsg(text) {
  if (!text) return '';
  
  const codeBlocks = [];
  let placeholderText = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    const id = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push(code.trim());
    return id;
  });

  placeholderText = placeholderText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• (.*?)$/gm, '<li class="bullet-item">$1</li>')
    .replace(/\n/g, '<br/>');

  codeBlocks.forEach((code, idx) => {
    placeholderText = placeholderText.replace(
      `___CODE_BLOCK_${idx}___`,
      `<pre class="code-block"><code>${escapeHtml(code)}</code></pre>`
    );
  });

  return placeholderText;
}

// Custom typing animation that reveals words sequentially
function MessageContent({ text, isLastAssistant }) {
  const [displayedText, setDisplayedText] = useState(isLastAssistant ? '' : text);

  useEffect(() => {
    if (!isLastAssistant) {
      setDisplayedText(text);
      return;
    }

    const words = text.split(' ');
    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      setDisplayedText(prev => (prev ? prev + ' ' : '') + words[index]);
      index++;
      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 25); // 25ms per word typing animation

    return () => clearInterval(interval);
  }, [text, isLastAssistant]);

  return <div dangerouslySetInnerHTML={{ __html: formatMsg(displayedText) }} />;
}

export default function StudyGuidePage() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('nl_chat_history');
      return saved ? JSON.parse(saved) : [WELCOME];
    } catch {
      return [WELCOME];
    }
  });
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    try {
      localStorage.setItem('nl_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  }, [messages]);

  const buildPrompt = (userText) => {
    let prompt = userText;
    if (url) prompt += `\n\n[User also provided URL: ${url}]`;
    if (file) prompt += `\n\n[User uploaded file: ${file.name}]`;
    return prompt;
  };

  const getAIResponse = async (prompt) => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (key) {
      try {
        const history = messages.slice(-10).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: 'You are an expert GTU (Gujarat Technological University) engineering study assistant called NexusLib AI. Be concise, practical and exam-focused. Use markdown bold (**text**) and bullet points (•) for formatting. Help students with study plans, subject explanations, PYQ analysis, and exam tips. When outputting code, wrap it in ```code blocks```.' }],
              },
              contents: [
                ...history,
                { role: 'user', parts: [{ text: prompt }] },
              ],
              generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
            }),
          }
        );
        const data = await res.json();
        if (data.error) {
          console.error('Gemini API error:', data.error);
          return fallback(prompt);
        }
        return data.candidates?.[0]?.content?.parts?.[0]?.text || fallback(prompt);
      } catch (err) {
        console.error('Gemini API fetch failed:', err);
        return fallback(prompt);
      }
    }
    return fallback(prompt);
  };

  const fallback = (prompt) => {
    const p = prompt.toLowerCase();
    if (p.includes('study plan') || p.includes('schedule') || p.includes('timetable') || p.includes('routine')) {
      return `**📅 Personalized Study Plan**\n\n**Week 1 — Foundation:**\n• Day 1–2: Unit 1 & 2 (concepts + textbook notes)\n• Day 3–4: Unit 3 & 4 (practice problems + short notes)\n• Day 5–6: Solve PYQ papers (Winter & Summer 2022–2023)\n• Day 7: Revision of weak areas + formula sheet\n\n**Week 2 — Mastery:**\n• Day 1–2: Unit 5 & 6 deep dive\n• Day 3–4: Full mock tests from PYQs (timed)\n• Day 5: Revise all short notes + important definitions\n• Day 6: Practice numerical problems & diagrams\n• Day 7: Final revision — formula sheet + last-minute topics\n\n**Daily Routine:**\n• 🕐 Morning (2 hrs): New concepts from textbook\n• 🕑 Afternoon (2 hrs): Practice questions & PYQs\n• 🕓 Evening (1 hr): Revision + short notes\n\n**Pro Tips:**\n• Solve minimum 3 PYQs per subject daily\n• Focus on 7-mark and 4-mark questions first\n• Mark frequently repeated questions across papers`;
    }
    if (p.includes('artificial intelligence') || (p.includes('ai') && !p.includes('email') && !p.includes('wait'))) {
      return `**🤖 Artificial Intelligence — GTU Complete Guide**\n\n**Unit 1: Introduction to AI**\n• Definition, history, Turing Test, intelligent agents\n• Problem solving — state space, search trees\n\n**Unit 2: Search Strategies**\n• Uninformed: BFS, DFS, Uniform Cost, Iterative Deepening\n• Informed: Greedy Best-First, A* Algorithm (most asked!)\n• Game Playing: Minimax, Alpha-Beta Pruning\n\n**Unit 3: Knowledge Representation**\n• Propositional & First-Order Logic\n• Semantic Nets, Frames, Scripts\n• Unification & Resolution\n\n**Unit 4: Planning**\n• STRIPS, Goal Stack Planning\n• Partial Order Planning\n\n**Unit 5: Machine Learning Basics**\n• Supervised vs Unsupervised Learning\n• Decision Trees, k-NN, Naive Bayes\n\n**Unit 6: Advanced Topics**\n• Neural Networks, NLP fundamentals\n• Expert Systems — architecture & working\n\n**🔥 Most asked in GTU exams:**\n• A* algorithm with heuristic (7 marks)\n• Minimax with Alpha-Beta pruning (7 marks)\n• First Order Logic resolution (4 marks)\n• Constraint Satisfaction Problems (4 marks)`;
    }
    if (p.includes('dbms') || p.includes('database management')) {
      return `**🗄️ DBMS — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• Database concepts, DBMS architecture (3-tier)\n• Data models — Relational, Hierarchical, Network\n• Data independence — logical & physical\n\n**Unit 2: ER Model & Relational Model**\n• Entities, Attributes, Relationships, Cardinality\n• ER to Relational mapping (frequently asked!)\n• Relational algebra & calculus\n\n**Unit 3: SQL**\n• DDL: CREATE, ALTER, DROP\n• DML: SELECT, INSERT, UPDATE, DELETE\n• Joins: INNER, LEFT, RIGHT, FULL, CROSS\n• Subqueries, Views, Stored Procedures\n\n**Unit 4: Normalization**\n• Functional Dependencies\n• 1NF → 2NF → 3NF → BCNF (most asked topic!)\n• Decomposition — lossless join & dependency preserving\n\n**Unit 5: Transaction Management**\n• ACID properties\n• Concurrency control — locks, 2PL, timestamp ordering\n• Deadlock detection & recovery\n\n**Unit 6: Indexing & File Organization**\n• B-tree, B+ tree indexing\n• Hashing — static & dynamic\n\n**🔥 PYQ Tip:** Normalization (1NF–BCNF) and SQL queries appear in every single paper. Master these first.`;
    }
    if (p.includes('operating system') || p.includes(' os ') || p.match(/\bos\b/)) {
      return `**💻 Operating System — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• OS types — batch, multiprogramming, time-sharing, real-time\n• System calls, OS structure (monolithic, microkernel)\n\n**Unit 2: Process Management**\n• Process states, PCB, context switching\n• CPU Scheduling: FCFS, SJF, Priority, Round Robin (most asked!)\n• Preemptive vs Non-preemptive scheduling\n\n**Unit 3: Process Synchronization**\n• Critical section problem\n• Semaphores, Mutex, Monitors\n• Producer-Consumer, Readers-Writers, Dining Philosophers\n\n**Unit 4: Deadlocks**\n• Conditions, Resource Allocation Graph\n• Banker's Algorithm (7-mark favourite!)\n• Deadlock detection & recovery\n\n**Unit 5: Memory Management**\n• Paging, Segmentation, Virtual Memory\n• Page replacement: FIFO, LRU, Optimal\n• Thrashing & working set model\n\n**Unit 6: File & Disk Management**\n• File allocation methods\n• Disk scheduling: FCFS, SSTF, SCAN, C-SCAN\n\n**🔥 Most asked:** CPU scheduling numericals, Banker's Algorithm, Page replacement numericals`;
    }
    if (p.includes('computer network') || p.includes('networking') || p.includes('cn ')) {
      return `**🌐 Computer Networks — GTU Complete Guide**\n\n**Unit 1: Introduction & Physical Layer**\n• OSI Model vs TCP/IP Model (always asked!)\n• Transmission media — guided & unguided\n• Multiplexing — FDM, TDM, WDM\n\n**Unit 2: Data Link Layer**\n• Error detection: Parity, CRC, Checksum\n• Flow control: Stop-and-Wait, Sliding Window\n• MAC protocols: ALOHA, CSMA/CD, CSMA/CA\n\n**Unit 3: Network Layer**\n• IPv4 addressing, Subnetting, CIDR (most asked!)\n• Routing: Distance Vector, Link State, OSPF, BGP\n• ARP, RARP, ICMP\n\n**Unit 4: Transport Layer**\n• TCP vs UDP — detailed comparison\n• TCP: 3-way handshake, flow control, congestion control\n• Port numbers & socket programming concepts\n\n**Unit 5: Application Layer**\n• DNS, HTTP/HTTPS, FTP, SMTP, POP3, IMAP\n• Web architecture, cookies, sessions\n\n**Unit 6: Security**\n• Cryptography basics, RSA, DES, AES\n• Firewalls, VPN, SSL/TLS\n\n**🔥 PYQ Tip:** Subnetting problems and OSI vs TCP/IP comparison appear in every paper.`;
    }
    return `**📚 NexusLib AI — Study Assistant**\n\nI've noted your question about "${prompt.slice(0, 80)}"\n\nWhile I process this, here are some universal GTU study tips:\n\n**Quick Action Plan:**\n• 📖 Start with the official GTU syllabus for your subject\n• 📝 Solve PYQs from 2019–2024 (GTU repeats 40-60% of questions!)\n• 🗂️ Create unit-wise short notes with key definitions\n• 🔢 Practice numerical problems daily — they carry the most marks\n• 📊 Draw diagrams wherever applicable — examiners love visual answers`;
  };

  const send = async () => {
    const text = input.trim();
    if (!text && !file && !url) return;
    
    const userMsg = { role: 'user', content: text, file: file?.name, url };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setUrl('');
    setFile(null);
    setShowUrl(false);
    setLoading(true);
    
    const reply = await getAIResponse(buildPrompt(text || 'Please analyze the provided file/URL'));
    setMessages(m => [...m, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="page-content guide-page-root">
      <div className="study-guide-workspace">
        
        {/* COLUMN 1: ACTIVE STUDY PLAN */}
        <section className="workspace-sidebar-left">
          <div className="left-panel-header">
            <h2 className="text-data-mono text-stark-white">Active Study Plan</h2>
            <span className="active-dot"></span>
          </div>

          <div className="timeline-container">
            {/* Milestone 1 */}
            <div className="timeline-item timeline-item--active">
              <div className="timeline-bullet"></div>
              <div className="timeline-badge text-data-mono">Current Module</div>
              <h3 className="timeline-title">OS Kernels &amp; Scheduling</h3>
              <p className="timeline-desc text-data-mono text-[10px] text-muted">Goal: Process Sync Lab</p>
            </div>
            
            {/* Milestone 2 */}
            <div className="timeline-item">
              <div className="timeline-bullet"></div>
              <div className="timeline-badge text-data-mono">Upcoming • 14:00</div>
              <h3 className="timeline-title">Distributed Systems</h3>
              <p className="timeline-desc text-data-mono text-[10px] text-muted">Goal: Consensus Algorithms</p>
            </div>

            {/* Milestone 3 */}
            <div className="timeline-item">
              <div className="timeline-bullet"></div>
              <div className="timeline-badge text-data-mono">Tomorrow</div>
              <h3 className="timeline-title">Database Internals</h3>
              <p className="timeline-desc text-data-mono text-[10px] text-muted">Goal: B-Tree Indexing</p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="progress-tracker bg-slate-800/30 border border-slate-800 p-4">
            <div className="progress-text">
              <span className="text-data-mono text-[10px] text-muted">Weekly Progress</span>
              <span className="text-data-mono text-[10px] text-laser-violet font-bold">64%</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: '64%' }}></div>
            </div>
          </div>
        </section>

        {/* COLUMN 2: CHAT HUB CENTER */}
        <section className="workspace-center-chat">
          <div className="chat-messages-container">
            {messages.map((m, i) => {
              const isLastAssistant = m.role === 'assistant' && i === messages.length - 1;
              return (
                <div key={i} className={`chat-message-row chat-message-row--${m.role}`}>
                  <div className="message-avatar">
                    {m.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  
                  <div className="message-bubble-wrapper">
                    <span className="text-data-mono text-[9px] text-muted mb-1 block">
                      {m.role === 'assistant' ? '[AI]' : '[User]'}
                    </span>
                    <div className="message-bubble-content">
                      {m.file && (
                        <div className="bubble-attachment text-data-mono">
                          <FileText size={12} />
                          <span>{m.file}</span>
                        </div>
                      )}
                      {m.url && (
                        <div className="bubble-attachment text-data-mono">
                          <Globe size={12} />
                          <span>{m.url}</span>
                        </div>
                      )}
                      <MessageContent text={m.content} isLastAssistant={isLastAssistant} />
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="chat-message-row chat-message-row--assistant">
                <div className="message-avatar"><Bot size={14} /></div>
                <div className="message-bubble-wrapper">
                  <span className="text-data-mono text-[9px] text-muted mb-1 block">[AI]</span>
                  <div className="message-bubble-content typing-loader">
                    <Loader size={12} className="spin text-laser-violet" />
                    <span>Neural net thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Action Suggested Prompts */}
          <div className="chat-action-chips">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i}
                className="action-chip font-mono text-[10px]"
                onClick={() => { setInput(s); textRef.current?.focus(); }}
              >
                <span>{s}</span>
              </button>
            ))}
          </div>

          {/* Input Control Console */}
          <div className="chat-input-console bg-slate-900 border border-slate-800 p-4">
            {/* Attachment Area */}
            {(file || showUrl) && (
              <div className="attachment-tray mb-3">
                {file && (
                  <div className="tray-chip text-data-mono text-[10px]">
                    <FileText size={12} />
                    <span>{file.name}</span>
                    <button onClick={() => setFile(null)} className="tray-remove"><X size={12} /></button>
                  </div>
                )}
                {showUrl && (
                  <div className="tray-url-wrap text-data-mono text-[10px]">
                    <Globe size={12} />
                    <input 
                      type="text"
                      className="tray-url-input"
                      placeholder="Enter target webpage URL..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <button onClick={() => { setShowUrl(false); setUrl(''); }} className="tray-remove"><X size={12} /></button>
                  </div>
                )}
              </div>
            )}

            <div className="input-row-console">
              <textarea
                ref={textRef}
                className="console-textarea font-mono text-xs"
                placeholder="Ask the AI Assistant for technical analysis, summaries, or practice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={2}
              />

              <div className="console-actions">
                <button 
                  className="console-btn"
                  title="Upload reference files"
                  onClick={() => fileRef.current?.click()}
                >
                  <Paperclip size={16} />
                </button>
                <button 
                  className={`console-btn ${showUrl ? 'console-btn--active' : ''}`}
                  title="Link webpage reference"
                  onClick={() => setShowUrl(u => !u)}
                >
                  <Link2 size={16} />
                </button>
                <button 
                  className="console-btn send-btn-console bg-laser-violet"
                  onClick={send}
                  disabled={loading || (!input.trim() && !file && !url)}
                >
                  <Send size={14} className="text-stark-white" />
                </button>
              </div>
            </div>
            
            <input 
              ref={fileRef} 
              type="file" 
              accept=".pdf,.txt,.doc,.docx" 
              style={{ display: 'none' }} 
              onChange={e => setFile(e.target.files[0])} 
            />

            <div className="console-status-row mt-3 text-data-mono text-[9px] text-muted">
              <span className="flex items-center gap-1"><CheckCircle size={10} className="text-secondary" /> Engineering Trained</span>
              <span className="flex items-center gap-1"><FileText size={10} /> 243 Papers Indexed</span>
              <span className="flex items-center gap-1"><Layers size={10} /> Real-time Analysis</span>
            </div>
          </div>
        </section>

        {/* COLUMN 3: REFERENCE PREVIEW SIDEBAR */}
        <section className="workspace-sidebar-right">
          <h2 className="text-data-mono text-stark-white mb-6">Resource Preview</h2>
          
          <div className="preview-cards-list">
            {/* Textbook Card */}
            <div className="preview-card bg-slate-900 border border-slate-800">
              <div className="preview-card-image bg-slate-800">
                <div className="preview-format-tag text-data-mono text-[9px] bg-laser-violet text-stark-white">
                  PDF
                </div>
              </div>
              <div className="preview-card-details">
                <h4 className="preview-card-title text-stark-white">Modern Operating Systems</h4>
                <p className="preview-card-author text-data-mono text-[10px] text-muted">Tanenbaum &amp; Woodhull</p>
                <div className="preview-card-meta mt-4 text-data-mono text-[9px]">
                  <span className="text-blueprint-cyan">Chapter 4: Scheduling</span>
                  <span className="text-muted">98% Match</span>
                </div>
              </div>
            </div>

            {/* Paper Card */}
            <div className="preview-card bg-slate-900 border border-slate-800 p-4">
              <div className="flex gap-4">
                <div className="preview-icon-box border border-slate-700 bg-slate-800 text-blueprint-cyan">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="preview-card-title text-stark-white">LTS: Kernel Latency Tracking</h4>
                  <p className="preview-card-author text-data-mono text-[10px] text-muted">IEEE Journal, 2023</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-0.5 border border-slate-800 text-data-mono text-[8px] text-muted">
                  REAL-TIME
                </span>
                <span className="px-2 py-0.5 border border-slate-800 text-data-mono text-[8px] text-muted">
                  LATENCY
                </span>
              </div>
            </div>

            {/* Assignment Card */}
            <div className="preview-card bg-slate-900 border border-slate-800 p-4">
              <div className="flex gap-4">
                <div className="preview-icon-box border border-slate-700 bg-slate-800 text-laser-violet">
                  <Cpu size={18} />
                </div>
                <div>
                  <h4 className="preview-card-title text-stark-white">Lab 04: Process Management</h4>
                  <p className="preview-card-author text-data-mono text-[10px] text-muted">Assignment Sheet</p>
                </div>
              </div>
            </div>
          </div>

          <div className="right-panel-footer mt-auto border-t border-slate-800 pt-6">
            <button 
              onClick={() => navigate('/branch/IT')} 
              className="w-full font-data-mono text-[10px] text-blueprint-cyan border border-blueprint-cyan/30 py-3 hover:bg-blueprint-cyan/5 transition-all text-center block bg-transparent cursor-pointer"
            >
              View Full Library
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
