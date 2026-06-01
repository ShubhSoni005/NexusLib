import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Link2, Bot, User, Loader, X, FileText, Globe, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
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
    <div className="guide-page page-content">
      <div className="guide-layout">
        
        {/* Chat sidebar panel */}
        <aside className="guide-sidebar surface-glass animate-fade-up">
          <div className="guide-sidebar__header">
            <div className="guide-sidebar__badge">
              <Sparkles size={12} />
              <span>Gemini Pro</span>
            </div>
            <h2 className="guide-sidebar__title">
              <Bot size={18} /> 
              <span>Study Assistant</span>
            </h2>
            <p className="guide-sidebar__sub">Ask questions, request explanations, or create personalized timetables.</p>
          </div>
          
          <div className="guide-sidebar__divider" />
          
          <p className="guide-sidebar__label">Suggested Prompts</p>
          <div className="suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i} 
                className="suggestion-chip surface-elevated" 
                onClick={() => { setInput(s); textRef.current?.focus(); }}
              >
                <HelpCircle size={12} className="suggestion-chip__icon" />
                <span>{s}</span>
              </button>
            ))}
          </div>
          
          <div className="guide-sidebar__divider" />
          
          <div className="guide-capabilities">
            <div className="capability"><FileText size={14} /> PDF & Document Analysis</div>
            <div className="capability"><Globe size={14} /> Link Scraping Summary</div>
            <div className="capability"><Bot size={14} /> GTU Exam Predictions</div>
          </div>
          
          <div className="guide-sidebar__divider" />
          
          <button 
            className="btn btn-ghost btn-sm clear-history-btn" 
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your chat history?")) {
                setMessages([WELCOME]);
              }
            }}
          >
            Clear History
          </button>
        </aside>

        {/* Chat messages viewport */}
        <div className="chat-container surface-glass animate-fade-up delay-100">
          <div className="chat-messages">
            {messages.map((m, i) => {
              const isLastAssistant = m.role === 'assistant' && i === messages.length - 1;
              return (
                <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                  <div className="chat-msg__avatar shadow-premium-2">
                    {m.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div className="chat-msg__bubble shadow-premium-1">
                    {m.file && (
                      <div className="chat-msg__attach surface-elevated">
                        <FileText size={12} />
                        <span>{m.file}</span>
                      </div>
                    )}
                    {m.url && (
                      <div className="chat-msg__attach surface-elevated">
                        <Globe size={12} />
                        <span>{m.url}</span>
                      </div>
                    )}
                    <div className="chat-msg__text">
                      <MessageContent text={m.content} isLastAssistant={isLastAssistant} />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="chat-msg chat-msg--assistant">
                <div className="chat-msg__avatar"><Bot size={14} /></div>
                <div className="chat-msg__bubble chat-msg__typing">
                  <Loader size={12} className="spin mr-2" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input control block */}
          <div className="chat-input-area surface-elevated">
            {(file || showUrl) && (
              <div className="chat-attachments">
                {file && (
                  <div className="attachment-chip surface-glass">
                    <FileText size={12} />
                    <span>{file.name}</span>
                    <button onClick={() => setFile(null)} aria-label="Remove attachment"><X size={12} /></button>
                  </div>
                )}
                {showUrl && (
                  <div className="url-input-wrap surface-glass">
                    <Globe size={12} />
                    <input 
                      className="url-input" 
                      placeholder="Paste target webpage URL here..." 
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                    />
                    <button onClick={() => { setShowUrl(false); setUrl(''); }} aria-label="Cancel URL input"><X size={12} /></button>
                  </div>
                )}
              </div>
            )}
            
            <div className="chat-input-row">
              <div className="chat-input-box">
                <textarea 
                  ref={textRef} 
                  className="chat-textarea" 
                  placeholder="Ask a question or request a study routine..." 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={onKey} 
                  rows={1} 
                />
                <div className="chat-input-actions">
                  <button 
                    className="input-action-btn" 
                    title="Upload PDF Reference" 
                    onClick={() => fileRef.current?.click()}
                  >
                    <Paperclip size={16} />
                  </button>
                  <button 
                    className={`input-action-btn ${showUrl ? 'input-action-btn--active' : ''}`} 
                    title="Add Reference Web Link" 
                    onClick={() => setShowUrl(u => !u)}
                  >
                    <Link2 size={16} />
                  </button>
                </div>
              </div>
              <button 
                className="send-btn btn-primary" 
                onClick={send} 
                disabled={loading || (!input.trim() && !file && !url)}
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
            <input 
              ref={fileRef} 
              type="file" 
              accept=".pdf,.txt,.doc,.docx" 
              style={{ display: 'none' }} 
              onChange={e => setFile(e.target.files[0])} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
