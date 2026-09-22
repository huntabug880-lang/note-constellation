const STORAGE_KEY = 'signal-graph-cases-v2';

const templates = {
  recon: {
    type: 'recon',
    label: 'Recon',
    color: 'cyan',
    title: 'Target profile',
    text: 'Map the target surface: domains, subdomains, services, and exposed entry points.'
  },
  asset: {
    type: 'asset',
    label: 'Asset',
    color: 'gold',
    title: 'Critical asset',
    text: 'Identify vulnerable infrastructure, endpoints, or systems that matter to the investigation.'
  },
  indicator: {
    type: 'indicator',
    label: 'Indicator',
    color: 'pink',
    title: 'Threat indicator',
    text: 'Track IPs, hashes, emails, domains, or behaviors tied to the target.'
  },
  evidence: {
    type: 'evidence',
    label: 'Evidence',
    color: 'violet',
    title: 'Artifacts / source',
    text: 'Capture public reports, screenshots, metadata, or evidence tied to a finding.'
  },
  analysis: {
    type: 'analysis',
    label: 'Analysis',
    color: 'teal',
    title: 'Correlation',
    text: 'Connect findings into a narrative and assess risk, overlap, and confidence.'
  }
};

const defaultCases = [
  {
    id: 'case-blackstone',
    name: 'Blackstone Labs',
    summary: 'Initial open-source network review and service enumeration.',
    status: 'Open',
    nodes: [
      {
        id: 'n1',
        x: 120,
        y: 120,
        title: 'Initial target',
        text: 'A suspicious domain, service, or actor profile with unclear scope.',
        entity: 'blackstonelabs.example',
        source: 'OSINT',
        type: 'recon',
        color: 'cyan',
        severity: 'medium',
        confidence: 'medium',
        tags: ['target', 'dns']
      },
      {
        id: 'n2',
        x: 420,
        y: 170,
        title: 'Open-source discovery',
        text: 'Enumerate public records, DNS, endpoints, and social signals.',
        entity: 'www.blackstonelabs.example',
        source: 'Shodan',
        type: 'asset',
        color: 'gold',
        severity: 'high',
        confidence: 'high',
        tags: ['public', 'infrastructure']
      },
      {
        id: 'n3',
        x: 760,
        y: 250,
        title: 'Indicator tie-in',
        text: 'Map suspicious IPs, domains, hashes, and infrastructure behavior.',
        entity: '203.0.113.42',
        source: 'Threat intel feed',
        type: 'indicator',
        color: 'pink',
        severity: 'critical',
        confidence: 'confirmed',
        tags: ['malware', 'ip']
      },
      {
        id: 'n4',
        x: 530,
        y: 420,
        title: 'Evidence review',
        text: 'Watchlists, screenshots, leaked records, host metadata, and logs.',
        entity: 'screenshot-2024-02-18',
        source: 'Archive',
        type: 'evidence',
        color: 'violet',
        severity: 'high',
        confidence: 'medium',
        tags: ['logs', 'screenshot']
      },
      {
        id: 'n5',
        x: 200,
        y: 490,
        title: 'Risk assessment',
        text: 'Evaluate confidence, scope, and operational impact of the findings.',
        entity: 'risk-review',
        source: 'Analyst',
        type: 'analysis',
        color: 'teal',
        severity: 'medium',
        confidence: 'high',
        tags: ['confidence', 'risk']
      }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n2', to: 'n5' }
    ]
  },
  {
    id: 'case-credential-leak',
    name: 'Credential Exposure',
    summary: 'Review leaked credentials and cross-reference with internal reuse patterns.',
    status: 'Monitoring',
    nodes: [
      {
        id: 'n10',
        x: 150,
        y: 140,
        title: 'Leaked dataset',
        text: 'Junior dataset appears to contain credential material with matching usernames.',
        entity: 'breach-archive',
        source: 'Dark web',
        type: 'evidence',
        color: 'violet',
        severity: 'critical',
        confidence: 'confirmed',
        tags: ['breach', 'credentials']
      },
      {
        id: 'n11',
        x: 450,
        y: 180,
        title: 'Account correlation',
        text: 'Username pattern overlaps with employee identities and public directory records.',
        entity: 'employee-usernames',
        source: 'Identity graph',
        type: 'analysis',
        color: 'teal',
        severity: 'high',
        confidence: 'high',
        tags: ['identity', 'reuse']
      },
      {
        id: 'n12',
        x: 760,
        y: 320,
        title: 'Hosted service',
        text: 'A webmail and portal infrastructure is publicly discoverable and internet-facing.',
        entity: 'mail.portal.local',
        source: 'DNS',
        type: 'asset',
        color: 'gold',
        severity: 'medium',
        confidence: 'high',
        tags: ['mail', 'service']
      }
    ],
    connections: [
      { from: 'n10', to: 'n11' },
      { from: 'n11', to: 'n12' }
    ]
  }
];

