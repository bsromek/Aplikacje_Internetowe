function start() {
    if (interval == null)
    {
        interval = setInterval(() => {
            time++;
            document.getElementById('timer').textContent = format(time);
        }, 1000);
    }
}

function stop() {
    clearInterval(interval);
    interval = null;
}

function reset() {
    stop();
    time = 0;
    document.getElementById('timer').textContent = format(time);
}

function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m>0)
        return `${m}min ${s}s`;
    else
        return `${s}s`;
}

let time = 0;
let interval = null;
const button_start = document.getElementById('start');
const button_stop = document.getElementById('stop');
const button_reset = document.getElementById('reset');
button_start.addEventListener('click', start);
button_stop.addEventListener('click', stop);
button_reset.addEventListener('click', reset);