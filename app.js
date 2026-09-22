const STORAGE_KEY = 'blueprint-constellation-state';

const templates = {
  idea: {
    type: 'idea',
    label: 'Idea',
    color: 'cyan',
    title: 'New idea',
    text: 'Capture the thought, shape the spark, and build the next step.'
  },
  branch: {
    type: 'branch',
    label: 'Branch',
    color: 'gold',
    title: 'Decision fork',
    text: 'Ask a question and split the logic into different outcomes.'
  },
  trigger: {
    type: 'trigger',
    label: 'Trigger',
    color: 'pink',
    title: 'Event trigger',
    text: 'What moment starts this chain of thought?'
  },
  variable: {
    type: 'variable',
    label: 'Variable',
    color: 'violet',
    title: 'State value',
    text: 'Store the important detail or condition that guides the flow.'
  }
};

const defaultState = {
  nodes: [
    {
      id: 'n1',
      x: 120,
      y: 120,
      title: 'Start with the spark',
      text: 'Write the first thought that feels impossible to ignore.',
      type: 'trigger',
      color: 'pink'
    },
    {
      id: 'n2',
      x: 420,
      y: 180,
      title: 'Turn it into structure',
      text: 'Break the spark into the first clear action or promise.',
      type: 'idea',
      color: 'cyan'
    },
    {
      id: 'n3',
      x: 760,
      y: 260,
      title: 'Ask what matters',
      text: 'Define the key decision, risk, or tradeoff that guides the path.',
      type: 'branch',
      color: 'gold'
    }
  ],
  connections: [
    { from: 'n1', to: 'n2' },
    { from: 'n2', to: 'n3' }
  ]
};

const nodeLayer = document.getElementById('nodeLayer');
const wireLayer = document.getElementById('wireLayer');
const saveStatus = document.getElementById('saveStatus');
const nodeCount = document.getElementById('nodeCount');
const linkCount = document.getElementById('linkCount');
const newNoteBtn = document.getElementById('newNoteBtn');
const themeToggle = document.getElementById('themeToggle');

let state = loadState();
let selectedNodeId = null;
let dragState = null;

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

function makeNode(templateKey, forcedX = 120, forcedY = 120) {
  const template = templates[templateKey];
  return {
    id: createNodeId(),
    x: forcedX,
    y: forcedY,
    title: template.title,
    text: template.text,
    type: template.type,
    color: template.color
  };
}

function resetSaveStatus() {
  saveStatus.textContent = 'Unsaved';
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
          <span>Flow</span>
          <span>${node.color}</span>
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
  updateSummary();
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

function addNode(templateKey) {
  const node = makeNode(templateKey, 180 + Math.random() * 180, 160 + Math.random() * 170);
  state.nodes.push(node);
  resetSaveStatus();
  saveState();
  render();
}

let linking = null;

function startLink(nodeId, side) {
  linking = { from: nodeId, side };
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

window.addEventListener('pointerup', () => {
  if (dragState) {
    saveState();
  }
  dragState = null;

  if (linking) {
    const targetNode = document.elementFromPoint(window.event?.clientX || 0, window.event?.clientY || 0)?.closest('.node');
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

newNoteBtn.addEventListener('click', () => {
  addNode('idea');
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
    selectedNodeId = null;
    resetSaveStatus();
    saveState();
    render();
  }
});

render();
saveState();
