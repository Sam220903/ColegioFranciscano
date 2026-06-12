import API from "./api/index.js";
import { formatDate } from "./lib/date_formatter.js";

const notices = await API.notices.getAll();
const mainNotice = await API.notices.getMain();

const track   = document.getElementById('cards-track');
const dotsEl  = document.getElementById('cards-dots');
const VISIBLE = 3;
let current   = 0;
const total   = notices.length;

// Renderizar contenido de aviso principal
const mainNoticeTitle = document.getElementById('main-notice-title');
mainNoticeTitle.innerHTML = mainNotice.title;

const mainNoticeImg = document.getElementById('main-notice-img');
mainNoticeImg.src = mainNotice.image_url;

const mainNoticeLink = document.getElementById('main-notice-link');
mainNoticeLink.href = `aviso.html?id=${mainNotice.id}`;

/* ── Renderizar tarjetas ── */
notices.forEach(n => {
    track.innerHTML += `
    <div class="announcement-card">
        <div class="card-img">
            <img src="${n.image_url}" alt="">
        </div>
        <div class="card-body">
            <p class="card-date">${formatDate(n.publish_date)}</p>
            <p class="card-text">${n.title}</p>
            <a href="aviso.html?id=${n.id}" class="card-link">Leer más</a>
        </div>
    </div>`;
});

/* ── Dots: uno por cada carta ── */
for (let i = 0; i < total; i++) {
    const d = document.createElement('span');
    if (i === 0) d.classList.add('active');
    d.addEventListener('click', () => goTo(i - 1));
    dotsEl.appendChild(d);
}

/* ── Mover carrusel ── */
function cardWidth() {
    return track.querySelector('.announcement-card').offsetWidth;
}

function goTo(index) {
    current = Math.max(-1, Math.min(index, total - VISIBLE + 1));
    const gap = parseInt(getComputedStyle(track).gap) || 24;
    const cw  = cardWidth();
    // cuando current=-1 → translate positivo = una carta a la derecha
    const tx = current * (cw + gap);
    track.style.transform = `translateX(${tx > 0 ? '-' : ''}${Math.abs(tx)}px)`;
    dotsEl.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === current + 1));
}

setTimeout(() => goTo(0), 50);

document.getElementById('cards-prev').addEventListener('click', () => goTo(current - 1));
document.getElementById('cards-next').addEventListener('click', () => goTo(current + 1));