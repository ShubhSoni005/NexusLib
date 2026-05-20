export const branches = [
  { id: 'IT', name: 'Information Technology', tag: 'TECH', desc: 'OS, DBMS, Web Tech, and Networking resources.', color: '#6366f1' },
  { id: 'CE', name: 'Computer Engineering', tag: 'SYSTEMS', desc: 'Algorithms, Architecture, and Hardware design.', color: '#8b5cf6' },
  { id: 'CSE', name: 'CSE (Cloud & CS)', tag: 'SCIENCE', desc: 'Specialized materials for Cloud, AI, and Cybersecurity.', color: '#06b6d4' },
];

export const semesters = {
  IT: [
    { num: 1, desc: 'Mathematics, Physics, Basic Electronics, Programming Fundamentals.', phase: 'Foundation', subjects: ['Mathematics-I','Physics','Basic Electronics','Programming in C','Engineering Drawing','Environmental Science'] },
    { num: 2, desc: 'Mathematics, Chemistry, Mechanics, Data Structures basics.', phase: 'Foundation', subjects: ['Mathematics-II','Chemistry','Engineering Mechanics','Data Structures','Communication Skills','Workshop Practice'] },
    { num: 3, desc: 'Digital Electronics, OOP, Discrete Mathematics, Computer Organization.', phase: 'Foundation', subjects: ['Digital Electronics','Object Oriented Programming (C++)','Discrete Mathematics','Computer Organization','Probability & Statistics','Electrical Circuits'] },
    { num: 4, desc: 'OS, DBMS, Web Technology, Mathematics-III, Computer Networks basics.', phase: 'Foundation', subjects: ['Operating System','Database Management System','Web Technology','Mathematics-III','Computer Organization & Architecture','Disaster Management'] },
    { num: 5, desc: 'Computer Networks, Software Engineering, Theory of Computation, Java.', phase: 'Specialization', subjects: ['Computer Networks','Software Engineering','Theory of Computation','Java & J2EE','System Programming','Linux Administration'] },
    { num: 6, desc: 'AI, Dot Net, Data Mining, Information Security, Advanced Web.', phase: 'Specialization', subjects: ['Artificial Intelligence','Dot Net Technology','Data Mining & Business Intelligence','Information & Network Security','Advanced Web Technology','Professional Elective-I'] },
    { num: 7, desc: 'Mobile Computing, Information Security, Project Phase-I.', phase: 'Specialization', subjects: ['Mobile Computing','Information Security','Distributed Systems','Cloud Computing','Project Phase-I','Open Elective'] },
    { num: 8, desc: 'Cyber Laws, Industrial Internship, Final Project Thesis.', phase: 'Specialization', subjects: ['Cyber Laws & Ethics','Industrial Training','Final Project Thesis','Seminar','Open Elective-II'] },
  ],
  CE: [
    { num: 1, desc: 'Mathematics, Physics, Programming basics.', phase: 'Foundation', subjects: ['Mathematics-I','Physics','Programming in C','Basic Electronics','Engineering Drawing','Environmental Science'] },
    { num: 2, desc: 'Mathematics, Chemistry, Data Structures.', phase: 'Foundation', subjects: ['Mathematics-II','Chemistry','Data Structures','OOP with C++','Engineering Mechanics','Communication Skills'] },
    { num: 3, desc: 'Digital Systems, Algorithms, Discrete Mathematics.', phase: 'Foundation', subjects: ['Digital Systems','Design & Analysis of Algorithms','Discrete Mathematics','Computer Architecture','Probability','Electrical Technology'] },
    { num: 4, desc: 'OS, DBMS, Microprocessors, Web Tech.', phase: 'Foundation', subjects: ['Operating System','Database Management System','Microprocessors & Interfacing','Web Technology','Mathematics-III','Disaster Management'] },
    { num: 5, desc: 'Computer Networks, Compiler Design, Software Engineering.', phase: 'Specialization', subjects: ['Computer Networks','Compiler Design','Software Engineering','Java Programming','System Programming','Elective-I'] },
    { num: 6, desc: 'AI, Embedded Systems, Data Mining, Network Security.', phase: 'Specialization', subjects: ['Artificial Intelligence','Embedded Systems','Data Mining','Network Security','Advanced Java','Elective-II'] },
    { num: 7, desc: 'Cloud Computing, Mobile App, Project Phase-I.', phase: 'Specialization', subjects: ['Cloud Computing','Mobile Application Development','Distributed Systems','Project Phase-I','Open Elective'] },
    { num: 8, desc: 'Industrial Internship, Final Thesis.', phase: 'Specialization', subjects: ['Industrial Training','Final Project Thesis','Seminar','Cyber Laws'] },
  ],
  CSE: [
    { num: 1, desc: 'Mathematics, Physics, Programming basics.', phase: 'Foundation', subjects: ['Mathematics-I','Physics','Programming in C','Basic Electronics','Engineering Drawing','Environmental Science'] },
    { num: 2, desc: 'Mathematics, Chemistry, Data Structures.', phase: 'Foundation', subjects: ['Mathematics-II','Chemistry','Data Structures','OOP','Engineering Mechanics','Communication Skills'] },
    { num: 3, desc: 'Digital Logic, Algorithms, Computer Architecture.', phase: 'Foundation', subjects: ['Digital Logic Design','Algorithms','Computer Architecture','Discrete Mathematics','Probability','Electrical Technology'] },
    { num: 4, desc: 'OS, DBMS, Cloud Fundamentals, Web Tech.', phase: 'Foundation', subjects: ['Operating System','Database Management System','Cloud Computing Fundamentals','Web Technology','Mathematics-III','Disaster Management'] },
    { num: 5, desc: 'Machine Learning, Networks, Cybersecurity.', phase: 'Specialization', subjects: ['Machine Learning','Computer Networks','Cybersecurity Fundamentals','Software Engineering','Big Data Analytics','Elective-I'] },
    { num: 6, desc: 'Deep Learning, Cloud Services, Data Science, AI Ethics.', phase: 'Specialization', subjects: ['Deep Learning','Cloud Services & AWS','Data Science','AI & Ethics','DevOps','Elective-II'] },
    { num: 7, desc: 'Advanced Cloud, Blockchain, Project Phase-I.', phase: 'Specialization', subjects: ['Advanced Cloud Architecture','Blockchain Technology','NLP','Project Phase-I','Open Elective'] },
    { num: 8, desc: 'Industrial Internship, Final Thesis.', phase: 'Specialization', subjects: ['Industrial Training','Final Project Thesis','Seminar','Cyber Laws & Ethics'] },
  ],
};

