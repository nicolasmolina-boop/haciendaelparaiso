/* ==========================================
   HACIENDA EL PARAISO - JAVASCRIPT
   Cada bloque revisa que sus elementos existan:
   el mismo script corre en todas las páginas.
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {

    // NAVEGACION
    var nav = document.getElementById('nav');
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');

    if (nav) {
        window.addEventListener('scroll', function() {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            var abierto = navLinks.classList.toggle('activo');
            menuToggle.classList.toggle('activo', abierto);
            menuToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('activo');
                navLinks.classList.remove('activo');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // CONTADORES ANIMADOS
    var statsSection = document.querySelector('.estadisticas');
    if (statsSection) {
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
        statsObserver.observe(statsSection);
    }

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

    // LIGHTBOX
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxCerrar = document.getElementById('lightboxCerrar');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.galeria-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var img = item.querySelector('img');
                var caption = item.querySelector('.galeria-overlay span');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
                    lightbox.classList.add('activo');
                }
            });
        });

        if (lightboxCerrar) {
            lightboxCerrar.addEventListener('click', function() {
                lightbox.classList.remove('activo');
            });
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) lightbox.classList.remove('activo');
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') lightbox.classList.remove('activo');
        });
    }

    // FORMULARIO -> WHATSAPP
    var contactoForm = document.getElementById('contactoForm');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var nombre = document.getElementById('nombre').value;
            var email = document.getElementById('email').value;
            var asunto = document.getElementById('asunto').value;
            var mensaje = document.getElementById('mensaje').value;

            var texto = encodeURIComponent(
                'Hola Hacienda El Paraíso!\n\n' +
                'Nombre: ' + nombre + '\n' +
                'Email: ' + email + '\n' +
                'Asunto: ' + asunto + '\n' +
                'Mensaje: ' + mensaje
            );

            window.open('https://wa.me/50497655779?text=' + texto, '_blank');
        });
    }

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
