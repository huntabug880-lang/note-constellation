* {
  box-sizing: border-box;
}

:root {
  --bg: #070b29;
  --bg-2: #091b38;
  --panel: rgba(19, 25, 68, 0.78);
  --panel-strong: rgba(17, 25, 51, 0.92);
  --panel-soft: rgba(24, 36, 74, 0.85);
  --line: rgba(144, 151, 229, 0.2);
  --line-strong: rgba(150, 182, 255, 0.32);
  --text: #f5f3ff;
  --muted: #a1abd8;
  --cyan: #38e9e1;
  --pink: #ff5bc8;
  --yellow: #ffd166;
  --purple: #9d7bff;
  --green: #71f79f;
  --orange: #ff886b;
  --shadow: rgba(0, 0, 0, 0.35);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: 'Space Grotesk', sans-serif;
  background:
    radial-gradient(circle at 74% 16%, rgba(24, 34, 92, 0.92), transparent 22%),
    radial-gradient(circle at 20% 78%, rgba(18, 32, 77, 0.92), transparent 26%),
    linear-gradient(180deg, #050b22 0%, #070d2b 100%);
  color: var(--text);
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.9) 0 1px, transparent 1.3px),
    radial-gradient(circle, rgba(163, 201, 255, 0.8) 0 1px, transparent 1.5px);
  background-size: 34px 34px;
  background-position: 0 0, 16px 16px;
  opacity: 0.26;
}

body.high-glow {
  --panel: rgba(20, 32, 72, 0.75);
  --line: rgba(146, 185, 255, 0.26);
}

button, input, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button, input, textarea {
  transition: all 180ms ease;
}

.app-shell {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 18px auto 42px;
  padding: 0 28px 40px;
}

.topbar {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(143, 151, 229, 0.14);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: -0.06em;
  text-transform: lowercase;
}

.brand > span:last-child {
  font-size: 1.05rem;
}

.brand > span:last-child > span {
  color: var(--cyan);
  font-weight: 700;
}

.brand-mark {
  position: relative;
  display: block;
  width: 26px;
  height: 26px;
}

.brand-mark i {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 18px rgba(56, 233, 225, 0.85);
}

.brand-mark i:nth-child(1) { left: 0; top: 10px; }
.brand-mark i:nth-child(2) { left: 10px; top: 0; }
.brand-mark i:nth-child(3) { left: 20px; top: 10px; }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.saved-status {
  color: var(--muted);
  font: 500 11px 'DM Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 12px rgba(113, 247, 159, 0.8);
  margin-right: 8px;
  vertical-align: middle;
}

.icon-button {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(161, 171, 216, 0.26);
  border-radius: 50%;
  background: rgba(19, 25, 68, 0.5);
  color: var(--text);
  font-size: 1.05rem;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(255, 91, 200, 0.22), rgba(56, 233, 225, 0.24));
  border: 1px solid rgba(255, 255, 255, 0.2);
  font: 700 0.75rem 'DM Mono', monospace;
  letter-spacing: 0.08em;
}

.workspace {
  padding-top: 30px;
}

.intro-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  padding: 0 4px 28px;
}

.eyebrow {
  margin: 0 0 12px;
  color: rgba(157, 169, 226, 0.8);
  font: 500 11px 'DM Mono', monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  line-height: 0.92;
  letter-spacing: -0.08em;
  font-weight: 700;
}

h1 em {
  color: var(--cyan);
  font-style: normal;
  text-shadow: 0 0 18px rgba(56, 233, 225, 0.45);
}

.subcopy {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 1.05rem;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 91, 200, 0.22), rgba(56, 233, 225, 0.24));
  color: var(--text);
  font-weight: 600;
  letter-spacing: -0.04em;
  box-shadow: 0 0 26px rgba(255, 91, 200, 0.2);
}

.primary-button.narrow {
  min-height: 42px;
  padding: 0 18px;
}

.primary-button span {
  font-size: 1.35rem;
}

.constellation-card {
  position: relative;
  overflow: hidden;
  min-height: 440px;
  padding: 18px;
  border: 1px solid rgba(142, 151, 233, 0.25);
  border-radius: 18px;
  background: radial-gradient(ellipse at 52% 54%, rgba(8, 21, 38, 0.92), rgba(7, 11, 35, 0.9));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.space-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08), transparent 18%),
    radial-gradient(circle at 70% 35%, rgba(56, 233, 225, 0.08), transparent 15%),
    radial-gradient(circle at 55% 75%, rgba(255, 91, 200, 0.07), transparent 18%);
}

.constellation-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.96;
}

.constellation-lines path {
  fill: none;
  stroke: rgba(245, 212, 122, 0.9);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 8px rgba(245, 212, 122, 0.6));
}

.star-field {
  position: absolute;
  inset: 0;
}

.tiny-star {
  position: absolute;
  width: var(--size, 3px);
  height: var(--size, 3px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 18px rgba(245, 212, 122, 0.9);
  animation: twinkle 4s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.4); opacity: 1; }
}