const nodeLayer = document.getElementById('nodeLayer');
const wireLayer = document.getElementById('wireLayer');
const saveStatus = document.getElementById('saveStatus');
const nodeCount = document.getElementById('nodeCount');
const linkCount = document.getElementById('linkCount');
const newNoteBtn = document.getElementById('newNoteBtn');
const newCaseBtn = document.getElementById('newCaseBtn');
const themeToggle = document.getElementById('themeToggle');
const nodeTitleInput = document.getElementById('nodeTitleInput');
const nodeEntityInput = document.getElementById('nodeEntityInput');
const nodeTextInput = document.getElementById('nodeTextInput');
const nodeSeverity = document.getElementById('nodeSeverity');
const nodeConfidence = document.getElementById('nodeConfidence');
const nodeTypeInput = document.getElementById('nodeTypeInput');
const nodeSourceInput = document.getElementById('nodeSourceInput');
const nodeTagsInput = document.getElementById('nodeTagsInput');
const saveNodeBtn = document.getElementById('saveNodeBtn');
const deleteNodeBtn = document.getElementById('deleteNodeBtn');
const caseTabs = document.getElementById('caseTabs');
const caseTitleDisplay = document.getElementById('caseTitleDisplay');
const caseSummaryDisplay = document.getElementById('caseSummaryDisplay');
const caseStatus = document.getElementById('caseStatus');
const filterChips = document.getElementById('filterChips');

let appState = loadState();
let selectedNodeId = null;
let activeFilter = 'all';
let dragState = null;
let linking = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentCaseId: defaultCases[0].id, cases: defaultCases };
    return JSON.parse(raw);
  } catch (error) {
    return { currentCaseId: defaultCases[0].id, cases: defaultCases };
  }
}

function getCurrentCase() {
  return appState.cases.find(caseItem => caseItem.id === appState.currentCaseId) || appState.cases[0];
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  saveStatus.textContent = 'Saved';
}

function updateSummary() {
  const currentCase = getCurrentCase();
  nodeCount.textContent = String(currentCase.nodes.length);
  linkCount.textContent = String(currentCase.connections.length);
}

function getNodeById(id) {
  return getCurrentCase().nodes.find(node => node.id === id);
}

function createNodeId() {
  return `n${Math.random().toString(36).slice(2, 9)}`;
}

function makeNode(templateKey, forcedX = 180, forcedY = 140) {
  const template = templates[templateKey];
  return {
    id: createNodeId(),
    x: forcedX,
    y: forcedY,
    title: template.title,
    text: template.text,
    entity: 'new-entity',
    source: 'Manual entry',
    type: template.type,
    color: template.color,
    severity: 'medium',
    confidence: 'medium',
    tags: ['new']
  };
}

function resetSaveStatus() {
  saveStatus.textContent = 'Unsaved';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function renderCaseTabs() {
  caseTabs.innerHTML = '';
  appState.cases.forEach(caseItem => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `case-tab ${appState.currentCaseId === caseItem.id ? 'active' : ''}`;
    button.textContent = caseItem.name;
    button.addEventListener('click', () => {
      appState.currentCaseId = caseItem.id;
      selectedNodeId = caseItem.nodes[0]?.id || null;
      saveState();
      render();
    });
    caseTabs.appendChild(button);
  });
}

