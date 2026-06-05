const avisos = [
    { img: 'assets/images/test1.jpg', fecha: 'Martes 3 de Febrero del 2026', texto: 'Preinscripciones <strong>ABIERTAS</strong> para el Ciclo Escolar 2026 - 27', link: '#' },
    { img: 'assets/images/test2.jpg', fecha: 'Jueves 14 de Mayo del 2026', texto: 'Suspensión de actividades académicas mañana, <b> 15 de Mayo </b>', link: '#' },
    { img: 'assets/images/test3.jpg', fecha: 'Martes 31 de Marzo del 2026', texto: '<strong> Recordatorio: </strong>Preinscripciones abiertas para el Ciclo Escolar 2026 - 27', link: '#' },
    { img: 'assets/images/test4.jpg', fecha: 'Viernes 15 de Mayo del 2026', texto: '¡Feliz día del maestro a todos los docentes de nuestra comunidad educativa!', link: '#' },
    { img: 'assets/images/test5.jpg', fecha: 'Lunes 4 de Mayo', texto: '<b>Invitación</b> a todas las madres de nuestra comunidad a misa por el día de las madres', link: '#' },
];

const track   = document.getElementById('cards-track');
const dotsEl  = document.getElementById('cards-dots');
const VISIBLE = 3;
let current   = 0;
const total   = avisos.length;

/* ── Renderizar tarjetas ── */
avisos.forEach(a => {
    track.innerHTML += `
    <div class="announcement-card">
        <div class="card-img">
            <img src="${a.img}" alt="">
        </div>
        <div class="card-body">
            <p class="card-date">${a.fecha}</p>
            <p class="card-text">${a.texto}</p>
            <a href="${a.link}" class="card-link">Leer más</a>
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