/* AREC site behaviour.
 *
 * No dependencies. Everything here is progressive: with JavaScript off the
 * pages still read and navigate, they just lose the sticky header state and
 * the reveal animation.
 */

(function () {
    'use strict';

    var header = document.querySelector('.site-header');
    var menuToggle = document.querySelector('.menu-toggle');
    var mobileNav = document.getElementById('mobile-nav');
    var toolsToggle = document.querySelector('.tools__toggle');
    var toolsMenu = document.getElementById('tools-menu');

    /* ------------------------------------------------------ sticky header ---- */

    var ticking = false;

    function onScroll() {
        if (!header || ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            header.classList.toggle('is-scrolled', window.scrollY > 12);
            ticking = false;
        });
    }

    if (header) {
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* --------------------------------------------------------- mobile nav ---- */

    function setMenu(open) {
        if (!menuToggle || !mobileNav) return;
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        mobileNav.hidden = !open;
        document.body.classList.toggle('nav-open', open);
    }

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            setMenu(mobileNav.hidden);
        });

        mobileNav.addEventListener('click', function (event) {
            if (event.target.closest('a')) setMenu(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 900 && !mobileNav.hidden) setMenu(false);
        });
    }

    /* ------------------------------------------------------------- tools ---- */

    function setTools(open) {
        if (!toolsToggle || !toolsMenu) return;
        toolsToggle.setAttribute('aria-expanded', String(open));
        toolsMenu.hidden = !open;
    }

    if (toolsToggle && toolsMenu) {
        toolsToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            setTools(toolsMenu.hidden);
        });

        document.addEventListener('click', function (event) {
            if (toolsMenu.hidden) return;
            if (!toolsMenu.contains(event.target) && !toolsToggle.contains(event.target)) {
                setTools(false);
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;

            if (!toolsMenu.hidden) {
                setTools(false);
                toolsToggle.focus();
            }

            if (mobileNav && !mobileNav.hidden) {
                setMenu(false);
                menuToggle.focus();
            }
        });
    }

    /* ----------------------------------------------------------- reveals ---- */

    var items = document.querySelectorAll('[data-reveal]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
})();

/* Stagger a group of reveal items without writing delays into the markup. */
(function () {
    'use strict';

    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
        group.querySelectorAll('[data-reveal]').forEach(function (item, index) {
            item.style.setProperty('--reveal-delay', Math.min(index, 7) * 60 + 'ms');
        });
    });
})();

/* Keep the copyright year honest. */
(function () {
    'use strict';

    var now = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = now;
    });
})();
