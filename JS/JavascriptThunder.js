document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.primary-nav');
    const themeToggle = document.querySelector('.theme-toggle');
    const progressBar = document.querySelector('.reading-progress span');
    const heroImage = document.querySelector('.hero-media img');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function closeMenu() {
        if (!menuToggle || !navigation) return;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        navigation.classList.remove('is-open');
    }

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function () {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
            navigation.classList.toggle('is-open', !isOpen);
        });
        navigation.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMenu();
        });
    }

    if (themeToggle) {
        try {
            if (localStorage.getItem('portfolio-theme') === 'light') body.dataset.theme = 'light';
        } catch (error) {
            body.dataset.theme = '';
        }
        updateThemeControl();
        themeToggle.addEventListener('click', function () {
            const useLightTheme = body.dataset.theme !== 'light';
            body.dataset.theme = useLightTheme ? 'light' : '';
            try {
                localStorage.setItem('portfolio-theme', useLightTheme ? 'light' : 'dark');
            } catch (error) {
                // Theme still changes for this page view when storage is unavailable.
            }
            updateThemeControl();
        });
    }

    function updateThemeControl() {
        if (!themeToggle) return;
        const isLight = body.dataset.theme === 'light';
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        themeToggle.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
        const icon = themeToggle.querySelector('span');
        if (icon) icon.textContent = isLight ? '◑' : '◐';
    }

    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');
    const emptyMessage = document.querySelector('.filter-empty');
    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const category = button.dataset.filter;
            let visibleCount = 0;
            filterButtons.forEach(function (filterButton) {
                const isActive = filterButton === button;
                filterButton.classList.toggle('is-active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });
            projectCards.forEach(function (card) {
                const isVisible = category === 'all' || card.dataset.category.split(' ').includes(category);
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });
            if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
        });
    });

    const revealItems = document.querySelectorAll('.intro-copy, .section-heading, .learning-content, .journal-row');
    if ('IntersectionObserver' in window && !reduceMotion) {
        body.classList.add('reveal-ready');
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(function (item) {
            item.classList.add('reveal');
            revealObserver.observe(item);
        });
    }

    let scrollQueued = false;
    function updateScrollEffects() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progressBar) progressBar.style.transform = 'scaleX(' + progress + ')';
        if (heroImage && !reduceMotion) {
            heroImage.style.setProperty('--image-shift', Math.min(window.scrollY * 0.08, 72) + 'px');
        }
        scrollQueued = false;
    }
    window.addEventListener('scroll', function () {
        if (!scrollQueued) {
            window.requestAnimationFrame(updateScrollEffects);
            scrollQueued = true;
        }
    }, { passive: true });
    updateScrollEffects();

    const video = document.querySelector('#demo-video');
    const playButton = document.querySelector('[data-video-play]');
    const speedSelect = document.querySelector('[data-video-speed]');
    const fullscreenButton = document.querySelector('[data-video-fullscreen]');
    if (video && playButton) {
        playButton.addEventListener('click', function () {
            if (video.paused) video.play();
            else video.pause();
        });
        video.addEventListener('play', function () {
            playButton.setAttribute('aria-label', 'Pause video');
            playButton.querySelector('span').textContent = 'Pause';
        });
        video.addEventListener('pause', function () {
            playButton.setAttribute('aria-label', 'Play video');
            playButton.querySelector('span').textContent = 'Play';
        });
    }
    if (video && speedSelect) {
        speedSelect.addEventListener('change', function () {
            video.playbackRate = Number(speedSelect.value);
        });
    }
    if (video && fullscreenButton) {
        fullscreenButton.addEventListener('click', function () {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (video.requestFullscreen) video.requestFullscreen();
        });
    }
});




