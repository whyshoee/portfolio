// admin.js — Vaishnavi Goyal Admin Dashboard
// All data is fetched from the server API. No hardcoded arrays.

// ── Auth guard ────────────────────────────────────────────────
// The server already blocks /admin without a valid cookie.
// This JS layer also checks on load and handles 401s gracefully.
async function verifyAuth() {
  try {
    const res = await fetch('/api/auth/verify');
    if (!res.ok) redirectToLogin();
  } catch {
    redirectToLogin();
  }
}

function redirectToLogin() {
  window.location.href = '/login';
}

async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } finally {
    redirectToLogin();
  }
}
window.logout = logout;

// ── API helpers ───────────────────────────────────────────────
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  if (res.status === 401) { redirectToLogin(); return null; }
  return res;
}

// ── Navigation ────────────────────────────────────────────────
function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  el.classList.add('active');
  const titles = { overview:'Dashboard', projects:'Projects', ideas:'Idea Lab', messages:'Messages', settings:'Settings' };
  document.getElementById('topbarTitle').textContent = titles[name] || name;
}
window.showPage = showPage;

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('adminToast');
  t.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  t.className = type === 'error' ? 'show error' : 'show';
  setTimeout(() => t.className = '', 3000);
}

// ── Count helpers ─────────────────────────────────────────────
function updateCounts(pc, ic, mc) {
  if (pc !== undefined) {
    document.getElementById('badgeProjects').textContent = pc;
    document.getElementById('statProjects').textContent  = pc;
    document.getElementById('m-projects').textContent    = pc;
  }
  if (ic !== undefined) {
    document.getElementById('badgeIdeas').textContent = ic;
    document.getElementById('statIdeas').textContent  = ic;
    document.getElementById('m-ideas').textContent    = ic;
  }
  if (mc !== undefined) {
    document.getElementById('statMessages').textContent = mc;
    document.getElementById('m-messages').textContent   = mc;
    document.getElementById('badgeMessages').textContent = mc;
  }
}

// ── Activity feed ─────────────────────────────────────────────
function addActivity(text, color) {
  const list     = document.getElementById('activityList');
  const dotClass = { green:'dot-green', purple:'dot-purple', pink:'dot-pink', muted:'dot-muted' }[color] || 'dot-muted';
  const item     = document.createElement('div');
  item.className = 'activity-item';
  item.innerHTML = `<div class="activity-dot ${dotClass}"></div><div class="activity-text">${text}</div><div class="activity-time">just now</div>`;
  list.insertBefore(item, list.firstChild);
}

// ── PROJECTS ──────────────────────────────────────────────────
let editingProjectId = null;

