(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Oggi: il lunedì la trattoria è chiusa */
  const oggi = document.getElementById('oggi');
  if (oggi) {
    oggi.textContent = new Date().getDay() === 1
      ? 'Oggi è lunedì e riposiamo. Vi aspettiamo domani, a pranzo e a cena.'
      : 'Oggi siamo aperti, a pranzo e a cena.';
  }

  /* Entrate scaglionate */
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    let batch = 0, timer;
    const io = new IntersectionObserver((entries) => {
      entries.filter(e => e.isIntersecting).forEach((e) => {
        e.target.style.setProperty('--d', (batch++ * 80) + 'ms');
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
      clearTimeout(timer);
      timer = setTimeout(() => { batch = 0; }, 120);
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    rv.forEach(el => io.observe(el));
  } else {
    rv.forEach(el => el.classList.add('in'));
  }

  /* Menù: dal mare / dalla montagna, e la foto accanto cambia */
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = { mare: document.getElementById('p-mare'), montagna: document.getElementById('p-montagna') };
  const foto = [...document.querySelectorAll('.mf')];
  const setTab = (name) => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === name)));
    Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== name; });
    foto.forEach(f => f.classList.toggle('on', f.dataset.key === name));
  };
  panels.montagna.hidden = true;
  tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
  tabs.forEach((t, i) => t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const n = tabs[(i + 1) % tabs.length];
      n.focus(); setTab(n.dataset.tab);
    }
  }));
})();
