/* ---- luces aleatorias ---- */

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function easeInOut(t) {
    return 0.5 - Math.cos(t * Math.PI) / 2;
}

const lights = [...document.querySelectorAll('.light')].map(el => ({
    el,
    x: rand(20, 80),
    y: rand(20, 80),
    scale: rand(0.8, 1.2),
    sx: 0,
    sy: 0,
    tx: 0,
    ty: 0,
    sScale: 1,
    tScale: 1,
    dur: 3000,
    start: 0
}));

function pickTarget(light, now) {
    light.sx = light.x;
    light.sy = light.y;
    light.sScale = light.scale;
    if (Math.random() < 0.3) {
        light.tx = rand(25, 75);
        light.ty = rand(25, 75);
    } else {
        const cx = Math.random() < 0.5 ? -15 : 115;
        const cy = Math.random() < 0.5 ? -15 : 115;
        light.tx = cx + rand(-25, 25);
        light.ty = cy + rand(-25, 25);
    }
    light.tScale = rand(0.8, 1.4);
    light.dur = rand(2800, 5200);
    light.start = now;
}

function moveLights(now) {
    lights.forEach(light => {
        if (now >= light.start + light.dur) pickTarget(light, now);
        const t = Math.min((now - light.start) / light.dur, 1);
        const e = easeInOut(t);
        light.x = light.sx + (light.tx - light.sx) * e;
        light.y = light.sy + (light.ty - light.sy) * e;
        light.scale = light.sScale + (light.tScale - light.sScale) * e;
        light.el.style.transform =
            `translate(${light.x}vw, ${light.y}vh) translate(-50%, -50%) scale(${light.scale})`;
    });
    requestAnimationFrame(moveLights);
}

lights.forEach(light => pickTarget(light, performance.now()));
requestAnimationFrame(moveLights);

/* ---- hamburger ---- */

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
});

document.getElementById('navClose').addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
});

document.querySelectorAll('.header__nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
    });
});

/* ---- boton conocer mas -> scroll a nosotros ---- */

document.querySelector('.btn--primary').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('nosotros').scrollIntoView({ behavior: 'smooth' });
});

/* ---- whatsapp ---- */

document.querySelectorAll('.contacto__wa').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const nombre = document.getElementById('contactoNombre').value.trim();
        const mensaje = document.getElementById('contactoMensaje').value.trim();
        const destino = btn.dataset.nombre;
        const texto = `Hola ${destino}, soy ${nombre}.\n${mensaje}`;
        window.open(`https://wa.me/${btn.dataset.numero}?text=${encodeURIComponent(texto)}`, '_blank');
        document.getElementById('contactoNombre').value = '';
        document.getElementById('contactoMensaje').value = '';
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelectorAll('.header__nav a').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ---- loader ---- */

function preloadImages(urls) {
    return Promise.all(urls.map(url => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
        });
    }));
}

preloadImages([
    'assets/imagenes/header/fondo1.webp',
    'assets/imagenes/header/fondo2.webp',
    'assets/imagenes/header/fondo3.webp',
    'assets/imagenes/header/fondo4.webp'
]).then(() => {
    document.getElementById('loader').classList.add('hidden');
    startSlideshow();
});

/* ---- slideshow ---- */

let slideshowInterval;

function startSlideshow() {
    const slides = document.querySelectorAll('.header__slide');
    let current = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    slideshowInterval = setInterval(nextSlide, 3500);
}



// ------------------- lightbox ----------------------

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxImages = [...document.querySelectorAll('.swiper-slide img')];
let lightboxIndex = 0;

function showLightboxImage() {
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxImg.alt = lightboxImages[lightboxIndex].alt;
    lightboxImages.forEach((img, i) => {
        if (i === (lightboxIndex + 1) % lightboxImages.length || i === (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length) {
            const pre = new Image();
            pre.src = img.src;
        }
    });
}

function openLightbox(index) {
    lightboxIndex = index;
    showLightboxImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
}

function stepLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    showLightboxImage();
}

