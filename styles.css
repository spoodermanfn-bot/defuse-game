const diamondUrl = 'https://freepngimg.com/download/artificial_grass/56561-3-gem-download-hq-png.png';
const bombUrl = 'https://cdn.pixabay.com/photo/2020/10/02/09/40/bomb-5620656_1280.png';
const taskName = "Mines";

let clicks = 0;
let gameOver = false;
let bombPositions = [];

function sendTaskUpdate(state) {
    const message = {
        TaskName: taskName,
        TaskTargetState: state
    };
    PortalsSdk.sendMessageToUnity(JSON.stringify(message));
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
        tile.classList.add('tile');
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

        document.querySelectorAll('.tile:not(.revealed)').forEach(t => {
            const idx = parseInt(t.dataset.index);
            if (bombPositions.includes(idx)) {
                t.classList.add('revealed', 'bomb');
                t.innerHTML = `<img src="${bombUrl}" alt="bomb" class="icon">`;
            }
        });

        sendTaskUpdate("SetAnyToCompleted");
        setTimeout(() => PortalsSdk.closeIframe(), 2000);

    } else {
        tile.innerHTML = `<img src="${diamondUrl}" alt="gem" class="icon">`;
        tile.classList.add('gem');
        clicks++;
        if (clicks >= 15) {
            gameOver = true;
            showOverlay('You Win!', 'limegreen');
            sendTaskUpdate("SetNotActiveToActive");
            setTimeout(() => PortalsSdk.closeIframe(), 2000);
        }
    }
}

function showOverlay(text, color) {
    const overlay = document.getElementById('overlay');
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.style.color = color;
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('show'), 10);
}

window.onload = () => {
    // Only style iframe if running inside one
    if (window.top !== window.self && window.frameElement) {
        window.frameElement.style.position = 'fixed';
        window.frameElement.style.top = '0';
        window.frameElement.style.left = '0';
        window.frameElement.style.width = '100vw';
        window.frameElement.style.height = '100vh';
        window.frameElement.style.border = 'none';
    }

    sendTaskUpdate("ToNotActive");
    newGame();
};
