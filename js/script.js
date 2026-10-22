document.addEventListener('DOMContentLoaded', () => {
  // Анимация появления блоков при прокрутке страницы
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    }), { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  // Событие мыши: световое пятно перемещается вслед за курсором
  document.addEventListener('mousemove', e => {
    document.documentElement.style.setProperty('--glow-x', `${e.clientX - 170}px`);
    document.documentElement.style.setProperty('--glow-y', `${e.clientY - 170}px`);
  });

  // События мыши и фокуса: карточки подсвечиваются
  document.querySelectorAll('.feature, .price').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('selected'));
    card.addEventListener('mouseleave', () => card.classList.remove('selected'));
    card.addEventListener('focus', () => card.classList.add('selected'));
    card.addEventListener('blur', () => card.classList.remove('selected'));
  });

  // Мобильное меню
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (menuButton && nav) menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '×' : '☰';
  });

  // Клавиатура: стрелки переключают тарифы, а на остальных страницах запускают эффект
  const cards = [...document.querySelectorAll('[data-price]')];
  let current = -1;
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === '?') {
      const hint = document.querySelector('.hint');
      if (hint) { hint.classList.remove('flash'); void hint.offsetWidth; hint.classList.add('flash'); }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (cards.length) {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        current = (current + dir + cards.length) % cards.length;
        cards.forEach(card => card.classList.remove('selected'));
        cards[current].classList.add('selected'); cards[current].focus({preventScroll:true});
        cards[current].scrollIntoView({behavior:'smooth', block:'nearest'});
      } else {
        document.body.classList.remove('flash'); void document.body.offsetWidth; document.body.classList.add('flash');
      }
    }
    if (e.key === 'Enter' && e.target.classList.contains('feature')) {
      e.target.classList.remove('flash'); void e.target.offsetWidth; e.target.classList.add('flash');
    }
  });

  // Если выбран тариф на странице тарифов, подставляем его в форму контактов
  const plan = document.querySelector('#plan');
  const queryPlan = (new URLSearchParams(location.search).get('plan') || '').toUpperCase();
  if (plan && ['START', 'RACE', 'PRO'].includes(queryPlan)) plan.value = queryPlan;

  // Демонстрационная проверка формы: реальные данные никуда не отправляются
  const form = document.querySelector('#booking-form');
  const result = document.querySelector('#form-result');
  if (form && result) form.addEventListener('submit', e => {
    e.preventDefault(); result.className = '';
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const chosen = form.elements.plan.value;
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !chosen) {
      result.textContent = 'Проверь поля: укажи имя, корректный email и выбери тариф.';
      result.classList.add('error', 'show'); return;
    }
    result.textContent = `Готово, ${name}! Демонстрационная заявка на тариф ${chosen} проверена. Данные никуда не отправлены.`;
    result.classList.add('show');
  });
});