const makeResources = (subject, sem) => {
  const slug = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    syllabus: {
      label: 'Syllabus',
      desc: 'Module-wise breakdown with exam weightage.',
      tags: ['6 Modules','Exam Weightage'],
      items: [
        { title: `${subject} GTU Syllabus (Latest)`, url: `https://www.gtu.ac.in/syllabus/${slug}.pdf` },
        { title: 'Topic-wise Unit Breakdown', url: '#' },
      ],
    },
    pyq: {
      label: 'Previous Year Papers',
      desc: 'GTU exam papers from 2018 to 2024.',
      tags: ['2018–2024','Summer & Winter'],
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
      tags: ['Unit-wise','PDF Format'],
      items: [
        { title: `${subject} Complete Notes (Unit 1–6)`, url: '#' },
        { title: 'Short Notes for Exam Revision', url: '#' },
        { title: 'Important Questions & Answers', url: '#' },
      ],
    },
    youtube: {
      label: 'YouTube Playlists',
      desc: 'Curated video lectures for each unit.',
      tags: ['Hindi','English','Full Course'],
      items: [
        { title: `${subject} Full Course — Neso Academy`, url: 'https://youtube.com' },
        { title: `${subject} in Hindi — Gate Smashers`, url: 'https://youtube.com' },
        { title: 'Concept Videos — Jenny Lectures', url: 'https://youtube.com' },
      ],
    },
    solutions: {
      label: 'Manual Solutions',
      desc: 'Step-by-step solved GTU paper solutions.',
      tags: ['Solved Papers','Verified'],
      items: [
        { title: `${subject} Winter 2024 Solutions`, url: '#' },
        { title: `${subject} Summer 2024 Solutions`, url: '#' },
        { title: `${subject} Winter 2023 Solutions`, url: '#' },
      ],
    },
    books: {
      label: 'Reference Books',
      desc: 'Recommended textbooks for deep understanding.',
      tags: ['GTU Recommended','Standard Refs'],
      items: getBooks(subject),
    },
  };
};

const getBooks = (subject) => {
  const map = {
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
  return map[subject] || [
    { title: `${subject} — Standard Textbook`, url: '#' },
    { title: `${subject} Reference Book`, url: '#' },
  ];
};

export const getSubjectData = (branch, semNum, subject) => {
  return {
    name: subject,
    branch,
    sem: semNum,
    resources: makeResources(subject, semNum),
  };
};
