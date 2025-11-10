<<<<<<< HEAD
//NAWIGACJA

function menu(container, button) {
    let main = document.getElementsByClassName('main');
    for (let elem of main)
        elem.style.display = 'none';
    let el = document.getElementById(container);
    el.style.display = 'block';
    const buttons = document.querySelectorAll('.nav-container button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
button1.addEventListener('click', () => {menu('content1', button1)});
button2.addEventListener('click', () => {menu('content2', button2)});
button3.addEventListener('click', () => {menu('content3', button3)});
menu('content1', button1);

//ŁAMIGŁÓWKA

function randomizeBoard(buttons) {
    for (let i = 0; i < 30; i++)
        clickButton(buttons[Math.floor(Math.random() * 25)]);
    gameReady = true;
}

function toggleColor(button) {
    if (button.style.backgroundColor == 'rgb(255, 128, 0)')
        button.style.backgroundColor = '#333333';
    else
        button.style.backgroundColor = '#FF8000';
}

function getNeighbors(col, row) {
    const neighbors = [];
    if (col > 1) 
        neighbors.push(document.getElementById(`${col-1}${row}`));
    if (col < 5) 
        neighbors.push(document.getElementById(`${col+1}${row}`));
    if (row > 1) 
        neighbors.push(document.getElementById(`${col}${row-1}`));
    if (row < 5) 
        neighbors.push(document.getElementById(`${col}${row+1}`));
    return neighbors;
}

function clickButton(button) {
    const col = parseInt(button.id[0]);
    const row = parseInt(button.id[1]);
    const neighbors = getNeighbors(col, row);
    toggleColor(button);
    neighbors.forEach(toggleColor);
    clickCount++;
    document.getElementById('click-counter').textContent = clickCount;
    checkWin();
}

function checkWin() {
    if (!gameReady)
        return;
    const container = document.getElementById('content1');
    const buttons = container.querySelectorAll('button');
    for (let i = 0; i < 25; i++) {
        if (buttons[i].style.backgroundColor == 'rgb(255, 128, 0)')
            return;
    }
    setTimeout(() => {
        alert('Gratulacje! Udało Ci się wyłączyć wszystkie światła!\nKliknij OK, aby zagrać ponownie.');
        location.reload();
    }, 50);
}

let clickCount = -30;
let gameReady = false;
const container = document.getElementById('content1');
const buttons = container.querySelectorAll('button');
buttons.forEach(btn => btn.addEventListener('click',e => clickButton(e.target)));
randomizeBoard(buttons);
=======
setTimeout(() => {
    console.log('Test JS')
}, 4000)
>>>>>>> 356f7a26cc33c174720c96a6aa47b47307f40e45