function renderCaseHeader() {
  const currentCase = getCurrentCase();
  caseTitleDisplay.textContent = currentCase.name;
  caseSummaryDisplay.textContent = currentCase.summary;
  caseStatus.textContent = currentCase.status || 'Open';
}

function renderFilters() {
  filterChips.querySelectorAll('.filter-chip').forEach(button => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('active', isActive);
  });
}

function renderInspector() {
  const selected = getNodeById(selectedNodeId);
  if (!selected) {
    nodeTitleInput.value = '';
    nodeEntityInput.value = '';
    nodeTextInput.value = '';
    nodeSeverity.value = 'medium';
    nodeConfidence.value = 'medium';
    nodeTypeInput.value = '';
    nodeSourceInput.value = '';
    nodeTagsInput.value = '';
    return;
  }

  nodeTitleInput.value = selected.title || '';
  nodeEntityInput.value = selected.entity || '';
  nodeTextInput.value = selected.text || '';
  nodeSeverity.value = selected.severity || 'medium';
  nodeConfidence.value = selected.confidence || 'medium';
  nodeTypeInput.value = templates[selected.type]?.label || selected.type || '';
  nodeSourceInput.value = selected.source || '';
  nodeTagsInput.value = Array.isArray(selected.tags) ? selected.tags.join(', ') : '';
}

