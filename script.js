body {
    background-color: black;
    color: white;
    font-family: 'Roboto', sans-serif;
    text-align: center;
    margin: 0;
    padding: 20px;
}
h1 {
    margin-top: 20px;
    text-shadow: 0 0 10px limegreen;
}
p {
    margin-bottom: 20px;
}
.grid {
    display: grid;
    grid-template-columns: repeat(5, 100px);
    grid-gap: 15px;
    margin: 0 auto 20px;
    width: fit-content;
}
.tile {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #444, #222);
    border-radius: 15px;
    cursor: pointer;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tile:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(255,255,255,0.5); }
.tile.revealed { background: transparent; pointer-events: none; }
.icon { width: 80%; height: 80%; object-fit: contain; }
.gem .icon { animation: shine 1.5s infinite alternate ease-in-out; }
@keyframes shine { 0% { filter: brightness(1) saturate(1);} 100% { filter: brightness(1.5) saturate(1.5);} }
.bomb .icon { animation: shake 0.3s ease-in-out; }
@keyframes shake {
  0% { transform: translate(0,0); } 25% { transform: translate(-5px,5px);} 50% { transform: translate(5px,-5px);} 75% { transform: translate(-5px,5px);} 100% { transform: translate(0,0);}
}
.exploding .icon { animation: explode 0.8s forwards ease-in-out; }
@keyframes explode { 0%{transform:scale(1);opacity:1;} 50%{transform:scale(1.3);opacity:1;filter:brightness(2);} 100%{transform:scale(1.5);opacity:0;} }
.exploding::after {
  content:'';
  position:absolute;
  top:0;left:0;width:100%;height:100%;
  background: radial-gradient(circle, orange, transparent);
  animation: burst 0.8s forwards;
}
@keyframes burst { 0%{transform:scale(0);opacity:1;} 100%{transform:scale(2);opacity:0;} }

.overlay {
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.8);
    display:flex; align-items:center; justify-content:center;
    z-index:10; opacity:0; transition:opacity 0.5s;
}
.overlay.show { opacity:1; }
.overlay h2 { font-size:60px; text-shadow:0 0 20px currentColor; animation:pulse 1.5s infinite alternate; }
@keyframes pulse { 0%{transform:scale(1);}100%{transform:scale(1.1);} }

.hidden { display:none; }
