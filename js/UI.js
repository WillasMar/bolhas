import { anim } from "./main.js";


const newGame = document.querySelector('#startGameBtn');
const creditBtn = document.querySelector('#creditBtn');
const backBtn = document.querySelector('#backBtn');

newGame.addEventListener('click', () => {
    toggleScreen('#startGameBtn', false);
    toggleScreen('#theHeader', false);
    toggleScreen('#credits', false);
    toggleScreen('#main', true);
    toggleScreen('#creditBtn', false);
    anim();
});
creditBtn.addEventListener('click', () => {
    toggleScreen('#theHeader', false);
    toggleScreen('#creditBtn', false);
    toggleScreen('#startGameBtn', false);
    toggleScreen('#credits', true);
    toggleScreen('#backBtn', true);
});
backBtn.addEventListener('click', () => {
    toggleScreen('#backBtn', false);
    toggleScreen('#credits', false);
    toggleScreen('#theHeader', true);
    toggleScreen('#startGameBtn', true);
    toggleScreen('#creditBtn', true);
});
function toggleScreen(id, toggle) {
    let element = document.querySelector(id);
    let display = ( toggle ) ? 'block' : 'none';
    element.style.display = display;
 };

 export { newGame, creditBtn, backBtn }