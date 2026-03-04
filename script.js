/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const dot = cursor.querySelector('.cursor-dot');
const ring = cursor.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button, .value-card, .skill-capsule, .project-card, .impact-stat, .award-badge')
  .forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

/* ══════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════ */
(function() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  // Only go dark if user explicitly chose dark — default is always light
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
  }
  // If no saved preference, stay light (do nothing)
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
  btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
})();

/* ══════════════════════════════════════
   HERO NAME — show immediately (no reel)
══════════════════════════════════════ */
(function() {
  const heroReel = document.getElementById('hero-name-reel');
  if (!heroReel) return;
  heroReel.textContent = 'Abhiram Makkapati';
  requestAnimationFrame(() => requestAnimationFrame(() => heroReel.classList.add('visible')));
})();

/* ══════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

/* ══════════════════════════════════════
   HERO CANVAS — Floating network nodes
══════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    const hero = document.getElementById('hero');
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initNodes(); });

  const NODE_COUNT = 55;
  let nodes = [];

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1.2,
    }));
  }
  initNodes();

  const LINK_DIST = 145;
  let mx = W / 2, my = H / 2;
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.body.classList.contains('dark-mode');
    const nodeColor  = isDark ? 'rgba(160,170,220,' : 'rgba(110,130,190,';
    const lineColor  = isDark ? 'rgba(140,155,210,' : 'rgba(100,120,180,';

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
    });

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    // Mouse proximity lines
    nodes.forEach(n => {
      const dx = n.x - mx, dy = n.y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 160) {
        const alpha = (1 - dist / 160) * 0.5;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y); ctx.lineTo(mx, my);
        ctx.strokeStyle = lineColor + alpha + ')';
        ctx.lineWidth = 0.6; ctx.stroke();
      }
    });
    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor + '0.7)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════════
   SKILLS DATA + RENDER
══════════════════════════════════════ */
const SKILLS = [
  // Languages
  { name: 'C++',          cat: 'lang',    catLabel: 'Language',   level: 0.82 },
  { name: 'Python',       cat: 'lang',    catLabel: 'Language',   level: 0.85 },
  { name: 'Dart',         cat: 'lang',    catLabel: 'Language',   level: 0.80 },
  { name: 'JavaScript',   cat: 'lang',    catLabel: 'Language',   level: 0.75 },
  { name: 'SQL',          cat: 'lang',    catLabel: 'Language',   level: 0.72 },
  // Web Development
  { name: 'HTML & CSS',   cat: 'web',     catLabel: 'Web Dev',    level: 0.88 },
  { name: 'JavaScript',   cat: 'web',     catLabel: 'Web Dev',    level: 0.75 },
  // Mobile Development
  { name: 'Flutter',      cat: 'mobile',  catLabel: 'Mobile',     level: 0.84 },
  { name: 'Firebase',     cat: 'mobile',  catLabel: 'Mobile',     level: 0.78 },
  // Data / Analytics
  { name: 'NumPy',        cat: 'data',    catLabel: 'Data',       level: 0.74 },
  { name: 'Pandas',       cat: 'data',    catLabel: 'Data',       level: 0.72 },
  { name: 'Power BI',     cat: 'data',    catLabel: 'Data',       level: 0.62 },
  // Developer Tools
  { name: 'Git & GitHub', cat: 'tools',   catLabel: 'Dev Tools',  level: 0.87 },
  { name: 'GitLab',       cat: 'tools',   catLabel: 'Dev Tools',  level: 0.82 },
  { name: 'VS Code',      cat: 'tools',   catLabel: 'Dev Tools',  level: 0.92 },
  { name: 'PowerShell',       cat: 'tools', catLabel: 'Dev Tools', level: 0.68 },
  { name: 'Bash',             cat: 'tools', catLabel: 'Dev Tools', level: 0.72 },
  { name: 'Terminal',         cat: 'tools', catLabel: 'Dev Tools', level: 0.78 },
  { name: 'Microsoft Office', cat: 'tools', catLabel: 'Dev Tools', level: 0.88 },
  // CS Fundamentals
  { name: 'Data Structures',    cat: 'cs', catLabel: 'CS Core',   level: 0.85 },
  { name: 'Algorithms',         cat: 'cs', catLabel: 'CS Core',   level: 0.82 },
  { name: 'OOP',                cat: 'cs', catLabel: 'CS Core',   level: 0.88 },
  { name: 'Systems Programming',cat: 'cs', catLabel: 'CS Core',   level: 0.75 },
  { name: 'Databases',          cat: 'cs', catLabel: 'CS Core',   level: 0.76 },
  // Systems / Infrastructure
  { name: 'Linux',              cat: 'sys', catLabel: 'Systems',  level: 0.75 },
  { name: 'macOS',              cat: 'sys', catLabel: 'Systems',  level: 0.78 },
  { name: 'Windows',            cat: 'sys', catLabel: 'Systems',  level: 0.88 },
  { name: 'Virtual Machines',   cat: 'sys', catLabel: 'Systems',  level: 0.70 },
  // Cloud / DevOps
  { name: 'AWS',                cat: 'cloud', catLabel: 'Cloud',  level: 0.62 },
  { name: 'Software Deployment',cat: 'cloud', catLabel: 'DevOps', level: 0.72 },
  // Soft Skills
  { name: 'Problem Solving',    cat: 'soft', catLabel: 'Soft Skill', level: 0.92 },
  { name: 'Easily Adaptable',   cat: 'soft', catLabel: 'Soft Skill', level: 0.90 },
  { name: 'Customer Service',   cat: 'soft', catLabel: 'Soft Skill', level: 0.88 },
  { name: 'Team Collaboration', cat: 'soft', catLabel: 'Soft Skill', level: 0.91 },
  { name: 'Communication',      cat: 'soft', catLabel: 'Soft Skill', level: 0.89 },
];