function renderWires() {
  const svg = wireLayer;
  const currentCase = getCurrentCase();
  svg.innerHTML = '';

  currentCase.connections.forEach(connection => {
    const from = getNodeById(connection.from);
    const to = getNodeById(connection.to);
    if (!from || !to) return;

    const startX = from.x + 220;
    const startY = from.y + 54;
    const endX = to.x;
    const endY = to.y + 54;
    const curve = 90;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`
    );
    path.setAttribute('class', 'wire');
    svg.appendChild(path);
  });
}

function renderNodes() {
  const currentCase = getCurrentCase();
  nodeLayer.innerHTML = '';

  currentCase.nodes.forEach(node => {
    if (activeFilter !== 'all' && node.type !== activeFilter) {
      return;
    }

    const el = document.createElement('div');
    el.className = `node ${selectedNodeId === node.id ? 'selected' : ''}`;
    el.dataset.id = node.id;
    el.dataset.color = node.color;
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;

    const tags = Array.isArray(node.tags) ? node.tags.slice(0, 2).map(tag => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('') : '';

    el.innerHTML = `
      <div class="node-pins">
        <span class="pin input"></span>
        <span class="pin output"></span>
      </div>
      <div class="node-header">
        <span class="node-tag">${templates[node.type]?.label || node.type}</span>
        <div class="node-actions">✦</div>
      </div>
      <div class="node-body">
        <h3 class="node-title">${escapeHtml(node.title)}</h3>
        <p class="node-text">${escapeHtml(node.text)}</p>
        <div class="node-footer">
          <span>${escapeHtml(node.severity || 'medium')}</span>
          <div class="meta-list">${tags}</div>
        </div>
      </div>
    `;

    el.addEventListener('click', event => {
      if (event.target.closest('.pin')) return;
      selectedNodeId = node.id;
      render();
    });

    const header = el.querySelector('.node-header');
    header.addEventListener('pointerdown', event => {
      if (event.target.closest('.node-actions')) return;
      dragState = {
        id: node.id,
        startX: event.clientX,
        startY: event.clientY,
        nodeX: node.x,
        nodeY: node.y
      };
      selectedNodeId = node.id;
      render();
    });

    const inputPin = el.querySelector('.pin.input');
    const outputPin = el.querySelector('.pin.output');

    inputPin.addEventListener('pointerdown', event => {
      event.stopPropagation();
      startLink(node.id, 'in');
    });

    outputPin.addEventListener('pointerdown', event => {
      event.stopPropagation();
      startLink(node.id, 'out');
    });

    nodeLayer.appendChild(el);
  });
}

function render() {
  renderCaseTabs();
  renderCaseHeader();
  renderFilters();
  renderWires();
  renderNodes();
  renderInspector();
  updateSummary();
}

function addNode(templateKey) {
  const currentCase = getCurrentCase();
  const node = makeNode(templateKey, 180 + Math.random() * 220, 150 + Math.random() * 200);
  currentCase.nodes.push(node);
  selectedNodeId = node.id;
  resetSaveStatus();
  saveState();
  render();
}

function startLink(nodeId) {
  linking = { from: nodeId };
}

window.addEventListener('pointermove', event => {
  if (!dragState) return;

  const currentCase = getCurrentCase();
  const node = currentCase.nodes.find(item => item.id === dragState.id);
  if (!node) return;

  node.x = Math.max(30, dragState.nodeX + (event.clientX - dragState.startX));
  node.y = Math.max(30, dragState.nodeY + (event.clientY - dragState.startY));

  render();
  resetSaveStatus();
});

window.addEventListener('pointerup', event => {
  if (dragState) {
    saveState();
    dragState = null;
  }

  if (linking) {
    const targetNode = document.elementFromPoint(event.clientX, event.clientY)?.closest('.node');
    if (targetNode) {
      const targetId = targetNode.dataset.id;
      if (targetId && targetId !== linking.from) {
        const currentCase = getCurrentCase();
        const exists = currentCase.connections.some(connection => connection.from === linking.from && connection.to === targetId);
        if (!exists) {
          currentCase.connections.push({ from: linking.from, to: targetId });
          resetSaveStatus();
        }
      }
    }
    linking = null;
    saveState();
    render();
  }
});

saveNodeBtn.addEventListener('click', () => {
  const currentCase = getCurrentCase();
  const selected = currentCase.nodes.find(node => node.id === selectedNodeId);
  if (!selected) return;

  selected.title = nodeTitleInput.value.trim() || selected.title;
  selected.entity = nodeEntityInput.value.trim() || selected.entity;
  selected.text = nodeTextInput.value.trim() || selected.text;
  selected.severity = nodeSeverity.value;
  selected.confidence = nodeConfidence.value;
  selected.source = nodeSourceInput.value.trim() || selected.source;
  selected.tags = nodeTagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  resetSaveStatus();
  saveState();
  render();
});

deleteNodeBtn.addEventListener('click', () => {
  const currentCase = getCurrentCase();
  if (!selectedNodeId) return;
  currentCase.nodes = currentCase.nodes.filter(node => node.id !== selectedNodeId);
  currentCase.connections = currentCase.connections.filter(
    connection => connection.from !== selectedNodeId && connection.to !== selectedNodeId
  );
  selectedNodeId = currentCase.nodes[0]?.id || null;
  resetSaveStatus();
  saveState();
  render();
});

newNoteBtn.addEventListener('click', () => {
  addNode('analysis');
});

newCaseBtn.addEventListener('click', () => {
  const name = `Case ${appState.cases.length + 1}`;
  const newCase = {
    id: `case-${Date.now()}`,
    name,
    summary: 'New investigation board for an active case.',
    status: 'Open',
    nodes: [
      {
        id: createNodeId(),
        x: 120,
        y: 140,
        title: 'New lead',
        text: 'Capture the first signal or focal point for this investigation.',
        entity: 'new lead',
        source: 'Manual entry',
        type: 'recon',
        color: 'cyan',
        severity: 'medium',
        confidence: 'medium',
        tags: ['lead']
      }
    ],
    connections: []
  };

  appState.cases.push(newCase);
  appState.currentCaseId = newCase.id;
  selectedNodeId = newCase.nodes[0].id;
  saveState();
  render();
});

document.querySelectorAll('[data-template]').forEach(button => {
  button.addEventListener('click', () => addNode(button.dataset.template));
});

filterChips.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  render();
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('theme-future');
});

window.addEventListener('keydown', event => {
  if (event.key === 'Delete' && selectedNodeId) {
    const currentCase = getCurrentCase();
    currentCase.nodes = currentCase.nodes.filter(node => node.id !== selectedNodeId);
    currentCase.connections = currentCase.connections.filter(
      connection => connection.from !== selectedNodeId && connection.to !== selectedNodeId
    );
    selectedNodeId = currentCase.nodes[0]?.id || null;
    resetSaveStatus();
    saveState();
    render();
  }
});

selectedNodeId = getCurrentCase().nodes[0]?.id || null;
render();
saveState();
