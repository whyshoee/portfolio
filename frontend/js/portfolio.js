// portfolio.js — Vaishnavi Goyal Portfolio

// ── Custom cursor ────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .project-card, .idea-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; cursor.style.opacity = '0.6'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)';   cursor.style.opacity = '1'; });
});

// ── Scroll nav ───────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── Scroll reveal ────────────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Project filter ───────────────────────────────────────────
function filterProjects(cat, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
}
window.filterProjects = filterProjects;

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  t.className = type === 'error' ? 'error show' : 'show';
  setTimeout(() => t.className = '', 3500);
}

// ── Render projects from API ──────────────────────────────────
const COLOR_MAP = { purple:'#1a1040,#2d1f6e', teal:'#071f1a,#0f4a3a', coral:'#1f0d08,#5a1f10', pink:'#1a0810,#5a1030', amber:'#1f1500,#4a3200', blue:'#00111f,#003a5a' };

function buildProjectCard(p, index) {
  const [c1, c2] = (COLOR_MAP[p.color] || COLOR_MAP.purple).split(',');
  const isFeatured = p.featured && index === 0;
  const tools = p.tools ? p.tools.split(',').map(t => `<span class="tech-badge">${t.trim()}</span>`).join('') : '';
  const catLabel = { app: 'Security & ML', web: 'Web', system: 'Systems' }[p.cat] || p.cat;
  const tag = isFeatured ? `Featured · ${catLabel}` : catLabel;

  return `
    <div class="project-card ${isFeatured ? 'featured' : ''} reveal" data-cat="${p.cat}">
      <div class="project-thumb">
        <div class="thumb-bg ${p.color}" style="background:linear-gradient(135deg,${c1} 0%,${c2} 100%)">
          <div class="project-mockup">
            <div class="mockup-bar">
              <div class="mockup-dot" style="background:#ff6057"></div>
              <div class="mockup-dot" style="background:#febc2e"></div>
              <div class="mockup-dot" style="background:#28c840"></div>
            </div>
            <div class="mockup-content">
              <div class="mockup-line accent"></div>
              <div class="mockup-line" style="width:80%"></div>
              <div class="mockup-line" style="width:45%"></div>
              <div class="mockup-grid">
                <div class="mockup-block"></div><div class="mockup-block"></div>
                <div class="mockup-block" style="background:rgba(200,240,96,0.1)"></div>
                <div class="mockup-block"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="project-info">
        <div class="project-tag">${tag}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-footer">
          <div class="tech-stack">${tools}</div>
          <div class="project-arrow">${p.url ? '<a href="' + p.url + '" target="_blank" style="color:inherit;text-decoration:none">↗</a>' : '→'}</div>
        </div>
      </div>
    </div>`;
}

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to load');
    const projects = await res.json();
    grid.innerHTML = projects.map((p, i) => buildProjectCard(p, i)).join('');
    // Re-observe new cards
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } catch {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem;text-align:center">Could not load projects.</p>';
  }
}

// ── Render ideas from API ─────────────────────────────────────
const THEME_CLASSES = { purple: 'idea-purple', green: 'idea-green', pink: 'idea-pink' };
const STATUS_MAP = {
  open:     ['status-open',     'Open to collaborate'],
  planning: ['status-planning', 'Planning phase'],
  research: ['status-research', 'In research']
};

function buildIdeaCard(idea, i) {
  const themeClass = THEME_CLASSES[idea.theme] || 'idea-purple';
  const [statusClass, statusLabel] = STATUS_MAP[idea.status] || STATUS_MAP.open;
  const delay = i % 3 === 1 ? 'reveal-delay-1' : i % 3 === 2 ? 'reveal-delay-2' : '';
  return `
    <div class="idea-card ${themeClass} reveal ${delay}">
      <div class="idea-icon">${idea.emoji}</div>
      <h4>${idea.title}</h4>
      <p>${idea.description || ''}</p>
      <span class="idea-status ${statusClass}">${statusLabel}</span>
    </div>`;
}

async function loadIdeas() {
  const grid = document.getElementById('ideasGrid');
  try {
    const res = await fetch('/api/ideas');
    if (!res.ok) throw new Error('Failed to load');
    const ideas = await res.json();
    grid.innerHTML = ideas.map((idea, i) => buildIdeaCard(idea, i)).join('');
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } catch {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem;text-align:center">Could not load ideas.</p>';
  }
}

// ── Contact form ──────────────────────────────────────────────
async function sendMessage() {
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const reason  = document.getElementById('cReason').value;
  const message = document.getElementById('cMsg').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const btn = document.querySelector('#contact .btn-primary');
  btn.textContent = 'Sending…';
  btn.style.opacity = '0.7';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        email, 
        subject: reason, // Send it matching the backend property name
        message 
      })
    });
    
    const data = await res.json();
    if (res.ok) {
      showToast('Message sent! Vaishnavi will be in touch soon.');
      ['cName','cEmail','cMsg'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('cReason').value = '';
    } else {
      showToast(data.error || 'Something went wrong', 'error');
    }
  } catch {
    showToast('Network error. Please try again.', 'error');
  } finally {
    btn.textContent = 'Send message →';
    btn.style.opacity = '1';
  }
}
window.sendMessage = sendMessage;

// ── Init ──────────────────────────────────────────────────────
loadProjects();
loadIdeas();
