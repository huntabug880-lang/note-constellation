<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Note Constellation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="Note Constellation home">
          <span class="brand-mark"><i></i><i></i><i></i></span>
          <span>note<span>constellation</span></span>
        </a>

        <div class="topbar-actions">
          <span class="saved-status" id="savedStatus"><span class="status-dot"></span> All changes saved</span>
          <button class="icon-button" id="themeToggle" aria-label="Toggle glow mode">☼</button>
          <div class="avatar">HB</div>
        </div>
      </header>

      <main class="workspace">
        <section class="intro-row">
          <div>
            <p class="eyebrow">YOUR UNIVERSE · <span id="noteCount">03</span> NOTES</p>
            <h1>Think in <em>constellations.</em></h1>
            <p class="subcopy">Capture sparks of thought, then connect the dots.</p>
          </div>
          <button class="primary-button" id="newNoteButton"><span>＋</span> New note</button>
        </section>

        <section class="constellation-card" aria-label="Your note constellation">
          <div class="space-noise"></div>
          <div class="constellation-label label-one">ideas</div>
          <div class="constellation-label label-two">projects</div>
          <div class="constellation-label label-three">inspiration</div>

          <svg class="constellation-lines" viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden="true">
            <path d="M95 252 L180 145 L286 196 L365 103 L470 164 L542 79 L636 161 L735 106 L814 194 L903 119" />
            <path d="M180 145 L205 303 L286 196 L345 305 L470 164" />
            <path d="M542 79 L570 270 L636 161 L685 300 L814 194" />
            <path d="M735 106 L770 32 M814 194 L892 283 L903 119" />
          </svg>

          <div class="zodiac-label gemini">GEMINI</div>
          <div class="zodiac-label taurus">TAURUS</div>
          <div class="zodiac-label aries">ARIES</div>
          <div class="zodiac-label pisces">PISCES</div>
          <div class="zodiac-label scorpio">SCORPIUS</div>
          <div class="zodiac-label virgo">VIRGO</div>
          <div class="zodiac-label leo">LEO</div>
          <div class="zodiac-label sagittarius">SAGITTARIUS</div>
          <div class="zodiac-label aquarius">AQUARIUS</div>
          <div class="zodiac-label cancer">CANCER</div>
          <div class="zodiac-label libra">LIBRA</div>
          <div class="zodiac-label capricorn">CAPRICORN</div>

          <div class="star-field" id="starField"></div>

          <button class="note-node node-a" type="button" data-note="0">
            <span class="node-glow"></span>
            <span class="node-core">✦</span>
            <span class="node-caption">The beginning</span>
          </button>
          <button class="note-node node-b" type="button" data-note="1">
            <span class="node-glow"></span>
            <span class="node-core">✦</span>
            <span class="node-caption">Design system</span>
          </button>
          <button class="note-node node-c" type="button" data-note="2">
            <span class="node-glow"></span>
            <span class="node-core">✦</span>
            <span class="node-caption">Quiet rituals</span>
          </button>
          <button class="note-node node-d" type="button" data-note="3">
            <span class="node-glow"></span>
            <span class="node-core">✦</span>
            <span class="node-caption">New spark</span>
          </button>
          <button class="note-node node-e" type="button" data-note="4">
            <span class="node-glow"></span>
            <span class="node-core">✦</span>
            <span class="node-caption">Collect notes</span>
          </button>
          <button class="note-node node-f" type="button" data-note="5">
            <span class="node-glow"></span>
            <span class="node-core">✦</span>
            <span class="node-caption">Side quests</span>
          </button>
        </section>

        <section class="notes-section" aria-label="Note cards">
          <div class="section-heading">
            <h2>Recent sparks</h2>
            <span>Keep orbiting ideas alive</span>
          </div>
          <div class="notes-grid" id="notesGrid"></div>
        </section>
      </main>
    </div>

    <dialog id="noteDialog" aria-labelledby="noteDialogTitle">
      <form class="note-form" id="noteForm" method="dialog">
        <div class="dialog-header">
          <h3 id="noteDialogTitle">Edit note</h3>
          <button type="button" class="dialog-close" data-close-dialog aria-label="Close note editor">×</button>
        </div>

        <label>
          <span>Title</span>
          <input id="noteTitle" name="title" type="text" maxlength="80" placeholder="Title your spark" />
        </label>

        <label>
          <span>Tag</span>
          <input id="noteTag" name="tag" type="text" maxlength="24" placeholder="starting point" />
        </label>

        <label>
          <span>Thought</span>
          <textarea id="noteBody" name="body" rows="6" placeholder="Write the note that wants to grow..."></textarea>
        </label>

        <div class="color-picker-wrap">
          <span>Glow</span>
          <div class="color-options" id="colorOptions"></div>
        </div>

        <div class="dialog-actions">
          <button type="button" class="secondary-button" data-close-dialog>Cancel</button>
          <button type="submit" class="primary-button narrow">Save note</button>
        </div>
      </form>
    </dialog>

    <script src="app.js"></script>
  </body>
</html>