lightboxImages.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openLightbox(i));
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => stepLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click', () => stepLightbox(1));

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
});



/* ============================= */
/* GALERÍA DE FOTOS - JS         */
/* Vanilla JS, sin dependencias  */
/* ============================= */

(function () {
    'use strict';

    var galItems = Array.prototype.slice.call(document.querySelectorAll('.gal__item'));
    var galLightbox = document.getElementById('gal_lightbox');
    var galLightboxImg = document.getElementById('gal_lightbox_img');
    var galLightboxCounter = document.getElementById('gal_lightbox_counter');
    var galBtnClose = document.getElementById('gal_btn_close');
    var galBtnPrev = document.getElementById('gal_btn_prev');
    var galBtnNext = document.getElementById('gal_btn_next');
    var galOverlay = document.getElementById('gal_lightbox_overlay');

    var galImages = galItems.map(function (item) {
        var img = item.querySelector('.gal__img');
        return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
    });

    var galCurrentIndex = 0;
    var galTouchStartX = 0;
    var galTouchEndX = 0;
    var GAL_SWIPE_THRESHOLD = 50; // px mínimos para considerar swipe

    function galOpenLightbox(index) {
        galCurrentIndex = index;
        galUpdateLightboxImage();
        galLightbox.classList.add('gal__lightbox--open');
        galLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        galBtnClose.focus();
    }

    function galCloseLightbox() {
        galLightbox.classList.remove('gal__lightbox--open');
        galLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function galShowPrev() {
        galCurrentIndex = (galCurrentIndex - 1 + galImages.length) % galImages.length;
        galUpdateLightboxImage();
    }

    function galShowNext() {
        galCurrentIndex = (galCurrentIndex + 1) % galImages.length;
        galUpdateLightboxImage();
    }

    function galUpdateLightboxImage() {
        var current = galImages[galCurrentIndex];
        galLightboxImg.setAttribute('src', current.src);
        galLightboxImg.setAttribute('alt', current.alt);
        galLightboxCounter.textContent = (galCurrentIndex + 1) + ' / ' + galImages.length;
    }

    // Abrir lightbox al hacer click en cada item
    galItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            galOpenLightbox(index);
        });
    });

    // Botones de control
    galBtnClose.addEventListener('click', galCloseLightbox);
    galBtnPrev.addEventListener('click', galShowPrev);
    galBtnNext.addEventListener('click', galShowNext);
    galOverlay.addEventListener('click', galCloseLightbox);

    // Navegación con teclado
    document.addEventListener('keydown', function (e) {
        if (!galLightbox.classList.contains('gal__lightbox--open')) return;

        switch (e.key) {
            case 'Escape':
                galCloseLightbox();
                break;
            case 'ArrowLeft':
                galShowPrev();
                break;
            case 'ArrowRight':
                galShowNext();
                break;
        }
    });

    // Soporte táctil (swipe) para móviles
    var galLightboxContent = document.querySelector('.gal__lightbox-content');

    galLightboxContent.addEventListener('touchstart', function (e) {
        galTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galLightboxContent.addEventListener('touchend', function (e) {
        galTouchEndX = e.changedTouches[0].screenX;
        galHandleSwipe();
    }, { passive: true });

    function galHandleSwipe() {
        var diff = galTouchEndX - galTouchStartX;

        if (Math.abs(diff) < GAL_SWIPE_THRESHOLD) return; // movimiento insuficiente

        if (diff > 0) {
            // Swipe hacia la derecha -> foto anterior
            galShowPrev();
        } else {
            // Swipe hacia la izquierda -> foto siguiente
            galShowNext();
        }
    }

})();





// ------------------- fotos ----------------------

var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 0,
        stretch: 4,
        depth: 3,
        modifier: 50,
        slideShadows: true,
    },
    pagination: {
        el: ".swiper-pagination",
    },
    autoplay: {
        delay: 2000, // Time between slides in milliseconds (e.g., 3 seconds)
        disableOnInteraction: false, // Set to true to stop autoplay on user interaction (e.g., dragging)
    },
    loop: true, // Enable infinite loop
});