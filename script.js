/* ==========================================
   HACIENDA EL PARAISO - JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {

    // NAVEGACION
    var nav = document.getElementById('nav');
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', function() {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('activo');
        navLinks.classList.toggle('activo');
    });

    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('activo');
            navLinks.classList.remove('activo');
        });
    });

    // CONTADORES ANIMADOS
    var statsAnimated = false;
    var statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                document.querySelectorAll('.stat-numero').forEach(function(el) {
                    var target = parseInt(el.getAttribute('data-target'));
                    var current = 0;
                    var increment = target / 60;
                    var timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, 33);
                });
            }
        });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.estadisticas');
    if (statsSection) statsObserver.observe(statsSection);

    // ANIMACIONES AL SCROLL
    var scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
        scrollObserver.observe(el);
    });

    // CARRUSEL TESTIMONIOS
    var slides = document.querySelectorAll('.testimonio-slide');
    var dotsContainer = document.getElementById('testimoniosDots');
    var currentSlide = 0;

    slides.forEach(function(_, i) {
        var dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('activo');
        dot.addEventListener('click', function() { goToSlide(i); });
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('activo');
        dotsContainer.children[currentSlide].classList.remove('activo');
        currentSlide = index;
        slides[currentSlide].classList.add('activo');
        dotsContainer.children[currentSlide].classList.add('activo');
    }

    setInterval(function() {
        goToSlide((currentSlide + 1) % slides.length);
    }, 5000);

    // LIGHTBOX
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');

    document.querySelectorAll('.galeria-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var img = item.querySelector('img');
            var caption = item.querySelector('.galeria-overlay span');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.textContent = caption ? caption.textContent : '';
                lightbox.classList.add('activo');
            }
        });
    });

    document.getElementById('lightboxCerrar').addEventListener('click', function() {
        lightbox.classList.remove('activo');
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) lightbox.classList.remove('activo');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') lightbox.classList.remove('activo');
    });

    // FORMULARIO -> WHATSAPP
    document.getElementById('contactoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var nombre = document.getElementById('nombre').value;
        var email = document.getElementById('email').value;
        var asunto = document.getElementById('asunto').value;
        var mensaje = document.getElementById('mensaje').value;

        var texto = encodeURIComponent(
            'Hola Hacienda El Paraiso!\n\n' +
            'Nombre: ' + nombre + '\n' +
            'Email: ' + email + '\n' +
            'Asunto: ' + asunto + '\n' +
            'Mensaje: ' + mensaje
        );

        window.open('https://wa.me/50497655779?text=' + texto, '_blank');
    });

    // MULTI-IDIOMA
    var currentLang = 'es';
    document.querySelectorAll('.btn-idioma').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var lang = btn.getAttribute('data-lang');
            if (lang === currentLang) return;
            currentLang = lang;

            document.querySelectorAll('.btn-idioma').forEach(function(b) {
                b.classList.remove('activo');
            });
            btn.classList.add('activo');

            document.querySelectorAll('[data-' + lang + ']').forEach(function(el) {
                var texto = el.getAttribute('data-' + lang);
                if (texto) el.textContent = texto;
            });
        });
    });

    // SMOOTH SCROLL
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
