/* ============================================================
   STUDYFLOW — app.js
   UI Logic, Navigation, LocalStorage, PDF Export, Toast
   ============================================================ */

/* =========================================================
   STATE
========================================================= */
let currentPage = 'doubt';
let lastDoubtHTML = '';
let lastAssignHTML = '';
let lastRoadmapHTML = '';
let lastFlowchartHTML = '';
let lastNoteHTML = '';

/* =========================================================
   NAVIGATION
========================================================= */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (pageEl) pageEl.classList.add('active');
  if (navEl) navEl.classList.add('active');
  currentPage = page;
  closeSidebar();
  if (page === 'saved') renderSaved('all');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('visible');
}

/* =========================================================
   THEME
========================================================= */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sf-theme', next);
}

function initTheme() {
  const saved = localStorage.getItem('sf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

/* =========================================================
   LOADING STATE
========================================================= */
function showLoading(container) {
  container.style.display = 'block';
  container.querySelector('.result-content').innerHTML = `
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
  `;
}

function setResult(container, contentId, html) {
  container.style.display = 'block';
  document.getElementById(contentId).innerHTML = html;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* =========================================================
   DOUBT SOLVER
========================================================= */
function handleDoubtSolve() {
  const input = document.getElementById('doubtInput').value.trim();
  if (!input) { showToast('Please enter your question first!'); return; }

  const forcedSubject = document.getElementById('doubtSubject').value;
  const resultArea = document.getElementById('doubtResult');
  const titleEl = document.getElementById('doubtResultTitle');

  showLoading(resultArea);

  setTimeout(() => {
    const result = StudyEngine.solveDoubt(input, forcedSubject);
    lastDoubtHTML = result.html;
    const subject = result.subject.charAt(0).toUpperCase() + result.subject.slice(1);
    titleEl.textContent = `${subject} — Solution`;
    setResult(resultArea, 'doubtResultContent', result.html);
    // Save query to history
    addToHistory('doubt', input, result.html);
  }, 600);
}

function fillDoubt(text) {
  document.getElementById('doubtInput').value = text;
  document.getElementById('doubtInput').focus();
}

function fillRoadmap(text) {
  document.getElementById('roadmapGoal').value = text;
  document.getElementById('roadmapGoal').focus();
}

function fillFlowchart(text) {
  document.getElementById('flowchartTopic').value = text;
  document.getElementById('flowchartTopic').focus();
}

/* =========================================================
   ASSIGNMENT GENERATOR
========================================================= */
function handleGenerateAssignment() {
  const topic = document.getElementById('assignTopic').value.trim();
  if (!topic) { showToast('Please enter a topic!'); return; }

  const subject = document.getElementById('assignSubject').value;
  const difficulty = document.getElementById('assignDifficulty').value;
  const words = document.getElementById('assignWords').value;
  const type = document.querySelector('input[name="assignType"]:checked').value;

  const resultArea = document.getElementById('assignResult');
  const titleEl = document.getElementById('assignResultTitle');

  showLoading(resultArea);

  setTimeout(() => {
    const html = StudyEngine.generateAssignment(topic, subject, difficulty, words, type);
    lastAssignHTML = html;
    titleEl.textContent = `Assignment: ${topic}`;
    setResult(resultArea, 'assignResultContent', html);
    addToHistory('assignment', topic, html);
  }, 700);
}

/* =========================================================
   ROADMAP BUILDER
========================================================= */
function handleGenerateRoadmap() {
  const goal = document.getElementById('roadmapGoal').value.trim();
  if (!goal) { showToast('Please enter your study goal!'); return; }

  const duration = document.getElementById('roadmapDuration').value;
  const hours = document.getElementById('roadmapHours').value;
  const level = document.getElementById('roadmapLevel').value;

  const resultArea = document.getElementById('roadmapResult');
  const titleEl = document.getElementById('roadmapResultTitle');

  showLoading(resultArea);

  setTimeout(() => {
    const html = StudyEngine.generateRoadmap(goal, duration, hours, level);
    lastRoadmapHTML = html;
    titleEl.textContent = `Roadmap: ${goal}`;
    setResult(resultArea, 'roadmapResultContent', html);
    addToHistory('roadmap', goal, html);
  }, 800);
}

/* =========================================================
   FLOWCHART GENERATOR
========================================================= */
function handleGenerateFlowchart() {
  const topic = document.getElementById('flowchartTopic').value.trim();
  if (!topic) { showToast('Please enter a topic!'); return; }

  const flowType = document.querySelector('input[name="flowType"]:checked').value;
  const resultArea = document.getElementById('flowchartResult');
  const titleEl = document.getElementById('flowchartResultTitle');
  const diagramEl = document.getElementById('flowchartDiagram');

  resultArea.style.display = 'block';
  diagramEl.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setTimeout(() => {
    const html = StudyEngine.generateFlowchart(topic, flowType);
    lastFlowchartHTML = html;
    titleEl.textContent = `Flowchart: ${topic}`;
    diagramEl.innerHTML = `<div style="padding:1.5rem">${html}</div>`;
    addToHistory('flowchart', topic, html);
  }, 700);
}

/* =========================================================
   NOTES MAKER
========================================================= */
function handleFormatNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteInput').value.trim();
  if (!content) { showToast('Please enter some content to format!'); return; }

  const style = document.querySelector('input[name="noteStyle"]:checked').value;
  const resultContent = document.getElementById('noteResultContent');

  resultContent.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;

  setTimeout(() => {
    const html = StudyEngine.formatNotes(title || 'My Notes', content, style);
    lastNoteHTML = html;
    resultContent.innerHTML = html;
  }, 500);
}

function handleSaveNote() {
  const title = document.getElementById('noteTitle').value.trim() || 'Untitled Note';
  const content = document.getElementById('noteInput').value.trim();
  if (!content) { showToast('Please enter some content first!'); return; }

  const style = document.querySelector('input[name="noteStyle"]:checked').value;
  const html = lastNoteHTML || StudyEngine.formatNotes(title, content, style);
  saveToStorage('notes', title, html);
  showToast('Note saved! ✓');
}

/* =========================================================
   SAVE TO STORAGE
========================================================= */
function saveItem(type) {
  const htmlMap = {
    doubt: { html: lastDoubtHTML, titleEl: 'doubtInput' },
    assignment: { html: lastAssignHTML, titleEl: 'assignTopic' },
    roadmap: { html: lastRoadmapHTML, titleEl: 'roadmapGoal' },
    flowchart: { html: lastFlowchartHTML, titleEl: 'flowchartTopic' }
  };
  const item = htmlMap[type];
  if (!item || !item.html) { showToast('Generate something first!'); return; }

  const titleEl = document.getElementById(item.titleEl);
  const title = titleEl ? titleEl.value.trim() : type;
  saveToStorage(type, title || type, item.html);
  showToast('Saved! ✓');
}

function saveToStorage(type, title, html) {
  const key = 'sf-saved';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.unshift({
    id: Date.now(),
    type,
    title: title.substring(0, 80),
    html,
    date: new Date().toLocaleDateString()
  });
  // Keep max 100 items
  if (existing.length > 100) existing.pop();
  localStorage.setItem(key, JSON.stringify(existing));
  updateBadge();
}

function addToHistory(type, title, html) {
  // Auto-save to history (lighter, separate store)
  const key = 'sf-history';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.unshift({ id: Date.now(), type, title: title.substring(0,80), html, date: new Date().toLocaleDateString() });
  if (existing.length > 50) existing.pop();
  localStorage.setItem(key, JSON.stringify(existing));
}

function updateBadge() {
  const saved = JSON.parse(localStorage.getItem('sf-saved') || '[]');
  const badge = document.getElementById('savedBadge');
  badge.textContent = saved.length;
  badge.style.display = saved.length ? 'inline' : 'none';
}

/* =========================================================
   SAVED PAGE
========================================================= */
function renderSaved(filter) {
  const saved = JSON.parse(localStorage.getItem('sf-saved') || '[]');
  const filtered = filter === 'all' ? saved : saved.filter(i => i.type === filter);
  const list = document.getElementById('savedList');

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" width="48" height="48"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5"/></svg>
        <p>${filter === 'all' ? 'Nothing saved yet. Start learning!' : `No ${filter}s saved yet.`}</p>
      </div>
    `;
    return;
  }

  const icons = {
    doubt: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor"/></svg>`,
    assignment: `<svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>`,
    roadmap: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    flowchart: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="4" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="17" width="7" height="4" rx="1" stroke="currentColor" stroke-width="2"/></svg>`,
    notes: `<svg viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/></svg>`
  };

  list.innerHTML = filtered.map(item => `
    <div class="saved-card" id="saved-${item.id}">
      <div class="saved-card-icon icon-${item.type}">${icons[item.type] || icons.notes}</div>
      <div class="saved-card-info">
        <div class="saved-card-title">${escapeHtml(item.title)}</div>
        <div class="saved-card-meta">${item.type.charAt(0).toUpperCase()+item.type.slice(1)} · ${item.date}</div>
      </div>
      <div class="saved-card-actions">
        <button class="btn-icon" onclick="viewSaved(${item.id})" title="View">
          <svg viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
        </button>
        <button class="btn-icon" onclick="copyResult(null, ${item.id})" title="Copy">
          <svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/></svg>
        </button>
        <button class="btn-danger" onclick="deleteSaved(${item.id})" title="Delete">
          <svg viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function viewSaved(id) {
  const saved = JSON.parse(localStorage.getItem('sf-saved') || '[]');
  const item = saved.find(i => i.id === id);
  if (!item) return;

  // Navigate to the relevant page and show content
  navigate(item.type === 'notes' ? 'notes' : item.type);
  const resultAreas = {
    doubt: 'doubtResult', assignment: 'assignResult',
    roadmap: 'roadmapResult', flowchart: 'flowchartResult', notes: 'noteResult'
  };
  const contentIds = {
    doubt: 'doubtResultContent', assignment: 'assignResultContent',
    roadmap: 'roadmapResultContent', flowchart: 'flowchartDiagram', notes: 'noteResultContent'
  };
  const area = document.getElementById(resultAreas[item.type]);
  const content = document.getElementById(contentIds[item.type]);
  if (area) area.style.display = 'block';
  if (content) content.innerHTML = item.html;
  area && area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteSaved(id) {
  let saved = JSON.parse(localStorage.getItem('sf-saved') || '[]');
  saved = saved.filter(i => i.id !== id);
  localStorage.setItem('sf-saved', JSON.stringify(saved));
  updateBadge();
  const el = document.getElementById(`saved-${id}`);
  if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(30px)'; el.style.transition = '0.3s'; setTimeout(() => renderSaved(getActiveFilter()), 300); }
}

function getActiveFilter() {
  const active = document.querySelector('.filter-btn.active');
  return active ? active.getAttribute('data-filter') : 'all';
}

/* =========================================================
   UTILITIES
========================================================= */
function copyResult(contentId, savedId) {
  let text = '';
  if (savedId) {
    const saved = JSON.parse(localStorage.getItem('sf-saved') || '[]');
    const item = saved.find(i => i.id === savedId);
    if (item) text = stripHtml(item.html);
  } else if (contentId) {
    const el = document.getElementById(contentId);
    if (el) text = stripHtml(el.innerHTML);
  }
  if (!text) { showToast('Nothing to copy!'); return; }
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! ✓')).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied! ✓');
  });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function exportPDF(areaId) {
  const area = document.getElementById(areaId);
  if (!area || area.style.display === 'none') { showToast('Nothing to export yet!'); return; }
  showToast('Opening print dialog...');
  setTimeout(() => window.print(), 400);
}

/* =========================================================
   TOAST
========================================================= */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateBadge();

  // Navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.getAttribute('data-page')));
  });

  // Sidebar toggle
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('visible');
  });
  document.getElementById('overlay').addEventListener('click', closeSidebar);

  // Theme toggles
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('themeToggleSidebar').addEventListener('click', toggleTheme);

  // Feature buttons
  document.getElementById('solveDoubt').addEventListener('click', handleDoubtSolve);
  document.getElementById('generateAssignment').addEventListener('click', handleGenerateAssignment);
  document.getElementById('generateRoadmap').addEventListener('click', handleGenerateRoadmap);
  document.getElementById('generateFlowchart').addEventListener('click', handleGenerateFlowchart);
  document.getElementById('formatNote').addEventListener('click', handleFormatNote);
  document.getElementById('saveNoteBtn').addEventListener('click', handleSaveNote);

  // Enter key on text inputs
  document.getElementById('doubtInput').addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') handleDoubtSolve();
  });
  document.getElementById('assignTopic').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleGenerateAssignment();
  });
  document.getElementById('roadmapGoal').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleGenerateRoadmap();
  });
  document.getElementById('flowchartTopic').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleGenerateFlowchart();
  });

  // Saved filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSaved(btn.getAttribute('data-filter'));
    });
  });

  // PWA install prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('SW registered:', reg.scope);
      }).catch(err => console.log('SW registration failed:', err));
    });
  }

  console.log('%cStudyFlow loaded!', 'color:#5b4eff;font-weight:bold;font-size:1.2rem');
});
