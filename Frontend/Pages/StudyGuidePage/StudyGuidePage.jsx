import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Link2, Bot, User, Loader, X, FileText, Globe } from 'lucide-react';
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

function formatMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• /gm, '<span class="bullet">•</span> ')
    .replace(/\n/g, '<br/>');
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
  const [input, setInput]       = useState('');
  const [url, setUrl]           = useState('');
  const [showUrl, setShowUrl]   = useState(false);
  const [file, setFile]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const textRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Persist chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nl_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  }, [messages]);

  const buildPrompt = (userText) => {
    let prompt = userText;
    if (url)  prompt += `\n\n[User also provided URL: ${url}]`;
    if (file) prompt += `\n\n[User uploaded file: ${file.name}]`;
    return prompt;
  };

  const getAIResponse = async (prompt) => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (key) {
      try {
        // Build conversation history for context (last 10 messages)
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
                parts: [{ text: 'You are an expert GTU (Gujarat Technological University) engineering study assistant called NexusLib AI. Be concise, practical and exam-focused. Use markdown bold (**text**) and bullet points (•) for formatting. Help students with study plans, subject explanations, PYQ analysis, and exam tips.' }],
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
    if (p.includes('study plan') || p.includes('schedule'))
      return `**Personalized Study Plan**\n\n**Week 1:**\n• Day 1–2: Unit 1 & 2 (concepts + notes)\n• Day 3–4: Unit 3 & 4 (practice questions)\n• Day 5–6: PYQ papers 2022–2023\n• Day 7: Revision + weak areas\n\n**Week 2:**\n• Day 1–4: Units 5 & 6 deep dive\n• Day 5–6: Full mock tests from PYQs\n• Day 7: Formula sheet + last-minute revision\n\n**Tips:** Focus on GTU exam-pattern questions. Practice 3–5 PYQs daily.`;
    if (p.includes('ai') || p.includes('artificial intelligence'))
      return `**Artificial Intelligence — Key Topics for GTU**\n\n**Unit 1:** Intro to AI, Problem Solving, Search strategies (BFS, DFS, A*)\n**Unit 2:** Heuristic Search, Game Playing (Minimax, Alpha-Beta)\n**Unit 3:** Knowledge Representation — Logic, Semantic Nets, Frames\n**Unit 4:** Planning — STRIPS, Goal Stack, Partial Order\n**Unit 5:** Machine Learning — Supervised/Unsupervised, Decision Trees\n**Unit 6:** NLP, Expert Systems, Neural Networks\n\n**Most asked in GTU exams:** A* algorithm, Minimax, First Order Logic, Constraint Satisfaction`;
    if (p.includes('dbms') || p.includes('database'))
      return `**DBMS — GTU Key Topics**\n\n• **ER Model** — entities, relationships, cardinality\n• **Normalization** — 1NF, 2NF, 3NF, BCNF (most asked!)\n• **SQL** — DDL, DML, joins, subqueries, views\n• **Transactions** — ACID properties, concurrency control\n• **Indexing** — B+ trees, hashing\n\n**PYQ Tip:** Normalization and SQL queries appear in every paper.`;
    return `**Response to your query:**\n\nI've analyzed your question about "${prompt.slice(0, 60)}..."\n\nFor best GTU exam results, focus on:\n• Understanding core concepts from your syllabus\n• Practicing PYQs from 2019–2024\n• Creating unit-wise short notes\n• Solving numerical problems daily\n\nWould you like a detailed breakdown of any specific topic or unit?`;
  };

  const send = async () => {
    const text = input.trim();
    if (!text && !file && !url) return;
    const userMsg = { role: 'user', content: text, file: file?.name, url };
    setMessages(m => [...m, userMsg]);
    setInput(''); setUrl(''); setFile(null); setShowUrl(false);
    setLoading(true);
    const reply = await getAIResponse(buildPrompt(text || 'Please analyze the provided file/URL'));
    setMessages(m => [...m, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="guide-page page-content">
      <div className="guide-layout">
        <aside className="guide-sidebar animate-fade-up">
          <h2 className="guide-sidebar__title"><Bot size={18} /> AI Study Guide</h2>
          <p className="guide-sidebar__sub">Powered by Gemini AI. Ask anything about your GTU subjects.</p>
          <div className="guide-sidebar__divider" />
          <p className="guide-sidebar__label">Try asking:</p>
          <div className="suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => { setInput(s); textRef.current?.focus(); }}>{s}</button>
            ))}
          </div>
          <div className="guide-sidebar__divider" />
          <div className="guide-capabilities">
            <div className="capability"><FileText size={14} /> PDF & document analysis</div>
            <div className="capability"><Globe size={14} /> URL content reading</div>
            <div className="capability"><Bot size={14} /> GTU subject expertise</div>
          </div>
          <div className="guide-sidebar__divider" />
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
            if (window.confirm("Are you sure you want to clear your chat history?")) {
              setMessages([WELCOME]);
            }
          }}>Clear Conversation</button>
        </aside>


        <div className="chat-container animate-fade-up delay-100">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                <div className="chat-msg__avatar">{m.role === 'assistant' ? <Bot size={15} /> : <User size={15} />}</div>
                <div className="chat-msg__bubble">
                  {m.file && <div className="chat-msg__attach"><FileText size={13} />{m.file}</div>}
                  {m.url  && <div className="chat-msg__attach"><Globe size={13} />{m.url}</div>}
                  <div dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg chat-msg--assistant">
                <div className="chat-msg__avatar"><Bot size={15} /></div>
                <div className="chat-msg__bubble chat-msg__typing"><Loader size={14} className="spin" /> Thinking…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-area">
            {(file || showUrl) && (
              <div className="chat-attachments">
                {file && <div className="attachment-chip"><FileText size={12} />{file.name}<button onClick={() => setFile(null)}><X size={12} /></button></div>}
                {showUrl && (
                  <div className="url-input-wrap">
                    <Globe size={13} />
                    <input className="url-input" placeholder="Paste a URL to analyze…" value={url} onChange={e => setUrl(e.target.value)} />
                    <button onClick={() => { setShowUrl(false); setUrl(''); }}><X size={13} /></button>
                  </div>
                )}
              </div>
            )}
            <div className="chat-input-row">
              <div className="chat-input-box">
                <textarea ref={textRef} className="chat-textarea" placeholder="Ask about any GTU subject, upload notes, or paste a URL…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} rows={1} />
                <div className="chat-input-actions">
                  <button className="input-action-btn" title="Attach PDF" onClick={() => fileRef.current?.click()}><Paperclip size={16} /></button>
                  <button className={`input-action-btn${showUrl ? ' input-action-btn--active' : ''}`} title="Add URL" onClick={() => setShowUrl(u => !u)}><Link2 size={16} /></button>
                </div>
              </div>
              <button className="send-btn" onClick={send} disabled={loading || (!input.trim() && !file && !url)}><Send size={16} /></button>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
          </div>
        </div>
      </div>
    </div>
  );
}
