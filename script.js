// script.js - robust Portals-safe version
const diamondUrl = 'https://freepngimg.com/download/artificial_grass/56561-3-gem-download-hq-png.png';
const bombUrl = 'https://cdn.pixabay.com/photo/2020/10/02/09/40/bomb-5620656_1280.png';
const taskName = "Mines";

let clicks = 0;
let gameOver = false;
let bombPositions = [];

function isPortalsAvailable() {
  return (typeof PortalsSdk !== 'undefined') && PortalsSdk && typeof PortalsSdk.sendMessageToUnity === 'function';
}
function canCloseIframe() {
  return (typeof PortalsSdk !== 'undefined') && PortalsSdk && typeof PortalsSdk.closeIframe === 'function';
}

function sendTaskUpdate(state) {
  const message = { TaskName: taskName, TaskTargetState: state };
  const payload = JSON.stringify(message);

  if (isPortalsAvailable()) {
    try {
      PortalsSdk.sendMessageToUnity(payload);
      console.log('[Portals] sent:', payload);
    } catch (e) {
      console.warn('[Portals] sendMessageToUnity failed:', e);
    }
  } else {
    // Portals SDK isn't here (running on GH Pages / browser). Log for debugging.
    console.log('[Portals] SDK not available — would have sent:', payload);
  }
}

function tryCloseIframe(delay = 2000) {
  if (canCloseIframe()) {
    setTimeout(() => {
      try {
        PortalsSdk.closeIframe();
        console.log('[Portals] closeIframe called');
      } catch (e) {
        console.warn('[Portals] closeIframe threw:', e);
      }
    }, delay);
  } else {
    console.log('[Portals] closeIframe not available; skipping actual close.');
  }
}

function newGame() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  clicks = 0;
  gameOver = false;

  const tiles = 25;
  const numBombs = 3;
  bombPositions = [];
  while (bombPositions.length < numBombs) {
    const pos = Math.floor(Math.random() * tiles);
    if (!bombPositions.includes(pos)) bombPositions.push(pos);
  }

  for (let i = 0; i < tiles; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.index = i;
    tile.onclick = () => reveal(tile, bombPositions.includes(i));
    grid.appendChild(tile);
  }
}

function reveal(tile, isBomb) {
  if (gameOver || tile.classList.contains('revealed')) return;
  tile.classList.add('revealed');

  if (isBomb) {
    tile.innerHTML = `<img src="${bombUrl}" alt="bomb" class="icon">`;
    tile.classList.add('bomb', 'exploding');
    gameOver = true;
    showOverlay('You Die!', 'red');

    // Reveal other bombs
    document.querySelectorAll('.tile').forEach(t => {
      const idx = parseInt(t.dataset.index, 10);
      if (bombPositions.includes(idx) && !t.classList.contains('revealed')) {
        t.classList.add('revealed', 'bomb');
        t.innerHTML = `<img src="${bombUrl}" alt="bomb" class="icon">`;
      }
    });

    // Notify Portals and close after delay (if available)
    sendTaskUpdate("SetAnyToCompleted");
    tryCloseIframe(2000);

  } else {
    tile.innerHTML = `<img src="${diamondUrl}" alt="gem" class="icon">`;
    tile.classList.add('gem');
    clicks++;
    if (clicks >= 15) {
      gameOver = true;
      showOverlay('You Win!', 'limegreen');

      // Notify Portals and close after delay (if available)
      sendTaskUpdate("SetNotActiveToActive");
      tryCloseIframe(2000);
    }
  }
}

function showOverlay(text, color) {
  const overlay = document.getElementById('overlay');
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.style.color = color;
  overlay.classList.remove('hidden');
  // allow CSS transition to run
  setTimeout(() => overlay.classList.add('show'), 10);
}

/* Safe initialization — no assumptions about being inside an iframe or having Portals loaded */
window.addEventListener('load', () => {
  // Only style the iframe element if it actually exists and is safe to change
  if (window.top !== window.self && window.frameElement && window.frameElement.style) {
    try {
      const el = window.frameElement;
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.left = '0';
      el.style.width = '100vw';
      el.style.height = '100vh';
      el.style.border = 'none';
      console.log('[frame] styled to fullscreen');
    } catch (e) {
      console.warn('[frame] styling failed', e);
    }
  } else {
    console.log('[frame] not inside iframe or frameElement missing — skipping frame styling');
  }

  // Tell Portals the task should start Not Active if SDK is available
  if (isPortalsAvailable()) {
    sendTaskUpdate("ToNotActive");
  } else {
    console.log('[Portals] SDK not available on load — skipping ToNotActive message');
  }

  newGame();
});
