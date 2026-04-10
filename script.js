/* ==========================================
   HACIENDA EL PARAISO - JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // NAVEGACION - Scroll y menu hamburguesa
    // ==========================================
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('activo');
        navLinks.classList.toggle('activo');
    });

    // Cerrar menu al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('activo');
            navLinks.classList.remove('activo');
        });
    });

    // ==========================================
    // CONTADORES ANIMADOS
    // ==========================================
    function animarContadores() {
        var contadores = document.querySelectorAll('.stat-numero');
        contadores.forEach(function(contador) {
            var target = parseInt(contador.getAttribute('data-target'));
            var current = 0;
            var increment = target / 60;
            var duration = 2000;
            var stepTime = duration / 60;

            function updateCounter() {
                current += increment;
                if (current < target) {
                    contador.textContent = Math.floor(current);
                    setTimeout(updateCounter, stepTime);
                } else {
                    contador.textContent = target;
                }
            }

            updateCounter();
        });
    }

    // Observer para contadores
    var statsSection = document.querySelector('.estadisticas');
    var statsAnimated = false;

    var statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animarContadores();
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // ANIMACIONES AL SCROLL
    // ==========================================
    var animatedElements = document.querySelectorAll('.animate-on-scroll');

    var scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(function(el) {
        scrollObserver.observe(el);
    });

    // ==========================================
    // CARRUSEL DE TESTIMONIOS
    // ==========================================
    var slides = document.querySelectorAll('.testimonio-slide');
    var dotsContainer = document.getElementById('testimoniosDots');
    var currentSlide = 0;

    // Crear dots
    slides.forEach(function(_, index) {
        var dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('activo');
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('activo');
        dotsContainer.children[currentSlide].classList.remove('activo');
        currentSlide = index;
        slides[currentSlide].classList.add('activo');
        dotsContainer.children[currentSlide].classList.add('activo');
    }

    // Auto-rotacion cada 5 segundos
    setInterval(function() {
        var next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, 5000);

    // ==========================================
    // LIGHTBOX (GALERIA)
    // ==========================================
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxCerrar = document.getElementById('lightboxCerrar');
    var galeriaItems = document.querySelectorAll('.galeria-item');

    galeriaItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var caption = item.getAttribute('data-caption');
            lightboxCaption.textContent = caption || '';
            lightbox.classList.add('activo');
        });
    });

    lightboxCerrar.addEventListener('click', function() {
        lightbox.classList.remove('activo');
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('activo');
        }
    });

    // ==========================================
    // FORMULARIO DE CONTACTO -> WHATSAPP
    // ==========================================
    var contactoForm = document.getElementById('contactoForm');

    contactoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var nombre = document.getElementById('nombre').value;
        var email = document.getElementById('email').value;
        var asunto = document.getElementById('asunto').value;
        var mensaje = document.getElementById('mensaje').value;

        var texto = 'Hola Hacienda El Paraiso!%0A%0A' +
            'Nombre: ' + nombre + '%0A' +
            'Email: ' + email + '%0A' +
            'Asunto: ' + asunto + '%0A' +
            'Mensaje: ' + mensaje;

        window.open('https://wa.me/50497655779?text=' + texto, '_blank');
    });

    // ==========================================
    // MULTI-IDIOMA
    // ==========================================
    var currentLang = 'es';
    var botonesIdioma = document.querySelectorAll('.btn-idioma');

    botonesIdioma.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var lang = btn.getAttribute('data-lang');
            if (lang === currentLang) return;

            currentLang = lang;

            // Actualizar botones
            botonesIdioma.forEach(function(b) { b.classList.remove('activo'); });
            btn.classList.add('activo');

            // Cambiar textos
            var elements = document.querySelectorAll('[data-' + lang + ']');
            elements.forEach(function(el) {
                var texto = el.getAttribute('data-' + lang);
                if (texto) {
                    el.textContent = texto;
                }
            });
        });
    });

    // ==========================================
    // SMOOTH SCROLL para links internos
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
