// ============================================================
//  NexusLib — Database / resources.js
//  Resource generators and reference book map for all subjects
// ============================================================

// ─── Reference Books Map ────────────────────────────────────
const bookMap = {
  'Artificial Intelligence': [
    { title: 'Artificial Intelligence — Russell & Norvig', url: '#' },
    { title: 'AI: A Modern Approach (4th Ed)', url: '#' },
    { title: 'Artificial Intelligence — Rich & Knight', url: '#' },
  ],
  'Operating System': [
    { title: 'Operating System Concepts — Silberschatz', url: '#' },
    { title: 'Modern Operating Systems — Tanenbaum', url: '#' },
  ],
  'Database Management System': [
    { title: 'Database System Concepts — Silberschatz', url: '#' },
    { title: 'Fundamentals of DB Systems — Elmasri', url: '#' },
  ],
  'Computer Networks': [
    { title: 'Computer Networks — Tanenbaum', url: '#' },
    { title: 'Data Communications & Networking — Forouzan', url: '#' },
  ],
  'Web Technology': [
    { title: 'Learning Web Design — Jennifer Niederst Robbins', url: '#' },
    { title: 'HTML & CSS — Jon Duckett', url: '#' },
  ],
  'Software Engineering': [
    { title: 'Software Engineering — Pressman', url: '#' },
    { title: 'The Mythical Man-Month — Brooks', url: '#' },
  ],
  'Theory of Computation': [
    { title: 'Introduction to Automata Theory — Hopcroft', url: '#' },
    { title: 'Theory of Computation — Michael Sipser', url: '#' },
  ],
  'Java & J2EE': [
    { title: 'Core Java — Cay Horstmann', url: '#' },
    { title: 'Effective Java — Joshua Bloch', url: '#' },
  ],
  'Data Mining & Business Intelligence': [
    { title: 'Data Mining: Concepts & Techniques — Han & Kamber', url: '#' },
    { title: 'Data Warehousing Fundamentals — Ponniah', url: '#' },
  ],
  'Dot Net Technology': [
    { title: 'C# in Depth — Jon Skeet', url: '#' },
    { title: 'Pro ASP.NET Core — Adam Freeman', url: '#' },
  ],
  'Information & Network Security': [
    { title: 'Cryptography & Network Security — Stallings', url: '#' },
    { title: 'Network Security Essentials — Stallings', url: '#' },
  ],
  'Machine Learning': [
    { title: 'Hands-On Machine Learning — Géron', url: '#' },
    { title: 'Pattern Recognition — Bishop', url: '#' },
  ],
  'Deep Learning': [
    { title: 'Deep Learning — Goodfellow, Bengio & Courville', url: '#' },
    { title: 'Deep Learning with Python — Chollet', url: '#' },
  ],
};

// ─── Book Lookup Helper ──────────────────────────────────────
export const getBooks = (subject) =>
  bookMap[subject] || [
    { title: `${subject} — Standard Textbook`, url: '#' },
    { title: `${subject} Reference Book`, url: '#' },
  ];

// ─── Resource Generator ──────────────────────────────────────
export const makeResources = (subject) => {
  const slug = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const base = {
    syllabus: {
      label: 'Syllabus',
      desc: 'Module-wise breakdown with exam weightage.',
      tags: ['6 Modules', 'Exam Weightage'],
      items: [
        { title: `${subject} GTU Syllabus (Latest)`, url: `https://www.gtu.ac.in/syllabus/${slug}.pdf` },
        { title: 'Topic-wise Unit Breakdown', url: '#' },
      ],
    },
    pyq: {
      label: 'Previous Year Papers',
      desc: 'GTU exam papers from 2018 to 2024.',
      tags: ['2018–2024', 'Summer & Winter'],
      items: [
        { title: `${subject} Winter 2024`, url: `https://www.gtu.ac.in/pyq/${slug}-w24.pdf` },
        { title: `${subject} Summer 2024`, url: `https://www.gtu.ac.in/pyq/${slug}-s24.pdf` },
        { title: `${subject} Winter 2023`, url: `https://www.gtu.ac.in/pyq/${slug}-w23.pdf` },
        { title: `${subject} Summer 2023`, url: `https://www.gtu.ac.in/pyq/${slug}-s23.pdf` },
        { title: `${subject} Winter 2022`, url: `https://www.gtu.ac.in/pyq/${slug}-w22.pdf` },
      ],
    },
    notes: {
      label: 'Notes & Study Material',
      desc: 'Curated handwritten and typed notes.',
      tags: ['Unit-wise', 'PDF Format'],
      items: [
        { title: `${subject} Complete Notes (Unit 1–6)`, url: '#' },
        { title: 'Short Notes for Exam Revision', url: '#' },
        { title: 'Important Questions & Answers', url: '#' },
      ],
    },
    youtube: {
      label: 'YouTube Playlists',
      desc: 'Curated video lectures for each unit.',
      tags: ['Hindi', 'English', 'Full Course'],
      items: [
        { title: `${subject} Full Course — Neso Academy`, url: 'https://youtube.com' },
        { title: `${subject} in Hindi — Gate Smashers`, url: 'https://youtube.com' },
        { title: 'Concept Videos — Jenny Lectures', url: 'https://youtube.com' },
      ],
    },
    solutions: {
      label: 'Manual Solutions',
      desc: 'Step-by-step solved GTU paper solutions.',
      tags: ['Solved Papers', 'Verified'],
      items: [
        { title: `${subject} Winter 2024 Solutions`, url: '#' },
        { title: `${subject} Summer 2024 Solutions`, url: '#' },
        { title: `${subject} Winter 2023 Solutions`, url: '#' },
      ],
    },
    books: {
      label: 'Reference Books',
      desc: 'Recommended textbooks for deep understanding.',
      tags: ['GTU Recommended', 'Standard Refs'],
      items: getBooks(subject),
    },
  };

  // Dynamically load custom resources from localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('nl_custom_resources');
      if (stored) {
        const customList = JSON.parse(stored);
        customList.forEach(res => {
          if (res.subject === subject && base[res.category]) {
            base[res.category].items.push({
              title: res.title,
              url: res.url || '#',
              isUserUploaded: true,
              uploadedBy: res.uploadedBy || 'Anonymous'
            });
          }
        });
      }
    } catch (e) {
      console.error('Error loading custom resources:', e);
    }
  }

  return base;
};