const catClassMap = { lang: 'cat-lang', web: 'cat-web', mobile: 'cat-mobile', tools: 'cat-tools', data: 'cat-data', cs: 'cat-cs', sys: 'cat-sys', cloud: 'cat-cloud', soft: 'cat-soft' };
const grid = document.getElementById('skills-grid');

SKILLS.forEach(s => {
  const card = document.createElement('div');
  card.className = 'skill-capsule reveal';
  card.dataset.cat = s.cat;
  card.innerHTML = `
    <div class="skill-capsule-top">
      <span class="skill-name">${s.name}</span>
      <span class="skill-cat-tag ${catClassMap[s.cat]}">${s.catLabel}</span>
    </div>
    <div class="skill-bar-bg">
      <div class="skill-bar-fill" style="width:${s.level*100}%"></div>
    </div>`;
  grid.appendChild(card);
});

// Filter — strict exact match on data-cat
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.skill-capsule').forEach(card => {
      const match = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ══════════════════════════════════════
   SCROLL REVEAL + SKILL BARS
══════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      if (e.target.classList.contains('skill-capsule')) {
        setTimeout(() => { e.target.classList.add('in-view'); }, 100);
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .project-card, .coming-soon-card, .timeline-item, .edu-card, .skill-capsule').forEach(el => observer.observe(el));

/* ══════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════ */
document.querySelectorAll('.btn-primary, .btn-secondary, .contact-link').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width/2);
    const dy = e.clientY - (rect.top + rect.height/2);
    btn.style.transform = `translate(${dx*0.18}px, ${dy*0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ══════════════════════════════════════
   WIDGET 1 — TERMINAL
══════════════════════════════════════ */
(function initTerminal() {
  const output  = document.getElementById('terminal-output');
  const inputEl = document.getElementById('terminal-input');
  const runBtn  = document.getElementById('terminal-run');
  if (!output || !inputEl || !runBtn) return;

  const NAV_MAP = {
    about:'#about', skills:'#skills', projects:'#projects',
    experience:'#experience', education:'#education',
    contact:'#contact', terminal:'#terminal', hero:'#hero',
    home:'#hero', top:'#hero'
  };

  const CMDS = {
    help: () => [
      '<span class="t-green">┌── Commands ────────────────────────────┐</span>',
      '  <span class="t-blue">about</span>        Who is Abhiram?',
      '  <span class="t-blue">skills</span>       Full tech stack',
      '  <span class="t-blue">projects</span>     Shipped work',
      '  <span class="t-blue">experience</span>   Work history',
      '  <span class="t-blue">education</span>    UNT + GPA + awards',
      '  <span class="t-blue">contact</span>      Reach out',
      '  <span class="t-blue">gpa</span>          Academic record',
      '  <span class="t-blue">go [section]</span> Scroll to a section',
      '  <span class="t-blue">clear</span>        Clear this terminal',
      '<span class="t-green">└────────────────────────────────────────┘</span>',
    ],
    about: () => [
      '<span class="t-green">Abhiram Makkapati</span>',
      '  Role     → CS Junior @ University of North Texas',
      '  Status   → <span class="t-accent">Open to Summer 2026 internships</span>',
      '  Location → The Colony, TX 75056',
      '  Focus    → Software Engineering & IT roles',
    ],
    skills: () => [
      '<span class="t-green">Tech Stack</span>',
      '  Languages   → C++, Python, Dart, JavaScript, SQL',
      '  Web         → HTML & CSS, JavaScript',
      '  Mobile      → Flutter, Firebase',
      '  Data        → NumPy, Pandas, Power BI',
      '  Dev Tools   → Git & GitHub, GitLab, VS Code, PowerShell, Bash, Terminal, Microsoft Office',
      '  CS Core     → Data Structures, Algorithms, OOP, Systems Programming, Databases',
      '  Systems     → Linux, macOS, Windows, Virtual Machines',
      '  Cloud       → AWS, Software Deployment',
      '  Soft Skills → Problem Solving, Team Collaboration, Communication',
      '  <span class="t-muted">→ type "go skills" to see the full grid</span>',
    ],
    projects: () => [
      '<span class="t-green">Shipped Projects</span>',
      '  <span class="t-accent">[01] StyleSync</span>    — Flutter + Firebase clothing tracker',
      '  <span class="t-accent">[02] RideMate</span>     — JavaScript + Firebase ride-sharing app',
      '  <span class="t-accent">[03] Mahishmathi</span>  — C++ SimCity-style city simulation',
      '  <span class="t-accent">[04] Menu Driven</span>  — Console list manager',
      '  <span class="t-muted">StyleSync:</span> github.com/Abhiram-Makkapati/Stylesync',
      '  <span class="t-muted">SimCity:</span>   github.com/Abhiram-Makkapati/simcity',
      '  <span class="t-muted">RideMate:</span>  github.com/Abhiram-Makkapati/RideMate',
      '  <span class="t-muted">Tip: "go projects" scrolls there</span>',
    ],
    experience: () => [
      '<span class="t-green">Work History</span>',
      '  <span class="t-accent">Student Technology Assistant</span>',
      '  CMHT-IT Help Desk · UNT · July 2024 – Present',
      '  · Managed 240+ checkout laptops',
      '  · Rapid7 vulnerability scanning + remediation',
      '  · Windows imaging, SPSS/Tableau/LockDown deploys',
      '  · DeepFreeze config on shared checkout devices',
    ],
    education: () => [
      '<span class="t-green">Education</span>',
      '  University of North Texas',
      '  B.S. Computer Science — Aug 2023 to Present',
      '  GPA: <span class="t-amber">3.73 / 4.0</span>',
      '  Dean\'s List — Fall 2025',
      '  Dean\'s List — Fall 2024',
      '  President\'s List — Spring 2025',
    ],
    contact: () => [
      '<span class="t-green">Contact</span>',
      '  Email    → <a href="mailto:makkapatiabhiram@gmail.com" style="color:inherit">makkapatiabhiram@gmail.com</a>',
      '  LinkedIn → <a href="https://linkedin.com/in/abhirammakkapati" target="_blank" style="color:inherit">linkedin.com/in/abhirammakkapati</a>',
      '  GitHub   → <a href="https://github.com/Abhiram-Makkapati" target="_blank" style="color:inherit">github.com/Abhiram-Makkapati</a>',
      '  Resume   → <a href="https://drive.google.com/file/d/158KNkIGFmVLFfg4JTBBTzCNVCb5aIEnC/view?usp=sharing" target="_blank" style="color:inherit">Download PDF</a>',
      '  <span class="t-muted">or type "go contact" to scroll there</span>',
    ],
    gpa: () => [
      '<span class="t-green">Academic Record</span>',
      '  GPA:    <span class="t-amber">3.73 / 4.0</span>',
      '  Degree: B.S. Computer Science @ UNT',
      '  Awards: Dean\'s List (Fall 2025), Dean\'s List (Fall 2024), President\'s List (Spring 2025)',
      '  Track:  On pace for May 2027 graduation',
    ],
    clear: () => '__CLEAR__',
  };

  function addLine(html) {
    const d = document.createElement('div');
    d.className = 't-line';
    d.innerHTML = html;
    output.appendChild(d);
    output.scrollTop = output.scrollHeight;
  }

  function addCursorLine() {
    const existing = output.querySelector('.t-cursor-line');
    if (existing) existing.remove();
    const d = document.createElement('div');
    d.className = 't-line t-cursor-line';
    d.innerHTML = '<span class="t-cursor-blink"></span>';
    output.appendChild(d);
    output.scrollTop = output.scrollHeight;
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    // echo the command
    addLine(`<span class="t-prompt-out">abhiram@portfolio ~</span> $ <span class="t-cmd-echo">${raw.trim() || ''}</span>`);

    if (!cmd) { addLine(''); addCursorLine(); return; }

    // "go [section]" nav shortcut
    if (cmd.startsWith('go ')) {
      const target = cmd.slice(3).trim();
      const href = NAV_MAP[target];
      if (href) {
        addLine(`<span class="t-green">↗ Scrolling to #${target}…</span>`);
        setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 280);
      } else {
        addLine(`<span class="t-error">Section not found: "${target}"</span>`);
        addLine(`  <span class="t-muted">Options: ${Object.keys(NAV_MAP).join(', ')}</span>`);
      }
      addLine('');
      addCursorLine();
      return;
    }

    const fn = CMDS[cmd];
    if (fn) {
      const result = fn();
      if (result === '__CLEAR__') {
        output.innerHTML = '';
        addLine('<span class="t-green">▶</span> <span class="t-muted">Cleared.</span>');
      } else {
        result.forEach(l => addLine(`<span style="color:#cdd3db">${l}</span>`));
      }
    } else {
      addLine(`<span class="t-error">command not found: ${cmd}</span>`);
      addLine(`  <span class="t-muted">Type <span class="t-accent">help</span> to see all commands.</span>`);
    }
    addLine('');
    addCursorLine();
  }

  runBtn.addEventListener('click', () => { run(inputEl.value); inputEl.value = ''; inputEl.focus(); });
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(inputEl.value); inputEl.value = ''; }
  });
  document.querySelectorAll('.t-suggestion').forEach(btn => {
    btn.addEventListener('click', () => { run(btn.dataset.cmd); inputEl.focus(); });
  });

  // initial cursor
  addCursorLine();

  // cursor hover registration
  [runBtn, inputEl, ...document.querySelectorAll('.t-suggestion')].forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ══════════════════════════════════════
   WIDGET 2 — PROJECT MODAL