async function loadProjects() {
  const res = await api('GET', '/api/projects');
  if (!res) return;
  const projects = await res.json();
  renderProjectsTable(projects);
  updateCounts(projects.length, undefined, undefined);
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projectsTableBody');
  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2rem">No projects yet. Add your first one!</td></tr>';
    return;
  }
  const catBadge  = { app:'badge-app', web:'badge-web', system:'badge-system' };
  const catLabel  = { app:'App Design', web:'Web', system:'System' };
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:0.75rem">
        <div class="proj-thumb ${p.color}">${p.emoji}</div>
        <div><div class="proj-name">${p.title}</div><div class="proj-desc">${(p.desc||'').substring(0,60)}…</div></div>
      </div></td>
      <td><span class="badge ${catBadge[p.cat]||'badge-app'}">${catLabel[p.cat]||p.cat}</span></td>
      <td>${(p.tools||'').split(',').map(t=>`<span class="badge" style="background:rgba(255,255,255,0.06);color:var(--muted);margin-right:3px">${t.trim()}</span>`).join('')}</td>
      <td>${p.featured ? '<span style="color:var(--accent)">★ Yes</span>' : '<span style="color:var(--muted)">No</span>'}</td>
      <td><div class="actions">
        <button class="btn-sm" onclick="editProject(${p.id})">Edit</button>
        <button class="btn-sm btn-danger" onclick="askDelete('project',${p.id},'${p.title.replace(/'/g,"\\'")}')">Delete</button>
      </div></td>
    </tr>`).join('');
}

function openProjectModal(id) {
  editingProjectId = id || null;
  document.getElementById('projectModalTitle').textContent = id ? 'Edit project' : 'Add new project';
  ['pTitle','pDesc','pEmoji','pTools','pUrl'].forEach(f => document.getElementById(f).value = '');
  document.getElementById('pCat').value = 'app';
  document.getElementById('pColor').value = 'purple';
  document.getElementById('pFeatured').checked = false;
  document.getElementById('projectModal').classList.add('open');
}
window.openProjectModal = openProjectModal;

async function editProject(id) {
  editingProjectId = id;
  const res = await api('GET', '/api/projects');
  if (!res) return;
  const projects = await res.json();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  document.getElementById('projectModalTitle').textContent = 'Edit project';
  document.getElementById('pTitle').value    = p.title;
  document.getElementById('pDesc').value     = p.desc;
  document.getElementById('pCat').value      = p.cat;
  document.getElementById('pColor').value    = p.color;
  document.getElementById('pEmoji').value    = p.emoji;
  document.getElementById('pTools').value    = p.tools;
  document.getElementById('pUrl').value      = p.url || '';
  document.getElementById('pFeatured').checked = p.featured;
  document.getElementById('projectModal').classList.add('open');
}
window.editProject = editProject;

async function saveProject() {
  const title = document.getElementById('pTitle').value.trim();
  if (!title) { showToast('Title is required', 'error'); return; }
  const body = {
    title, desc: document.getElementById('pDesc').value.trim(),
    cat:   document.getElementById('pCat').value,
    color: document.getElementById('pColor').value,
    emoji: document.getElementById('pEmoji').value || '🎨',
    tools: document.getElementById('pTools').value.trim(),
    url:   document.getElementById('pUrl').value.trim(),
    featured: document.getElementById('pFeatured').checked
  };
  const res = editingProjectId
    ? await api('PUT',  `/api/projects/${editingProjectId}`, body)
    : await api('POST', '/api/projects', body);
  if (!res || !res.ok) { showToast('Save failed', 'error'); return; }
  const action = editingProjectId ? 'updated' : 'added';
  addActivity(`Project ${action} — "${title}"`, 'green');
  showToast(`Project ${action}!`);
  closeModal('projectModal');
  loadProjects();
}
window.saveProject = saveProject;

// ── IDEAS ─────────────────────────────────────────────────────
let editingIdeaId = null;

async function loadIdeas() {
  const res = await api('GET', '/api/ideas');
  if (!res) return;
  const ideas = await res.json();
  renderIdeasTable(ideas);
  updateCounts(undefined, ideas.length, undefined);
}

function renderIdeasTable(ideas) {
  const tbody = document.getElementById('ideasTableBody');
  if (!ideas.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:2rem">No ideas yet. Add your first concept!</td></tr>';
    return;
  }
  const statusBadge = { open:'badge-open', planning:'badge-planning', research:'badge-research' };
  const statusLabel = { open:'Open to collaborate', planning:'Planning', research:'In research' };
  const themeColor  = { purple:'var(--accent2)', green:'var(--accent)', pink:'var(--accent3)' };
  tbody.innerHTML = ideas.map(i => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:0.75rem">
        <div class="proj-thumb ${i.theme==='green'?'teal':i.theme}" style="font-size:1.1rem">${i.emoji}</div>
        <div><div class="proj-name">${i.title}</div><div class="proj-desc">${(i.desc||'').substring(0,55)}…</div></div>
      </div></td>
      <td><span class="badge ${statusBadge[i.status]||'badge-open'}">${statusLabel[i.status]||i.status}</span></td>
      <td><span style="font-size:0.75rem;color:${themeColor[i.theme]||'var(--accent)'}">● ${(i.theme||'').charAt(0).toUpperCase()+(i.theme||'').slice(1)}</span></td>
      <td><div class="actions">
        <button class="btn-sm" onclick="editIdea(${i.id})">Edit</button>
        <button class="btn-sm btn-danger" onclick="askDelete('idea',${i.id},'${i.title.replace(/'/g,"\\'")}')">Delete</button>
      </div></td>
    </tr>`).join('');
}

function openIdeaModal(id) {
  editingIdeaId = id || null;
  document.getElementById('ideaModalTitle').textContent = id ? 'Edit idea' : 'Add new idea';
  ['iTitle','iDesc','iEmoji','iLooking'].forEach(f => document.getElementById(f).value = '');
  document.getElementById('iStatus').value = 'open';
  document.getElementById('iTheme').value  = 'purple';
  document.getElementById('ideaModal').classList.add('open');
}
window.openIdeaModal = openIdeaModal;

