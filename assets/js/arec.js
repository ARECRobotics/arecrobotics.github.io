/* AREC site behaviour.
 *
 * The Flare template does not ship a tools menu, so we build one here and
 * keep a single copy of the links for every page. The menu is assembled in
 * JavaScript with inline styles rather than by adding class names to the
 * stylesheet, so the Flare CSS stays exactly as it ships.
 */

(function () {
    'use strict';

    var TOOLS = [
        { label: 'Auth server', href: 'https://auth.albt.qzz.io', note: 'auth.albt.qzz.io' },
        { label: 'Email', href: 'https://mail.arecrobotics.com', note: 'mail.arecrobotics.com' },
        { label: 'Finances', href: 'https://hcb.hackclub.com/arec', note: 'hcb.hackclub.com/arec' },
        { label: 'Team management system', href: 'https://tms.arecrobotics.com/', note: 'tms.arecrobotics.com' }
    ];

    var header = document.querySelector('.s-header__content');
    var nav = document.querySelector('.s-header__nav');

    if (!header || !nav) {
        return;
    }

    /* ---------------------------------------------------------- button ---- */

    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'arecToolsToggle';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'arecTools');
    button.setAttribute('aria-label', 'Tools');
    button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
        'fill="currentColor" aria-hidden="true">' +
        '<rect x="2" y="3" width="8" height="8" rx="1"/>' +
        '<rect x="14" y="3" width="8" height="8" rx="1"/>' +
        '<rect x="2" y="13" width="8" height="8" rx="1"/>' +
        '<rect x="14" y="13" width="8" height="8" rx="1"/>' +
        '</svg>';
    button.style.cssText =
        'position:absolute;right:4.4rem;top:50%;transform:translateY(-50%);' +
        'width:3.4rem;height:3.4rem;padding:0;line-height:0;background:transparent;' +
        'border:0;cursor:pointer;color:#ffffff;';

    /* ----------------------------------------------------------- panel ---- */

    var panel = document.createElement('ul');
    panel.id = 'arecTools';
    panel.setAttribute('aria-labelledby', 'arecToolsToggle');
    panel.style.cssText =
        'position:absolute;right:2.2rem;top:calc(50% + 3rem);min-width:17rem;margin:0;padding:0.5rem 0;' +
        'list-style:none;background:#161719;border:1px solid #2b2e32;display:none;z-index:120;';

    TOOLS.forEach(function (tool) {
        var item = document.createElement('li');
        item.innerHTML =
            '<a href="' + tool.href + '" target="_blank" rel="noopener noreferrer" ' +
            'style="display:block;padding:0.9rem 1.6rem;color:#ffffff;font-size:1.4rem;line-height:1.4;">' +
            tool.label +
            '<span style="display:block;font-size:1.1rem;color:#898f97;letter-spacing:0.02em;">' +
            tool.note +
            '</span></a>';
        panel.appendChild(item);
    });

    header.appendChild(button);
    header.appendChild(panel);

    function setOpen(open) {
        panel.style.display = open ? 'block' : 'none';
        button.setAttribute('aria-expanded', String(open));
    }

    button.addEventListener('click', function (event) {
        event.stopPropagation();
        setOpen(panel.style.display === 'none');
    });

    document.addEventListener('click', function (event) {
        if (!panel.contains(event.target) && event.target !== button) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && panel.style.display !== 'none') {
            setOpen(false);
            button.focus();
        }
    });

    /* ------------------------------------------------- small screens ---- */

    var mobileList = null;

    function mobileNavItems() {
        var list = document.createElement('li');
        list.style.cssText = 'display:block;';

        var heading = document.createElement('span');
        heading.textContent = 'Tools';
        heading.style.cssText =
            'display:block;padding:1.6rem 0 0.4rem;font-family:var(--font-2, sans-serif);' +
            'font-size:1rem;font-weight:500;letter-spacing:.4em;text-transform:uppercase;color:#565c64;';
        list.appendChild(heading);

        TOOLS.forEach(function (tool) {
            var sub = document.createElement('li');
            sub.innerHTML =
                '<a href="' + tool.href + '" target="_blank" rel="noopener noreferrer">' +
                tool.label +
                '</a>';
            list.appendChild(sub);
        });

        return list;
    }

    function layout() {
        var small = window.matchMedia('(max-width: 900px)').matches;

        button.style.display = small ? 'none' : 'block';
        if (small && !panel.style.display) {
            setOpen(false);
        }

        if (small && !mobileList) {
            mobileList = mobileNavItems();
            nav.appendChild(mobileList);
        } else if (!small && mobileList) {
            nav.removeChild(mobileList);
            mobileList = null;
        }
    }

    window.addEventListener('resize', layout);
    layout();
})();
