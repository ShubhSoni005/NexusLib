// ============================================================
//  NexusLib — Database / semesters.js
//  Defines all semester data per branch (Subjects + metadata)
// ============================================================

export const semesters = {
  IT: [
    { num: 1, phase: 'Foundation', desc: 'Mathematics, Physics, Basic Electronics, Programming Fundamentals.', subjects: ['Mathematics-I','Physics','Basic Electronics','Programming in C','Engineering Drawing','Environmental Science'] },
    { num: 2, phase: 'Foundation', desc: 'Mathematics, Chemistry, Mechanics, Data Structures basics.', subjects: ['Mathematics-II','Chemistry','Engineering Mechanics','Data Structures','Communication Skills','Workshop Practice'] },
    { num: 3, phase: 'Foundation', desc: 'Digital Electronics, OOP, Discrete Mathematics, Computer Organization.', subjects: ['Digital Electronics','Object Oriented Programming (C++)','Discrete Mathematics','Computer Organization','Probability & Statistics','Electrical Circuits'] },
    { num: 4, phase: 'Foundation', desc: 'OS, DBMS, Web Technology, Mathematics-III, Computer Networks basics.', subjects: ['Operating System','Database Management System','Web Technology','Mathematics-III','Computer Organization & Architecture','Disaster Management'] },
    { num: 5, phase: 'Specialization', desc: 'Computer Networks, Software Engineering, Theory of Computation, Java.', subjects: ['Computer Networks','Software Engineering','Theory of Computation','Java & J2EE','System Programming','Linux Administration'] },
    { num: 6, phase: 'Specialization', desc: 'AI, Dot Net, Data Mining, Information Security, Advanced Web.', subjects: ['Artificial Intelligence','Dot Net Technology','Data Mining & Business Intelligence','Information & Network Security','Advanced Web Technology','Professional Elective-I'] },
    { num: 7, phase: 'Specialization', desc: 'Mobile Computing, Distributed Systems, Cloud Computing, Project Phase-I.', subjects: ['Mobile Computing','Information Security','Distributed Systems','Cloud Computing','Project Phase-I','Open Elective'] },
    { num: 8, phase: 'Specialization', desc: 'Cyber Laws, Industrial Internship, Final Project Thesis.', subjects: ['Cyber Laws & Ethics','Industrial Training','Final Project Thesis','Seminar','Open Elective-II'] },
  ],

  CE: [
    { num: 1, phase: 'Foundation', desc: 'Mathematics, Physics, Programming basics.', subjects: ['Mathematics-I','Physics','Programming in C','Basic Electronics','Engineering Drawing','Environmental Science'] },
    { num: 2, phase: 'Foundation', desc: 'Mathematics, Chemistry, Data Structures.', subjects: ['Mathematics-II','Chemistry','Data Structures','OOP with C++','Engineering Mechanics','Communication Skills'] },
    { num: 3, phase: 'Foundation', desc: 'Digital Systems, Algorithms, Discrete Mathematics.', subjects: ['Digital Systems','Design & Analysis of Algorithms','Discrete Mathematics','Computer Architecture','Probability','Electrical Technology'] },
    { num: 4, phase: 'Foundation', desc: 'OS, DBMS, Microprocessors, Web Tech.', subjects: ['Operating System','Database Management System','Microprocessors & Interfacing','Web Technology','Mathematics-III','Disaster Management'] },
    { num: 5, phase: 'Specialization', desc: 'Computer Networks, Compiler Design, Software Engineering.', subjects: ['Computer Networks','Compiler Design','Software Engineering','Java Programming','System Programming','Elective-I'] },
    { num: 6, phase: 'Specialization', desc: 'AI, Embedded Systems, Data Mining, Network Security.', subjects: ['Artificial Intelligence','Embedded Systems','Data Mining','Network Security','Advanced Java','Elective-II'] },
    { num: 7, phase: 'Specialization', desc: 'Cloud Computing, Mobile App, Project Phase-I.', subjects: ['Cloud Computing','Mobile Application Development','Distributed Systems','Project Phase-I','Open Elective'] },
    { num: 8, phase: 'Specialization', desc: 'Industrial Internship, Final Thesis.', subjects: ['Industrial Training','Final Project Thesis','Seminar','Cyber Laws'] },
  ],

  CSE: [
    { num: 1, phase: 'Foundation', desc: 'Mathematics, Physics, Programming basics.', subjects: ['Mathematics-I','Physics','Programming in C','Basic Electronics','Engineering Drawing','Environmental Science'] },
    { num: 2, phase: 'Foundation', desc: 'Mathematics, Chemistry, Data Structures.', subjects: ['Mathematics-II','Chemistry','Data Structures','OOP','Engineering Mechanics','Communication Skills'] },
    { num: 3, phase: 'Foundation', desc: 'Digital Logic, Algorithms, Computer Architecture.', subjects: ['Digital Logic Design','Algorithms','Computer Architecture','Discrete Mathematics','Probability','Electrical Technology'] },
    { num: 4, phase: 'Foundation', desc: 'OS, DBMS, Cloud Fundamentals, Web Tech.', subjects: ['Operating System','Database Management System','Cloud Computing Fundamentals','Web Technology','Mathematics-III','Disaster Management'] },
    { num: 5, phase: 'Specialization', desc: 'Machine Learning, Networks, Cybersecurity.', subjects: ['Machine Learning','Computer Networks','Cybersecurity Fundamentals','Software Engineering','Big Data Analytics','Elective-I'] },
    { num: 6, phase: 'Specialization', desc: 'Deep Learning, Cloud Services, Data Science, AI Ethics.', subjects: ['Deep Learning','Cloud Services & AWS','Data Science','AI & Ethics','DevOps','Elective-II'] },
    { num: 7, phase: 'Specialization', desc: 'Advanced Cloud, Blockchain, Project Phase-I.', subjects: ['Advanced Cloud Architecture','Blockchain Technology','NLP','Project Phase-I','Open Elective'] },
    { num: 8, phase: 'Specialization', desc: 'Industrial Internship, Final Thesis.', subjects: ['Industrial Training','Final Project Thesis','Seminar','Cyber Laws & Ethics'] },
  ],
};
