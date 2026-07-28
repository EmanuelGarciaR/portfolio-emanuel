const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(item => {
            item.classList.remove('nav__link--active');

            this.classList.add('nav__link--active')
        });
    });
})

// Proyectossss

const GRID_SELECTOR = '#projects-grid';
const JSON_PATH = './proyectos.json';

async function cargarProyectos() {
    const grid = document.querySelector(GRID_SELECTOR);

    try {
        const respuesta = await fetch(JSON_PATH);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const proyectos = await respuesta.json();
        renderizarProyectos(proyectos, grid);

    } catch (error) {
        console.error('No se pudieron cargar los proyectos:', error);
        grid.innerHTML = '<p class="projects__error">No se pudieron cargar los proyectos. Intenta más tarde.</p>';
    }
}

function renderizarProyectos(proyectos, contenedor) {
    contenedor.innerHTML = proyectos.map(crearCardHTML).join('');
}

const techIcons = {
    "Next.js": "https://cdn.simpleicons.org/nextdotjs/white",
    "Supabase": "https://cdn.simpleicons.org/supabase/3ECF8E",
    "TMDB(B API": "https://cdn.simpleicons.org/themoviedatabase/01B4E4",
    "Trackt API": "https://cdn.simpleicons.org/trakt/ED1C24",
    "Python": "https://cdn.simpleicons.org/python/3776AB",
    "MQTT": "https://cdn.simpleicons.org/mqtt/660066",
    "FastAPI": "https://cdn.simpleicons.org/fastapi/66999B",
    "SQLAlchemy": "https://cdn.simpleicons.org/sqlalchemy/66999B",
    "Tailwind": "https://cdn.simpleicons.org/tailwindcss/06B6D4",
};

function crearCardHTML(proyecto) {
    const { titulo, descripcion, imagen, categoria, tecnologias, enlaces } = proyecto;

    const tagsHTML = tecnologias
        .map(tech => {
            const iconUrl = techIcons[tech];
            if (iconUrl) {
                return `<img src="${iconUrl}" alt="${tech}" class="project-card__tech-icon" title="${tech}">`;
            }
            return `<span class="project-card__tech">${tech}</span>`;
        })
        .join('');

    const demoBtn = enlaces.demo
        ? `<a href="${enlaces.demo}" class="btn btn--primary" target="_blank" rel="noopener">Ver demo</a>`
        : '';

    const codigoBtn = enlaces.codigo
        ? `<a href="${enlaces.codigo}" class="btn btn--secondary" target="_blank" rel="noopener">Código</a>`
        : '';

    return `
        <article class="project-card" data-categoria="${categoria}">
            <img src="${imagen}" alt="Captura del proyecto ${titulo}" class="project-card__image">
            <div class="project-card__body">
                <span class="project-card__category">${categoria}</span>
                <h3 class="project-card__title">${titulo}</h3>
                <p class="project-card__description">${descripcion}</p>
                <div class="project-card__tags">${tagsHTML}</div>
                <div class="project-card__actions">
                    ${demoBtn}
                    ${codigoBtn}
                </div>
            </div>
        </article>
    `;
}

document.addEventListener('DOMContentLoaded', cargarProyectos);