══════════════════════════════════════ */
(function initModal() {
  const modal    = document.getElementById('project-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  const DATA = {
    stylesync: {
      eyebrow: '01 / 04 — Mobile App',
      title: 'StyleSync',
      desc: 'A full-stack clothing tracker app built with Flutter and Firebase. Brings real clarity to your wardrobe with real-time sync, outfit history, and wear-frequency analytics — designed to work on both phone and tablet.',
      chips: ['Flutter', 'Dart', 'Firebase', 'Firebase Auth', 'Provider', 'Firestore'],
      features: [
        'Real-time wardrobe sync with Firebase Auth & Firestore across all devices',
        'Outfit builder with per-item wear frequency tracking and analytics dashboard',
        'Responsive UI layout — optimized for phone, tablet, and landscape orientations',
      ],
      links: [
        { label: 'View on GitHub →', href: 'https://github.com/Abhiram-Makkapati/Stylesync', primary: true },
      ],
    },
    mahishmathi: {
      eyebrow: '03 / 04 — Simulation',
      title: 'Mahishmathi City',
      desc: 'A SimCity-style city simulation engine built from scratch in C++ — no game engine. Models population growth, resource allocation, economic flows, and infrastructure decisions through clean object-oriented design.',
      chips: ['C++', 'Python', 'OOP', 'Graph Algorithms', 'Data Structures', 'CLI'],
      features: [
        'Population growth engine with dynamic resource consumption & scarcity modeling',
        'Economy and infrastructure optimization via custom graph-based algorithms',
        'Interactive branching scenarios with full error handling and rollback capability',
      ],
      links: [
        { label: 'View on GitHub →', href: 'https://github.com/Abhiram-Makkapati/simcity', primary: true },
      ],
    },
    ridemate: {
      eyebrow: '03 / 04 — Mobile App',
      title: 'RideMate',
      desc: 'A ride-sharing companion app built with Flutter and Firebase. Connects riders and drivers with real-time location tracking, trip management, and a clean mobile-first interface.',
      chips: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'Google Maps'],
      features: [
        'Real-time ride matching and location tracking powered by Firebase',
        'Driver and rider profiles with trip history and rating system',
        'Clean, intuitive mobile UI optimized for quick interactions on the go',
      ],
      links: [
        { label: 'View on GitHub →', href: 'https://github.com/Abhiram-Makkapati/RideMate', primary: true },
      ],
    },
    menudriven: {
      eyebrow: '04 / 04 — CLI Tool',
      title: 'Menu Driven',
      desc: 'A clean, console-based list management system demonstrating solid CS fundamentals. Built to show mastery of data structures, user-facing UX logic, and bulletproof error handling in every code path.',
      chips: ['Python', 'C++', 'Data Structures', 'CLI', 'Error Handling'],
      features: [
        'Menu-driven navigation with clear prompts, validation, and user feedback at every step',
        'Comprehensive edge-case handling — graceful on all invalid inputs and boundary conditions',
        'Efficient list operations analyzed for time/space complexity throughout the implementation',
      ],
      links: [
        { label: 'View on GitHub →', href: 'https://github.com/Abhiram-Makkapati/Menu_Driven', primary: true },
      ],
    },
  };

  let lastFocused = null;

  function openModal(key) {
    const p = DATA[key];
    if (!p) return;
    lastFocused = document.activeElement;

    document.getElementById('modal-eyebrow').textContent  = p.eyebrow;
    document.getElementById('modal-title').textContent    = p.title;
    document.getElementById('modal-desc').textContent     = p.desc;
    document.getElementById('modal-chips').innerHTML      = p.chips.map(c => `<span class="modal-chip">${c}</span>`).join('');
    document.getElementById('modal-features').innerHTML   = p.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('modal-links').innerHTML      = p.links.map(l =>
      `<a href="${l.href}" target="_blank" rel="noopener" class="modal-link ${l.primary ? 'modal-link-primary' : 'modal-link-outline'}">${l.label}</a>`
    ).join('');

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtn.focus(), 60);
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Focus trap inside modal
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  // Keyboard: Enter/Space on project card opens modal (not on link/button clicks)
  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
        e.preventDefault();
        openModal(card.dataset.project);
      }
    });
  });

  // cursor hover for modal elements
  [closeBtn, ...document.querySelectorAll('.modal-link')].forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();




/* bg-lines-canvas unused — dot grid handled via CSS */
