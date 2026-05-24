// ============================================================
//  NexusLib — Database / index.js
//  Central export point — import everything from here
//
//  Usage:
//    import { branches, semesters, getSubjectData } from '@db'
// ============================================================

export { branches }       from './branches.js';
export { semesters }      from './semesters.js';
export { getBooks, makeResources } from './resources.js';

import { makeResources }  from './resources.js';

// ─── Main Subject Data Getter ────────────────────────────────
// Returns full resource data for a given branch / sem / subject
export const getSubjectData = (branch, semNum, subject) => ({
  name: subject,
  branch,
  sem: semNum,
  resources: makeResources(subject),
});
