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

    // ── Study Plans & Scheduling ──────────────────────────────
    if (p.includes('study plan') || p.includes('schedule') || p.includes('timetable') || p.includes('routine'))
      return `**📅 Personalized Study Plan**\n\n**Week 1 — Foundation:**\n• Day 1–2: Unit 1 & 2 (concepts + textbook notes)\n• Day 3–4: Unit 3 & 4 (practice problems + short notes)\n• Day 5–6: Solve PYQ papers (Winter & Summer 2022–2023)\n• Day 7: Revision of weak areas + formula sheet\n\n**Week 2 — Mastery:**\n• Day 1–2: Unit 5 & 6 deep dive\n• Day 3–4: Full mock tests from PYQs (timed)\n• Day 5: Revise all short notes + important definitions\n• Day 6: Practice numerical problems & diagrams\n• Day 7: Final revision — formula sheet + last-minute topics\n\n**Daily Routine:**\n• 🕐 Morning (2 hrs): New concepts from textbook\n• 🕑 Afternoon (2 hrs): Practice questions & PYQs\n• 🕓 Evening (1 hr): Revision + short notes\n\n**Pro Tips:**\n• Solve minimum 3 PYQs per subject daily\n• Focus on 7-mark and 4-mark questions first\n• Mark frequently repeated questions across papers`;

    // ── Artificial Intelligence ───────────────────────────────
    if (p.includes('artificial intelligence') || (p.includes('ai') && !p.includes('email') && !p.includes('wait')))
      return `**🤖 Artificial Intelligence — GTU Complete Guide**\n\n**Unit 1: Introduction to AI**\n• Definition, history, Turing Test, intelligent agents\n• Problem solving — state space, search trees\n\n**Unit 2: Search Strategies**\n• Uninformed: BFS, DFS, Uniform Cost, Iterative Deepening\n• Informed: Greedy Best-First, A* Algorithm (most asked!)\n• Game Playing: Minimax, Alpha-Beta Pruning\n\n**Unit 3: Knowledge Representation**\n• Propositional & First-Order Logic\n• Semantic Nets, Frames, Scripts\n• Unification & Resolution\n\n**Unit 4: Planning**\n• STRIPS, Goal Stack Planning\n• Partial Order Planning\n\n**Unit 5: Machine Learning Basics**\n• Supervised vs Unsupervised Learning\n• Decision Trees, k-NN, Naive Bayes\n\n**Unit 6: Advanced Topics**\n• Neural Networks, NLP fundamentals\n• Expert Systems — architecture & working\n\n**🔥 Most asked in GTU exams:**\n• A* algorithm with heuristic (7 marks)\n• Minimax with Alpha-Beta pruning (7 marks)\n• First Order Logic resolution (4 marks)\n• Constraint Satisfaction Problems (4 marks)`;

    // ── DBMS ──────────────────────────────────────────────────
    if (p.includes('dbms') || p.includes('database management'))
      return `**🗄️ DBMS — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• Database concepts, DBMS architecture (3-tier)\n• Data models — Relational, Hierarchical, Network\n• Data independence — logical & physical\n\n**Unit 2: ER Model & Relational Model**\n• Entities, Attributes, Relationships, Cardinality\n• ER to Relational mapping (frequently asked!)\n• Relational algebra & calculus\n\n**Unit 3: SQL**\n• DDL: CREATE, ALTER, DROP\n• DML: SELECT, INSERT, UPDATE, DELETE\n• Joins: INNER, LEFT, RIGHT, FULL, CROSS\n• Subqueries, Views, Stored Procedures\n\n**Unit 4: Normalization**\n• Functional Dependencies\n• 1NF → 2NF → 3NF → BCNF (most asked topic!)\n• Decomposition — lossless join & dependency preserving\n\n**Unit 5: Transaction Management**\n• ACID properties\n• Concurrency control — locks, 2PL, timestamp ordering\n• Deadlock detection & recovery\n\n**Unit 6: Indexing & File Organization**\n• B-tree, B+ tree indexing\n• Hashing — static & dynamic\n\n**🔥 PYQ Tip:** Normalization (1NF–BCNF) and SQL queries appear in every single paper. Master these first.`;

    // ── Operating System ──────────────────────────────────────
    if (p.includes('operating system') || p.includes(' os ') || p.match(/\bos\b/))
      return `**💻 Operating System — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• OS types — batch, multiprogramming, time-sharing, real-time\n• System calls, OS structure (monolithic, microkernel)\n\n**Unit 2: Process Management**\n• Process states, PCB, context switching\n• CPU Scheduling: FCFS, SJF, Priority, Round Robin (most asked!)\n• Preemptive vs Non-preemptive scheduling\n\n**Unit 3: Process Synchronization**\n• Critical section problem\n• Semaphores, Mutex, Monitors\n• Producer-Consumer, Readers-Writers, Dining Philosophers\n\n**Unit 4: Deadlocks**\n• Conditions, Resource Allocation Graph\n• Banker's Algorithm (7-mark favourite!)\n• Deadlock detection & recovery\n\n**Unit 5: Memory Management**\n• Paging, Segmentation, Virtual Memory\n• Page replacement: FIFO, LRU, Optimal\n• Thrashing & working set model\n\n**Unit 6: File & Disk Management**\n• File allocation methods\n• Disk scheduling: FCFS, SSTF, SCAN, C-SCAN\n\n**🔥 Most asked:** CPU scheduling numericals, Banker's Algorithm, Page replacement numericals`;

    // ── Computer Networks ─────────────────────────────────────
    if (p.includes('computer network') || p.includes('networking') || p.includes('cn '))
      return `**🌐 Computer Networks — GTU Complete Guide**\n\n**Unit 1: Introduction & Physical Layer**\n• OSI Model vs TCP/IP Model (always asked!)\n• Transmission media — guided & unguided\n• Multiplexing — FDM, TDM, WDM\n\n**Unit 2: Data Link Layer**\n• Error detection: Parity, CRC, Checksum\n• Flow control: Stop-and-Wait, Sliding Window\n• MAC protocols: ALOHA, CSMA/CD, CSMA/CA\n\n**Unit 3: Network Layer**\n• IPv4 addressing, Subnetting, CIDR (most asked!)\n• Routing: Distance Vector, Link State, OSPF, BGP\n• ARP, RARP, ICMP\n\n**Unit 4: Transport Layer**\n• TCP vs UDP — detailed comparison\n• TCP: 3-way handshake, flow control, congestion control\n• Port numbers & socket programming concepts\n\n**Unit 5: Application Layer**\n• DNS, HTTP/HTTPS, FTP, SMTP, POP3, IMAP\n• Web architecture, cookies, sessions\n\n**Unit 6: Security**\n• Cryptography basics, RSA, DES, AES\n• Firewalls, VPN, SSL/TLS\n\n**🔥 PYQ Tip:** Subnetting problems and OSI vs TCP/IP comparison appear in every paper.`;

    // ── Data Structures ──────────────────────────────────────
    if (p.includes('data structure'))
      return `**📊 Data Structures — GTU Complete Guide**\n\n**Unit 1: Arrays & Strings**\n• 1D & 2D arrays, string operations\n• Time complexity analysis — Big O, Omega, Theta\n\n**Unit 2: Linked Lists**\n• Singly, Doubly, Circular linked lists\n• Operations: insertion, deletion, reversal\n\n**Unit 3: Stacks & Queues**\n• Stack applications: infix to postfix, expression evaluation\n• Queue types: circular, deque, priority queue\n\n**Unit 4: Trees**\n• Binary Tree, BST — insertion, deletion, traversals\n• AVL Trees — rotations (LL, RR, LR, RL)\n• Heap — min heap, max heap, heapsort\n\n**Unit 5: Graphs**\n• BFS, DFS traversals\n• Shortest path: Dijkstra's, Bellman-Ford\n• MST: Prim's, Kruskal's (favourite 7-mark questions!)\n\n**Unit 6: Sorting & Hashing**\n• Bubble, Selection, Insertion, Merge, Quick, Radix sort\n• Hashing — collision resolution: chaining, open addressing\n\n**🔥 Most asked:** BST operations, AVL rotations, Dijkstra's algorithm, sorting comparisons`;

    // ── Web Technology ────────────────────────────────────────
    if (p.includes('web tech') || p.includes('web development') || p.includes('html') || p.includes('css') || p.includes('javascript'))
      return `**🌍 Web Technology — GTU Complete Guide**\n\n**Unit 1: HTML5**\n• Semantic tags, forms, input types, tables\n• Audio, video, canvas elements\n\n**Unit 2: CSS3**\n• Selectors, box model, flexbox, grid\n• Responsive design, media queries\n• Animations & transitions\n\n**Unit 3: JavaScript**\n• Variables, data types, functions, closures\n• DOM manipulation, event handling\n• ES6+: let/const, arrow functions, promises, async/await\n\n**Unit 4: Server-Side (PHP/Node.js)**\n• Form handling, sessions, cookies\n• Database connectivity (MySQL with PHP)\n\n**Unit 5: XML & AJAX**\n• XML syntax, DTD, XML Schema\n• AJAX — XMLHttpRequest, JSON, fetch API\n\n**Unit 6: Frameworks & Modern Web**\n• React/Angular basics\n• RESTful APIs, MVC architecture\n\n**🔥 PYQ Tip:** HTML form + JavaScript validation combo and PHP-MySQL CRUD are guaranteed questions.`;

    // ── Software Engineering ──────────────────────────────────
    if (p.includes('software engineering') || p.includes('sdlc') || p.includes('software development'))
      return `**⚙️ Software Engineering — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• Software crisis, characteristics, SE myths\n• Process models: Waterfall, Iterative, Spiral, V-Model\n\n**Unit 2: Agile & Requirements**\n• Agile methodology, Scrum, XP\n• SRS document, functional & non-functional requirements\n• Use case diagrams\n\n**Unit 3: Design**\n• Architectural design, modular design\n• Cohesion & Coupling (frequently asked!)\n• UML diagrams: class, sequence, activity, state\n\n**Unit 4: Testing**\n• White box: basis path, loop testing\n• Black box: equivalence partitioning, boundary value analysis\n• Unit, integration, system, acceptance testing\n\n**Unit 5: Project Management**\n• Effort estimation: COCOMO model (most asked!)\n• Risk management, project scheduling (Gantt, PERT)\n• Software metrics — LOC, function points\n\n**Unit 6: Quality & Maintenance**\n• SQA, CMM levels, ISO 9001\n• Types of maintenance: corrective, adaptive, perfective\n\n**🔥 Most asked:** COCOMO estimation, cohesion-coupling types, testing techniques, process model comparison`;

    // ── Java / J2EE ───────────────────────────────────────────
    if (p.includes('java') || p.includes('j2ee') || p.includes('jsp') || p.includes('servlet'))
      return `**☕ Java & J2EE — GTU Complete Guide**\n\n**Unit 1: Java Fundamentals**\n• OOP concepts — encapsulation, inheritance, polymorphism, abstraction\n• Classes, objects, constructors, method overloading/overriding\n\n**Unit 2: Advanced Java**\n• Interfaces, abstract classes, packages\n• Exception handling — try/catch/finally, custom exceptions\n• Multithreading — Thread class, Runnable, synchronization\n\n**Unit 3: Collections & I/O**\n• List, Set, Map interfaces\n• ArrayList, LinkedList, HashMap, TreeMap\n• File I/O — streams, readers, writers\n\n**Unit 4: JDBC**\n• Database connectivity — DriverManager, Connection, Statement\n• PreparedStatement, ResultSet\n• CRUD operations with MySQL\n\n**Unit 5: Servlets**\n• Servlet lifecycle, HttpServlet\n• Request/Response handling, session management\n• Cookies, URL rewriting, HttpSession\n\n**Unit 6: JSP**\n• JSP lifecycle, scriptlets, directives, actions\n• Expression Language (EL), JSTL\n• MVC with Servlets + JSP\n\n**🔥 Most asked:** OOP concepts, exception handling, JDBC CRUD, servlet lifecycle, JSP vs Servlet comparison`;

    // ── Theory of Computation ─────────────────────────────────
    if (p.includes('theory of computation') || p.includes('toc') || p.includes('automata'))
      return `**🧮 Theory of Computation — GTU Complete Guide**\n\n**Unit 1: Finite Automata**\n• DFA, NFA — construction & conversion (most asked!)\n• NFA to DFA conversion (subset construction)\n• Minimization of DFA\n\n**Unit 2: Regular Expressions & Languages**\n• Regular expressions — construction from language\n• Pumping Lemma for regular languages\n• Closure properties of regular languages\n\n**Unit 3: Context-Free Grammars**\n• CFG — derivation trees, ambiguity\n• Simplification: removing null/unit/useless productions\n• Chomsky Normal Form (CNF), Greibach Normal Form (GNF)\n\n**Unit 4: Pushdown Automata**\n• PDA — construction for given CFL\n• DPDA vs NPDA\n• CFG to PDA conversion\n\n**Unit 5: Turing Machines**\n• TM design for languages (7-mark favourite!)\n• Variants — multi-tape, non-deterministic\n• Church-Turing thesis\n\n**Unit 6: Decidability & Complexity**\n• Decidable vs undecidable problems\n• Halting problem, Rice's theorem\n• P vs NP, NP-complete, NP-hard\n\n**🔥 PYQ Tip:** NFA to DFA conversion, TM design, and CFG simplification are guaranteed every exam.`;

    // ── Machine Learning ─────────────────────────────────────
    if (p.includes('machine learning') || p.includes(' ml ') || p.match(/\bml\b/))
      return `**🧠 Machine Learning — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• Types: Supervised, Unsupervised, Reinforcement\n• Training, validation, test sets\n• Bias-variance tradeoff, overfitting, underfitting\n\n**Unit 2: Regression**\n• Linear Regression — cost function, gradient descent\n• Polynomial regression, regularization (L1, L2)\n\n**Unit 3: Classification**\n• Logistic Regression, k-NN, Naive Bayes\n• Decision Trees — ID3, C4.5, CART\n• SVM — kernels, margin, hyperplane\n\n**Unit 4: Ensemble Methods**\n• Random Forest, Bagging, Boosting\n• AdaBoost, Gradient Boosting, XGBoost\n\n**Unit 5: Unsupervised Learning**\n• K-Means clustering, Hierarchical clustering\n• PCA (Principal Component Analysis)\n• Association rules — Apriori algorithm\n\n**Unit 6: Neural Networks**\n• Perceptron, multilayer networks, backpropagation\n• Activation functions: sigmoid, ReLU, softmax\n• Introduction to deep learning\n\n**🔥 Most asked:** Linear regression derivation, decision tree construction, k-means algorithm, confusion matrix`;

    // ── Cloud Computing ──────────────────────────────────────
    if (p.includes('cloud computing') || p.includes('cloud'))
      return `**☁️ Cloud Computing — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• Cloud definition, characteristics (NIST model)\n• Cloud vs traditional computing\n\n**Unit 2: Service Models**\n• IaaS, PaaS, SaaS — comparison & examples\n• Deployment: public, private, hybrid, community cloud\n\n**Unit 3: Virtualization**\n• Types: full, para, OS-level virtualization\n• Hypervisors — Type 1 (bare-metal) vs Type 2 (hosted)\n• Virtual machines vs containers\n\n**Unit 4: Cloud Platforms**\n• AWS, Azure, Google Cloud — key services\n• Compute, storage, networking services\n\n**Unit 5: Cloud Security**\n• Shared responsibility model\n• Identity & access management\n• Encryption, compliance, data privacy\n\n**Unit 6: Case Studies**\n• Cloud migration strategies\n• Serverless computing, microservices\n\n**🔥 Most asked:** IaaS vs PaaS vs SaaS comparison, virtualization types, cloud security challenges`;

    // ── Data Mining ───────────────────────────────────────────
    if (p.includes('data mining') || p.includes('business intelligence'))
      return `**⛏️ Data Mining & BI — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• KDD process, data mining tasks\n• Data preprocessing: cleaning, integration, transformation\n\n**Unit 2: Association Rules**\n• Apriori algorithm (most asked!)\n• Support, confidence, lift measures\n• FP-Growth algorithm\n\n**Unit 3: Classification**\n• Decision trees, Naive Bayes, k-NN\n• Confusion matrix, accuracy, precision, recall\n\n**Unit 4: Clustering**\n• K-Means, hierarchical clustering\n• DBSCAN, density-based methods\n\n**Unit 5: Data Warehousing**\n• Star schema, Snowflake schema\n• OLAP operations: roll-up, drill-down, slice, dice\n• ETL process\n\n**Unit 6: Business Intelligence**\n• BI tools & dashboards\n• Data visualization, reporting\n\n**🔥 PYQ Tip:** Apriori algorithm numerical and Star vs Snowflake schema comparison appear every exam.`;

    // ── Information & Network Security ────────────────────────
    if (p.includes('network security') || p.includes('information security') || p.includes('cryptography') || p.includes('cyber'))
      return `**🔐 Information & Network Security — GTU Complete Guide**\n\n**Unit 1: Introduction**\n• Security goals: CIA triad (Confidentiality, Integrity, Availability)\n• Types of attacks: passive, active, DoS, MITM\n\n**Unit 2: Symmetric Encryption**\n• DES — detailed algorithm, key generation\n• AES — rounds, SubBytes, ShiftRows, MixColumns\n• Block cipher modes: ECB, CBC, CFB, OFB, CTR\n\n**Unit 3: Asymmetric Encryption**\n• RSA algorithm (7-mark favourite!)\n• Diffie-Hellman key exchange\n• Elliptic Curve Cryptography basics\n\n**Unit 4: Hash Functions & Digital Signatures**\n• MD5, SHA family\n• Digital signatures, certificates, PKI\n• Message authentication codes (MAC, HMAC)\n\n**Unit 5: Network Security**\n• Firewalls — types, packet filtering, proxy\n• VPN, IPSec, SSL/TLS\n• Intrusion Detection Systems (IDS)\n\n**Unit 6: Application Security**\n• Email security (PGP, S/MIME)\n• Web security: SQL injection, XSS, CSRF\n• Cyber laws & ethics\n\n**🔥 Most asked:** RSA numerical, DES algorithm steps, firewall types, CIA triad explanation`;

    // ── Dot Net Technology ────────────────────────────────────
    if (p.includes('.net') || p.includes('dot net') || p.includes('c#') || p.includes('asp.net'))
      return `**🔷 Dot Net Technology — GTU Complete Guide**\n\n**Unit 1: .NET Framework**\n• CLR, CTS, CLS, MSIL, JIT compilation\n• .NET architecture, assemblies, namespaces\n\n**Unit 2: C# Fundamentals**\n• Data types, operators, control structures\n• Classes, objects, inheritance, polymorphism\n• Properties, indexers, delegates, events\n\n**Unit 3: Advanced C#**\n• Exception handling, collections (generic & non-generic)\n• LINQ — query syntax, method syntax\n• File I/O, serialization\n\n**Unit 4: ADO.NET**\n• Connected vs disconnected architecture\n• SqlConnection, SqlCommand, SqlDataReader\n• DataSet, DataAdapter, DataTable\n\n**Unit 5: ASP.NET Web Forms**\n• Page lifecycle, server controls\n• State management: ViewState, Session, Cookies\n• Validation controls\n\n**Unit 6: ASP.NET MVC**\n• MVC pattern, routing, controllers, views\n• Razor syntax, Entity Framework basics\n\n**🔥 Most asked:** CLR architecture, ADO.NET connected/disconnected, page lifecycle, C# delegates vs events`;

    // ── Exam Tips / General Study ─────────────────────────────
    if (p.includes('exam tip') || p.includes('exam preparation') || p.includes('how to study') || p.includes('how to prepare'))
      return `**📝 GTU Exam Preparation — Pro Tips**\n\n**Before the Exam:**\n• Start with PYQs — solve at least 5 years of papers per subject\n• Identify repeated questions — GTU repeats 40-60% of questions!\n• Make formula/definition sheets for quick revision\n• Focus on 7-mark questions first (highest impact)\n\n**Study Strategy:**\n• 📖 Read the textbook for concepts (don't just memorize)\n• ✍️ Write short notes — helps retention by 70%\n• 🔄 Revise every 3 days using spaced repetition\n• 👥 Form study groups for difficult subjects\n\n**During the Exam:**\n• Read all questions first, start with what you know best\n• For 7-mark Qs: intro → explanation → diagram → example → conclusion\n• For 4-mark Qs: be concise, use bullet points\n• Draw diagrams wherever possible — they carry marks!\n• Write neatly, use headings and underline keywords\n\n**Time Management:**\n• Total: 2.5 hours for 70 marks\n• Allocate ~2 min per mark (7-mark Q = 14 min)\n• Keep 15 minutes at the end for review`;

    // ── PYQ / Previous Year Papers ────────────────────────────
    if (p.includes('pyq') || p.includes('previous year') || p.includes('past paper') || p.includes('question paper'))
      return `**📄 Previous Year Papers — Strategy Guide**\n\n**Why PYQs matter at GTU:**\n• GTU repeats 40-60% of questions across papers\n• Understanding paper patterns helps predict questions\n• Builds exam-speed writing practice\n\n**How to use PYQs effectively:**\n• Step 1: Collect papers from Winter & Summer (2019–2024)\n• Step 2: Highlight questions that appear 3+ times → these are almost guaranteed\n• Step 3: Solve without looking at answers first\n• Step 4: Time yourself — simulate real exam conditions\n• Step 5: Review mistakes, make an error log\n\n**Where to find PYQs:**\n• GTU official website (gtu.ac.in)\n• NexusLib resource sections (organized by subject)\n• College libraries, senior student notes\n\n**Pro Tip:** Create a "hot topics" list per subject — the 10 questions that appear most frequently. Master those first.`;

    // ── Mathematics ───────────────────────────────────────────
    if (p.includes('math') || p.includes('calculus') || p.includes('linear algebra') || p.includes('discrete math'))
      return `**📐 Mathematics — GTU Key Topics**\n\n**Mathematics-I:**\n• Limits, continuity, differentiation\n• Integration — by parts, partial fractions\n• Taylor & Maclaurin series\n• Matrices — rank, inverse, eigenvalues\n\n**Mathematics-II:**\n• Differential equations — first order, second order\n• Laplace transforms\n• Fourier series\n\n**Mathematics-III:**\n• Complex analysis — analytic functions, Cauchy-Riemann\n• Probability & Statistics — Bayes' theorem, distributions\n• Numerical methods — Newton-Raphson, Simpson's rule\n\n**Discrete Mathematics:**\n• Set theory, relations, functions\n• Graph theory — Euler, Hamilton, coloring\n• Combinatorics — permutations, combinations\n• Boolean algebra, logic gates\n\n**🔥 Pro Tip:** Practice numericals daily. Maths marks are the easiest to score if you practice enough PYQs.`;

    // ── Generic Fallback (when no keyword matches) ────────────
    return `**📚 NexusLib AI — Study Assistant**\n\nI've noted your question about "${prompt.slice(0, 80)}"\n\nWhile I process this, here are some universal GTU study tips:\n\n**Quick Action Plan:**\n• 📖 Start with the official GTU syllabus for your subject\n• 📝 Solve PYQs from 2019–2024 (GTU repeats 40-60% of questions!)\n• 🗂️ Create unit-wise short notes with key definitions\n• 🔢 Practice numerical problems daily — they carry the most marks\n• 📊 Draw diagrams wherever applicable — examiners love visual answers\n\n**Try asking me about specific subjects:**\n• "Explain AI search algorithms"\n• "Key topics in DBMS for GTU"\n• "Create a 2-week study plan"\n• "Important OS topics for exam"\n• "Computer Networks Unit 3 summary"\n\nI'm here to help you ace your exams! 🎯`;
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