.constellation-label {
  position: absolute;
  color: rgba(231, 236, 255, 0.7);
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: lowercase;
  pointer-events: none;
}

.label-one { left: 12%; top: 16%; }
.label-two { left: 46%; top: 15%; }
.label-three { left: 70%; top: 58%; }

.zodiac-label {
  position: absolute;
  color: rgba(244, 247, 255, 0.88);
  font: 700 0.75rem 'DM Mono', monospace;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.24);
}

.gemini { left: 8%; top: 12%; }
.taurus { left: 31%; top: 11%; }
.aries { left: 43%; top: 25%; }
.pisces { left: 67%; top: 34%; }
.scorpio { right: 6%; top: 12%; }
.virgo { left: 18%; top: 39%; }
.leo { left: 48%; top: 42%; }
.sagittarius { left: 6%; top: 63%; }
.aquarius { right: 8%; top: 57%; }
.cancer { left: 47%; top: 69%; }
.libra { left: 30%; top: 70%; }
.capricorn { right: 10%; top: 74%; }

.note-node {
  --node-color: var(--yellow);
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  text-align: left;
  cursor: pointer;
}

.note-node .node-glow {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--node-color);
  box-shadow: 0 0 20px var(--node-color), 0 0 36px rgba(255, 255, 255, 0.6);
}

.note-node .node-core {
  position: relative;
  z-index: 1;
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  font-size: 0.8rem;
  color: var(--node-color);
  text-shadow: 0 0 18px var(--node-color);
}

.note-node .node-caption {
  position: relative;
  z-index: 1;
  padding-left: 8px;
  font: 600 0.85rem 'Space Grotesk', sans-serif;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.8);
}

.node-a { left: 8%; top: 18%; }
.node-b { left: 34%; top: 12%; }
.node-c { left: 54%; top: 20%; }
.node-d { left: 68%; top: 48%; }
.node-e { left: 38%; top: 58%; }
.node-f { right: 10%; top: 70%; }

.notes-section {
  padding-top: 42px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2.4rem);
  letter-spacing: -0.06em;
}

.section-heading span {
  color: var(--muted);
  font: 500 0.74rem 'DM Mono', monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 22px;
}

.note-card {
  --card-color: var(--pink);
  position: relative;
  padding: 20px 18px 18px;
  border: 1px solid rgba(151, 171, 255, 0.25);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(16, 23, 49, 0.94), rgba(11, 18, 38, 0.94));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  overflow: hidden;
}

.note-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--card-color);
  box-shadow: 0 0 18px var(--card-color);
}

.card-tag,
.card-time {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font: 500 0.66rem 'DM Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card-tag {
  background: rgba(255, 255, 255, 0.04);
  color: var(--card-color);
  padding: 6px 8px;
}

.card-time {
  float: right;
  color: var(--muted);
}

.note-card h3 {
  margin: 16px 0 10px;
  font-size: 1.46rem;
  letter-spacing: -0.05em;
}

.note-card p {
  margin: 0;
  color: #dfe5ff;
  line-height: 1.6;
  font-size: 0.96rem;
}

dialog {
  width: min(480px, calc(100% - 32px));
  border: 1px solid rgba(255, 91, 200, 0.35);
  border-radius: 22px;
  padding: 0;
  color: var(--text);
  background: #101742;
  box-shadow: 0 20px 100px rgba(0, 0, 0, 0.65);
}

dialog::backdrop {
  background: rgba(3, 6, 17, 0.68);
}

.note-form {
  padding: 24px 24px 20px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: -0.05em;
}

.dialog-close {
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  font-size: 1.2rem;
}

.note-form label {
  display: block;
  margin-bottom: 18px;
}

.note-form label > span,
.color-picker-wrap > span {
  display: inline-block;
  margin-bottom: 8px;
  color: var(--muted);
  font: 500 0.72rem 'DM Mono', monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.note-form input,
.note-form textarea {
  width: 100%;
  border: 1px solid rgba(168, 181, 255, 0.22);
  border-radius: 14px;
  background: rgba(10, 17, 39, 0.7);
  color: var(--text);
  padding: 12px 14px;
}

.note-form textarea {
  resize: vertical;
  min-height: 120px;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-options button {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  padding: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.color-options button.selected {
  transform: scale(1.12);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4), 0 0 18px rgba(255, 255, 255, 0.4);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.secondary-button {
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid rgba(168, 181, 255, 0.25);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
}

@media (max-width: 700px) {
  .app-shell {
    padding: 0 18px 30px;
  }

  .topbar {
    height: auto;
    padding: 20px 0 12px;
    flex-wrap: wrap;
  }

  .topbar-actions {
    width: 100%;
    justify-content: space-between;
  }

  .saved-status {
    display: none;
  }

  .intro-row {
    display: block;
    padding-bottom: 22px;
  }

  .primary-button {
    margin-top: 24px;
  }

  .constellation-card {
    min-height: 360px;
  }

  .zodiac-label {
    font-size: 0.58rem;
    letter-spacing: 0.12em;
  }

  .note-node .node-caption {
    display: none;
  }
}
