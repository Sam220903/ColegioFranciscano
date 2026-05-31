/* ── Datos de avisos (reemplaza con tus datos reales) ── */
const avisos = [
    {
    fecha: 'Martes 3 de Febrero del 2026',
    texto: 'Preinscripciones <strong>ABIERTAS</strong> para el Ciclo Escolar 2026 - 27'
    },
    {
    fecha: 'Miércoles 13 de Mayo del 2026',
    texto: 'Suspensión de clases por consejo técnico escolar el próximo <strong>Viernes 15 de Mayo</strong>'
    },
    {
    fecha: 'Lunes 25 de Mayo del 2026',
    texto: ' Simulacro Nacional el pŕoximo <strong> Viernes 29 de Mayo </strong>'
    }
];

/* ── Renderizar tarjetas ── */
const cardsContainer = document.getElementById('announcement-cards');
avisos.forEach(aviso => {
    cardsContainer.innerHTML += `
    <div class="announcement-card">
        <div class="card-date">${aviso.fecha}</div>
        <div class="card-text">${aviso.texto}</div>
    </div>
    `;
});

/* ── Carrusel ── */
const track  = document.getElementById('carousel-track');
const slides = track.querySelectorAll('.carousel-slide');
const dotsEl = document.getElementById('carousel-dots');
let current  = 0;

// Crear dots
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

// Auto-avance cada 4 s
setInterval(() => goTo(current + 1), 4000);