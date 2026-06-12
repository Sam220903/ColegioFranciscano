import API from "./api/index.js";
import { formatDate } from "./lib/date_formatter.js";

const notices = await API.notices.getAll();
notices.splice(3);

/* ── Renderizar slides del carrusel ── */
const track = document.getElementById('carousel-track');
track.innerHTML = ""; // limpia los slides hardcodeados del HTML

notices.forEach(notice => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    slide.innerHTML = `<img src="${notice.image_url}" alt="${notice.title}">`;
    track.appendChild(slide);
});

/* ── Renderizar tarjetas ── */
const cardsContainer = document.getElementById('announcement-cards');
notices.forEach(notice => {
    cardsContainer.innerHTML += `
    <div class="announcement-card">
        <div class="card-date">${formatDate(notice.publish_date)}</div>
        <div class="card-text">${notice.title}</div>
        <div class="card-link-container">
            <a href="aviso.html?id=${notice.id}" class="card-link">Leer más</a>
        </div>
    </div>
    `;
});

/* ── Carrusel ── */
// Este bloque debe ir DESPUÉS de renderizar los slides
const slides = track.querySelectorAll('.carousel-slide');
const dotsEl = document.getElementById('carousel-dots');
let current  = 0;

slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
});

function goTo(index) {
    slides[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.children[current].classList.add('active');
}

document.getElementById('carousel-prev').addEventListener('click', () => goTo(current - 1));
document.getElementById('carousel-next').addEventListener('click', () => goTo(current + 1));
setInterval(() => goTo(current + 1), 4000);