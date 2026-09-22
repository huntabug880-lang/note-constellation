const STORAGE_KEY = 'signal-graph-state';

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

const defaultState = {
  nodes: [
    {
      id: 'n1',
      x: 120,
      y: 120,
      title: 'Initial target',
      text: 'A suspicious domain, service, or actor profile with unclear scope.',
      type: 'recon',
      color: 'cyan',
      severity: 'medium',
      tags: ['target', 'dns']
    },
    {
      id: 'n2',
      x: 420,
      y: 170,
      title: 'Open-source discovery',
      text: 'Enumerate public records, DNS, endpoints, and social signals.',
      type: 'asset',
      color: 'gold',
      severity: 'high',
      tags: ['public', 'infrastructure']
    },
    {
      id: 'n3',
      x: 760,
      y: 250,
      title: 'Indicator tie-in',
      text: 'Map suspicious IPs, domains, hashes, and infrastructure behavior.',
      type: 'indicator',
      color: 'pink',
      severity: 'critical',
      tags: ['malware', 'ip']
    },
    {
      id: 'n4',
      x: 530,
      y: 420,
      title: 'Evidence review',
      text: 'Watchlists, screenshots, leaked records, host metadata, and logs.',
      type: 'evidence',
      color: 'violet',
      severity: 'high',
      tags: ['logs', 'screenshot']
    },
    {
      id: 'n5',
      x: 200,
      y: 490,
      title: 'Risk assessment',
      text: 'Evaluate confidence, scope, and operational impact of the findings.',
      type: 'analysis',
      color: 'teal',
      severity: 'medium',
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
};

const nodeLayer = document.getElementById('nodeLayer');
const wireLayer = document.getElementById('wireLayer');
const saveStatus = document.getElementById('saveStatus');
const nodeCount = document.getElementById('nodeCount');
const linkCount = document.getElementById('linkCount');
const newNoteBtn = document.getElementById('newNoteBtn');
const themeToggle = document.getElementById('themeToggle');
const nodeTitleInput = document.getElementById('nodeTitleInput');
const nodeTextInput = document.getElementById('nodeTextInput');
const nodeSeverity = document.getElementById('nodeSeverity');
const nodeTypeInput = document.getElementById('nodeTypeInput');
const nodeTagsInput = document.getElementById('nodeTagsInput');
const saveNodeBtn = document.getElementById('saveNodeBtn');
const deleteNodeBtn = document.getElementById('deleteNodeBtn');

let state = loadState();
let selectedNodeId = state.nodes[0]?.id || null;
let dragState = null;
let linking = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(defaultState);
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveStatus.textContent = 'Saved';
}

function updateSummary() {
  nodeCount.textContent = String(state.nodes.length);
  linkCount.textContent = String(state.connections.length);
}

function getNodeById(id) {
  return state.nodes.find(node => node.id === id);
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
    type: template.type,
    color: template.color,
    severity: 'medium',
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

function renderInspector() {
  const selected = getNodeById(selectedNodeId);
  if (!selected) {
    nodeTitleInput.value = '';
    nodeTextInput.value = '';
    nodeSeverity.value = 'medium';
    nodeTypeInput.value = '';
    nodeTagsInput.value = '';
    return;
  }

  nodeTitleInput.value = selected.title || '';
  nodeTextInput.value = selected.text || '';
  nodeSeverity.value = selected.severity || 'medium';
  nodeTypeInput.value = templates[selected.type]?.label || selected.type || '';
  nodeTagsInput.value = Array.isArray(selected.tags) ? selected.tags.join(', ') : '';
}

function renderWires() {
  const svg = wireLayer;
  svg.innerHTML = '';

  state.connections.forEach(connection => {
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
  nodeLayer.innerHTML = '';

  state.nodes.forEach(node => {
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
  renderWires();
  renderNodes();
  renderInspector();
  updateSummary();
}

function addNode(templateKey) {
  const node = makeNode(templateKey, 180 + Math.random() * 220, 150 + Math.random() * 200);
  state.nodes.push(node);
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

  const node = getNodeById(dragState.id);
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
        const exists = state.connections.some(connection => connection.from === linking.from && connection.to === targetId);
        if (!exists) {
          state.connections.push({ from: linking.from, to: targetId });
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
  const selected = getNodeById(selectedNodeId);
  if (!selected) return;

  selected.title = nodeTitleInput.value.trim() || selected.title;
  selected.text = nodeTextInput.value.trim() || selected.text;
  selected.severity = nodeSeverity.value;
  selected.tags = nodeTagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  resetSaveStatus();
  saveState();
  render();
});

deleteNodeBtn.addEventListener('click', () => {
  if (!selectedNodeId) return;
  state.nodes = state.nodes.filter(node => node.id !== selectedNodeId);
  state.connections = state.connections.filter(
    connection => connection.from !== selectedNodeId && connection.to !== selectedNodeId
  );
  selectedNodeId = state.nodes[0]?.id || null;
  resetSaveStatus();
  saveState();
  render();
});

newNoteBtn.addEventListener('click', () => {
  addNode('analysis');
});

document.querySelectorAll('[data-template]').forEach(button => {
  button.addEventListener('click', () => addNode(button.dataset.template));
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('theme-future');
});

window.addEventListener('keydown', event => {
  if (event.key === 'Delete' && selectedNodeId) {
    state.nodes = state.nodes.filter(node => node.id !== selectedNodeId);
    state.connections = state.connections.filter(
      connection => connection.from !== selectedNodeId && connection.to !== selectedNodeId
    );
    selectedNodeId = state.nodes[0]?.id || null;
    resetSaveStatus();
    saveState();
    render();
  }
});

render();
saveState();