async function editIdea(id) {
  editingIdeaId = id;
  const res = await api('GET', '/api/ideas');
  if (!res) return;
  const ideas = await res.json();
  const i = ideas.find(x => x.id === id);
  if (!i) return;
  document.getElementById('ideaModalTitle').textContent = 'Edit idea';
  document.getElementById('iTitle').value   = i.title;
  document.getElementById('iDesc').value    = i.desc;
  document.getElementById('iStatus').value  = i.status;
  document.getElementById('iTheme').value   = i.theme;
  document.getElementById('iEmoji').value   = i.emoji;
  document.getElementById('iLooking').value = i.looking;
  document.getElementById('ideaModal').classList.add('open');
}
window.editIdea = editIdea;

async function saveIdea() {
  const title = document.getElementById('iTitle').value.trim();
  if (!title) { showToast('Title is required', 'error'); return; }
  const body = {
    title, desc:    document.getElementById('iDesc').value.trim(),
    status: document.getElementById('iStatus').value,
    theme:  document.getElementById('iTheme').value,
    emoji:  document.getElementById('iEmoji').value || '💡',
    looking: document.getElementById('iLooking').value.trim()
  };
  const res = editingIdeaId
    ? await api('PUT',  `/api/ideas/${editingIdeaId}`, body)
    : await api('POST', '/api/ideas', body);
  if (!res || !res.ok) { showToast('Save failed', 'error'); return; }
  const action = editingIdeaId ? 'updated' : 'added';
  addActivity(`Idea ${action} — "${title}"`, 'purple');
  showToast(`Idea ${action}!`);
  closeModal('ideaModal');
  loadIdeas();
}
window.saveIdea = saveIdea;

// MESSAGES
async function loadMessages() {
  const res = await api('GET', '/api/messages');
  if (!res) return;
  const messages = await res.json();
  renderMessages(messages);
}

function renderMessages(messages) {
  const container = document.getElementById('messagesContainer');
  if (!messages.length) {
    container.innerHTML = '<div class="msg-loading">Your inbox is empty!</div>';
    // Update topbar stats and sidebar badges to 0
    updateCounts(undefined, undefined, 0);
    return;
  }

  // Separate unread messages to update badges accurately
  const unreadCount = messages.filter(m => !m.is_read).length;
  updateCounts(undefined, undefined, unreadCount);

  container.innerHTML = messages.map(m => {
    // Get initials for avatar
    const initials = m.name ? m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    const dateStr = new Date(m.created_at).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });

    return `
      <div class="message-card" style="${!m.is_read ? 'border-left: 3px solid var(--accent3);' : ''}">
        <div class="msg-avatar" style="background:rgba(240,96,144,0.12); color:var(--accent3)">${initials}</div>
        <div class="msg-content">
          <div class="msg-name" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${m.name}</span>
            ${!m.is_read ? '<span class="badge badge-research" style="font-size:0.6rem;">New</span>' : ''}
          </div>
          <div class="msg-email">${m.email} &nbsp;•&nbsp; <strong>${m.subject || 'No Subject'}</strong></div>
          <div class="msg-body">${m.message}</div>
        </div>
        <div class="msg-time">${dateStr}</div>
      </div>
    `;
  }).join('');
}

// ── DELETE ────────────────────────────────────────────────────
let deletingType = null, deletingId = null;

function askDelete(type, id, name) {
  deletingType = type; deletingId = id;
  document.getElementById('deleteMsg').textContent = `"${name}" will be permanently removed from your portfolio.`;
  document.getElementById('deleteModal').classList.add('open');
}
window.askDelete = askDelete;

async function confirmDelete() {
  const path = deletingType === 'project' ? `/api/projects/${deletingId}` : `/api/ideas/${deletingId}`;
  const res  = await api('DELETE', path);
  if (!res || !res.ok) { showToast('Delete failed', 'error'); return; }
  addActivity(`${deletingType === 'project' ? 'Project' : 'Idea'} deleted`, 'muted');
  showToast(`${deletingType === 'project' ? 'Project' : 'Idea'} deleted`);
  closeModal('deleteModal');
  if (deletingType === 'project') loadProjects();
  else loadIdeas();
}
window.confirmDelete = confirmDelete;

// ── MODAL ─────────────────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
window.closeModal = closeModal;

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ── SETTINGS ─────────────────────────────────────────────────
function saveSettings() { showToast('Settings saved!'); }
window.saveSettings = saveSettings;

// ── INIT ──────────────────────────────────────────────────────
(async () => {
  await verifyAuth();
  loadProjects();
  loadIdeas();
  loadMessages(); // <--- Added
})();
