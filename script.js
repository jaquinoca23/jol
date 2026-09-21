/* ============ GALERÍA (12 imágenes) ============ */
(() => {
  const slides  = Array.from(document.querySelectorAll('.slide'));
  const dotsBox = document.getElementById('dots');
  const counter = document.getElementById('counter');
  const carousel = document.getElementById('carousel');
  const total = slides.length; // 12
  let index = 0;
  let timer = null;
  const DELAY = 5000;

  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('aria-label', `Ir a la foto ${i + 1}`);
    d.addEventListener('click', () => { goTo(i); restart(); });
    dotsBox.appendChild(d);
    return d;
  });

  slides.forEach(s => {
    const img = s.querySelector('img');
    img.addEventListener('error', () => s.classList.add('missing'));
  });

  function goTo(i) {
    index = (i + total) % total;
    slides.forEach((s, n) => s.classList.toggle('active', n === index));
    dots.forEach((d, n) => d.classList.toggle('active', n === index));
    counter.textContent = `${index + 1} / ${total}`;
  }

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  function start() { stop(); timer = setInterval(next, DELAY); }
  function stop()  { if (timer) clearInterval(timer); timer = null; }
  function restart() { start(); }

  document.getElementById('next').addEventListener('click', () => { next(); restart(); });
  document.getElementById('prev').addEventListener('click', () => { prev(); restart(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft')  { prev(); restart(); }
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  let startX = 0;
  carousel.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
    stop();
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    start();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  goTo(0);
  start();
})();

/* ============ MÚSICA + PANTALLA DE INICIO ============ */
(() => {
  const audio    = document.getElementById('audio');
  const btn      = document.getElementById('musicBtn');
  const label    = document.getElementById('musicLabel');
  const intro    = document.getElementById('intro');
  const enterBtn = document.getElementById('enterBtn');
  audio.volume = 0.6;

  const setPlaying = (on) => {
    btn.classList.toggle('playing', on);
    btn.setAttribute('aria-pressed', String(on));
    label.textContent = on ? 'Pausar nuestra canción' : '🌻 Reproducir nuestra canción';
  };

  // Botón de la pantalla de inicio: entra a la página principal y suena la canción
  enterBtn.addEventListener('click', () => {
    const playPromise = audio.play(); // dentro del clic para que el navegador lo permita
    if (playPromise) {
      playPromise.then(() => setPlaying(true)).catch(() => setPlaying(false));
    }

    intro.classList.add('leaving');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    setTimeout(() => intro.classList.add('gone'), 1300);
  });

  // Botón de la sección "Nuestra canción": pausar / reanudar
  btn.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch (err) {
        label.textContent = '⚠️ No se encontró musica.mp3';
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  audio.addEventListener('error', () => {
    label.textContent = '⚠️ No se encontró musica.mp3';
    btn.classList.remove('playing');
  });
})();