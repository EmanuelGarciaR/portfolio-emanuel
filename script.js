const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(item => {
            item.classList.remove('nav__link--active');
        });
        this.classList.add('nav__link--active');
    });
});

const PROJECTS_GRID_SELECTOR = '#projects-grid';
const PROJECTS_JSON_PATH = './proyectos.json';
const TIMELINE_LIST_SELECTOR = '#timeline-list';
const TIMELINE_JSON_PATH = './trayectoria.json';

async function cargarProyectos() {
    const grid = document.querySelector(PROJECTS_GRID_SELECTOR);

    if (!grid) {
        return;
    }

    try {
        const respuesta = await fetch(PROJECTS_JSON_PATH);

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

async function cargarTrayectoria() {
    const lista = document.querySelector(TIMELINE_LIST_SELECTOR);

    if (!lista) {
        return;
    }

    try {
        const respuesta = await fetch(TIMELINE_JSON_PATH);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const trayectoria = await respuesta.json();
        const trayectoriaOrdenada = [...trayectoria].sort((a, b) => obtenerValorFecha(b.fecha) - obtenerValorFecha(a.fecha));

        renderizarTrayectoria(trayectoriaOrdenada, lista);
    } catch (error) {
        console.error('No se pudo cargar la trayectoria:', error);
        lista.innerHTML = '<li class="timeline__error">No se pudo cargar la trayectoria. Intenta más tarde.</li>';
    }
}

function renderizarTrayectoria(trayectoria, contenedor) {
    contenedor.innerHTML = trayectoria.map(crearTimelineItemHTML).join('');
}

function crearTimelineItemHTML(experiencia) {
    const { titulo, descripcion, logros, fecha } = experiencia;

    const logrosHTML = Array.isArray(logros)
        ? logros.map(logro => `<li class="timeline__achievement">${logro}</li>`).join('')
        : '';

    return `
        <li class="timeline__item">
            <span class="timeline__marker" aria-hidden="true"></span>
            <article class="timeline__card">
                <p class="timeline__date">${fecha}</p>
                <h3 class="timeline__title">${titulo}</h3>
                <p class="timeline__description">${descripcion}</p>
                <ul class="timeline__achievements">
                    ${logrosHTML}
                </ul>
            </article>
        </li>
    `;
}

function obtenerValorFecha(fecha) {
    if (typeof fecha !== 'string') {
        return 0;
    }

    const numeros = fecha.match(/\d+/g)?.map(Number) ?? [];

    if (numeros.length === 0) {
        return 0;
    }

    if (numeros.length >= 2 && numeros[0] >= 1000 && numeros[1] >= 1000) {
        return new Date(numeros[numeros.length - 1], 11, 31).getTime();
    }

    if (numeros[0] >= 1000) {
        const [anio, mes = 1, dia = 1] = numeros;
        return new Date(anio, mes - 1, dia).getTime();
    }

    return 0;
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

document.addEventListener('DOMContentLoaded', () => {
    cargarProyectos();
    cargarTrayectoria();
});
