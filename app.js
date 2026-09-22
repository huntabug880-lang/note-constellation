const defaultNotes = [
  { title: 'The beginning', body: 'What if notes could feel more like a map than a list?', tag: 'starting point', color: '#ff5bc8', time: 'just now' },
  { title: 'Design system', body: 'A visual language for ideas that is expressive, playful, and a little cosmic.', tag: 'in progress', color: '#38e9e1', time: 'yesterday' },
  { title: 'Quiet rituals', body: 'Make space to notice the tiny sparks before they disappear.', tag: 'inspiration', color: '#ffd166', time: '3 days ago' }
];
let notes = JSON.parse(localStorage.getItem('constellation-notes') || 'null') || defaultNotes;
let selectedColor = '#ff5bc8';
const grid = document.getElementById('notesGrid');
const count = document.getElementById('noteCount');
const dialog = document.getElementById('noteDialog');
const status = document.getElementById('savedStatus');

function renderNotes() {
  grid.innerHTML = notes.map((note, index) => `
    <article class="note-card" style="--card-color:${note.color}" data-index="${index}">
      <span class="card-tag">${escapeHtml(note.tag || 'new spark')}</span>
      <span class="card-time">${escapeHtml(note.time || 'just now')}</span>
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.body)}</p>
    </article>`).join('');
  count.textContent = String(notes.length).padStart(2, '0');
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char])); }
function persist() { localStorage.setItem('constellation-notes', JSON.stringify(notes)); status.innerHTML = '<span class="status-dot"></span> All changes saved'; }
function openNote(index) { const note = notes[index]; if (!note) return; document.getElementById('noteTitle').value = note.title; document.getElementById('noteBody').value = note.body; dialog.showModal(); }

document.querySelectorAll('.note-node[data-note]').forEach(node => node.addEventListener('click', () => openNote(Number(node.dataset.note))));
document.getElementById('newNoteButton').addEventListener('click', () => { document.getElementById('noteTitle').value = ''; document.getElementById('noteBody').value = ''; dialog.showModal(); setTimeout(() => document.getElementById('noteTitle').focus(), 50); });
document.getElementById('noteForm').addEventListener('submit', event => { event.preventDefault(); const title = document.getElementById('noteTitle').value.trim(); const body = document.getElementById('noteBody').value.trim(); if (!title || !body) return; notes.unshift({ title, body, tag: 'new spark', color: selectedColor, time: 'just now' }); renderNotes(); persist(); dialog.close(); });
document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('high-glow'));
const colors = ['#ff5bc8', '#38e9e1', '#ffd166', '#9d7bff', '#71f79f', '#ff886b'];
document.getElementById('colorOptions').innerHTML = colors.map((color, i) => `<button type="button" aria-label="${color}" style="background:${color}" class="${i === 0 ? 'selected' : ''}" data-color="${color}"></button>`).join('');
document.querySelectorAll('#colorOptions button').forEach(button => button.addEventListener('click', () => { selectedColor = button.dataset.color; document.querySelectorAll('#colorOptions button').forEach(item => item.classList.remove('selected')); button.classList.add('selected'); }));
const starField = document.getElementById('starField');
for (let i = 0; i < 28; i++) { const star = document.createElement('i'); star.className = 'tiny-star'; star.style.cssText = `position:absolute;left:${Math.random()*96+2}%;top:${Math.random()*88+4}%;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;border-radius:50%;background:${Math.random()>.7?'#ffdf77':'#aeb9ff'};opacity:${Math.random()*.65+.2};box-shadow:0 0 7px currentColor;`; starField.appendChild(star); }
renderNotes();
