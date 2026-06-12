import API from "./api/index.js";
import { formatDate } from "./lib/date_formatter.js";

const id = new URLSearchParams(window.location.search).get('id');
if (!id) {
    alert('No se ha especificado un aviso');
    window.location.href = 'avisos.html';
}

document.addEventListener("DOMContentLoaded", async () => {
    let notice;

    try {
        notice = await API.notices.getById(id);
    } catch (error) {
        alert('Ocurrió un error al cargar el aviso');
        window.location.href = 'avisos.html';
        return;
    }

    if (!notice) {
        alert('No se ha encontrado el aviso solicitado');
        window.location.href = 'avisos.html';
        return;
    }

    const title = document.getElementById('announcement-title');
    title.innerHTML = notice.title;

    const category = document.getElementById('category');
    category.innerHTML = notice.category;

    const publish_date = document.getElementById('publish-date');
    publish_date.innerHTML = formatDate(notice.publish_date, 2);

    const summary = document.getElementById('summary');
    summary.innerHTML = notice.summary;

    const img = document.getElementById('announcement-img');
    img.src = notice.image_url;
    img.alt = notice.title;

    const content = document.getElementById('announcement-text')
    content.innerHTML = notice.content;
});