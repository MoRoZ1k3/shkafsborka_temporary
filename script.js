/* ШкафСборка — интерактив и эффекты.
   Каждый блок — независимый модуль: страница работает даже при ошибке в одном из них. */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Базовая инициализация: шапка, прогресс скролла, «наверх» ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("site-header");
  const progressBar = document.querySelector("[data-scroll-progress]");
  const toTop = document.querySelector("[data-to-top]");

  requestAnimationFrame(() => body.classList.add("loaded"));

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      header?.classList.toggle("is-scrolled", scrollY > 16);

      if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(scrollY / max, 1) : 0;
        progressBar.style.transform = `scaleX(${ratio})`;
      }

      toTop?.classList.toggle("is-visible", scrollY > 620);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

/* ---------- Появление блоков при скролле ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 4% 0px" }
    );
    revealElements.forEach((item) => revealObserver.observe(item));
  } else {
    revealElements.forEach((item) => item.classList.add("is-visible"));
  }
});

/* ---------- Плавный скролл по якорям ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const navCollapse = document.getElementById("mainNav");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const offset = header ? header.offsetHeight + 18 : 96;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });

      if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getInstance(navCollapse)?.hide();
      }
    });
  });
});

/* ---------- Подсветка активного пункта меню (scrollspy) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const links = [...document.querySelectorAll('.navbar-nav .nav-link[href^="#"]')];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const map = new Map();
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) map.set(section, link);
  });
  if (!map.size) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((item) => {
            item.classList.remove("is-active");
            item.removeAttribute("aria-current");
          });
          link.classList.add("is-active");
          link.setAttribute("aria-current", "location");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  map.forEach((_, section) => spy.observe(section));
});

/* ---------- Мобильное меню контактов в шапке ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const contact = document.querySelector("[data-mobile-contact]");
  const trigger = contact?.querySelector(".mobile-contact__trigger");
  const menu = contact?.querySelector(".mobile-contact__menu");
  if (!contact || !trigger || !menu) return;

  const close = () => {
    contact.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  };
  const open = () => {
    contact.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
  };
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    contact.classList.contains("is-open") ? close() : open();
  });
  document.addEventListener("click", (event) => {
    if (!contact.contains(event.target)) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
});

/* ---------- Модалка «проект → результат» ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const pairModal = document.querySelector("[data-project-pair-modal]");
  if (!pairModal) return;

  const pairTitle = pairModal.querySelector("#project-pair-title");
  const projectPanel = pairModal.querySelector("[data-project-panel]");
  const projectImage = pairModal.querySelector("[data-project-pair-image]");
  const resultImage = pairModal.querySelector("[data-result-pair-image]");
  const projectCaption = pairModal.querySelector("[data-project-caption]");
  const resultCaption = pairModal.querySelector("[data-result-caption]");
  let activePairTrigger = null;

  const closeProjectPair = () => {
    if (pairModal.hidden) return;
    pairModal.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    window.setTimeout(() => {
      pairModal.hidden = true;
      projectImage?.removeAttribute("src");
      resultImage?.removeAttribute("src");
      activePairTrigger?.focus();
    }, 180);
  };

  const openProjectPair = (trigger) => {
    if (!resultImage || !resultCaption || !pairTitle) return;
    activePairTrigger = trigger;
    const projectSource = trigger.dataset.projectImage;
    const resultSource = trigger.dataset.resultImage;
    const resultTitle = trigger.dataset.resultTitle || "Готовый результат";
    pairTitle.textContent = resultTitle;
    resultImage.src = resultSource || "";
    resultImage.alt = resultTitle;
    resultCaption.textContent = resultTitle;

    if (projectSource && projectPanel && projectImage && projectCaption) {
      projectPanel.hidden = false;
      projectImage.src = projectSource;
      projectImage.alt = trigger.dataset.projectTitle || "Эскиз проекта";
      projectCaption.textContent = trigger.dataset.projectTitle || "Проект";
    } else if (projectPanel) {
      projectPanel.hidden = true;
    }

    pairModal.hidden = false;
    requestAnimationFrame(() => {
      pairModal.classList.add("is-open");
      document.body.classList.add("lightbox-open");
    });
  };

  document.querySelectorAll(".project-pair-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => openProjectPair(trigger));
  });
  pairModal.querySelectorAll("[data-project-pair-close]").forEach((closer) => {
    closer.addEventListener("click", closeProjectPair);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectPair();
  });
});

/* ---------- Карусель отзывов ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const reviewTrack = document.querySelector("[data-review-track]");
  if (!reviewTrack) return;

  // Реальные отзывы клиентов. Хранятся на странице — карусель работает и без сервера.
  const REVIEWS = [
    { text: "Заказывали шкаф в спальню. Мебель привезли очень быстро, качество на высоте, цена для Москвы очень даже разумная.", tag: "Шкаф в спальню" },
    { text: "Отличная компания. Замерщик приехал в Химки со всеми образцами, на месте всё посчитал. Мебель была готова уже на шестой день. Рекомендую!", tag: "Гардеробная · Химки" },
    { text: "Редко пишу отзывы, но тут ребята удивили. Нужна была тумба под ТВ срочно, сделали за 4 дня. Все стыки ровные, кромка идеальная.", tag: "Тумба под ТВ" },
    { text: "Все супер! Качественная мебель по доступной цене. Порадовало, что за сам расчет проекта денег вообще не взяли.", tag: "Бесплатный расчёт" },
    { text: "Делали детскую кровать на заказ. Срок изготовления порадовал, нам привезли на шестой день. Материалы качественные, запаха нет.", tag: "Кровать в детскую" },
    { text: "Заказывала комод в Люберцы. Очень аккуратная сборка, фурнитура прочная. Буду обращаться еще!", tag: "Комод · Люберцы" },
    { text: "Самая быстрая фабрика в Москве, с которой я сталкивался. За 6 дней собрали отличную прихожую. Цена полностью устроила.", tag: "Прихожая за 6 дней" },
    { text: "Спасибо за честный подход. Расчет стоимости сделали быстро, сумма в процессе работы не выросла. Качество топ.", tag: "Честная цена" },
    { text: "Искали недорогой, но приличный шкаф-купе. Здесь предложили лучшую цену в МО. Фабричное качество, двери ходят бесшумно.", tag: "Шкаф-купе" },
    { text: "Понравился сервис. Мастер сделал замер, показал образцы материалов, всё подсказал. Цвет подобрали идеально под ламинат.", tag: "Замер с образцами" },
    { text: "Качественная мебель, адекватный ценник и реально шустрые ребята. Доставили в Одинцово на пятый день после заказа.", tag: "Доставка · Одинцово" },
    { text: "Отличный шкаф за свои деньги. Сборщики трезвые, вежливые, весь мусор за собой убрали.", tag: "Сборка и чистота" },
    { text: "Заказывал офисный стол. Уложились строго в срок, привезли на четвертый день. Договор на руках, все официально.", tag: "Офисный стол" },
    { text: "Цена и качество на пятерку! Сделали кухонный гарнитур за рекордные 6 дней. Нам всё очень нравится.", tag: "Кухонный гарнитур" },
    { text: "Качество сборки идеальное, ничего не скрипит, двери ходят плавно. На всю продукцию идет официальная гарантия 6 месяцев.", tag: "Гарантия 6 месяцев" },
    { text: "Вызвал замерщика, приехал в тот же день в Королев. Рассчитали проект гардеробной, цена полностью устроила.", tag: "Гардеробная · Королёв" },
    { text: "Надежная компания в Москве. Заказываю тут второй раз, качество проверено. Привозят без опозданий, упаковка плотная.", tag: "Второй заказ" },
    { text: "Спасибо за новую прихожую! Изготовили за 5 дней, привезли в Подольск. Дали гарантию на 6 месяцев, все официально.", tag: "Прихожая · Подольск" },
    { text: "Обращался по поводу шкафа-купе. Сделали за 6 дней, привезли в Мытищи. Качеством доволен, зеркала без дефектов.", tag: "Шкаф-купе · Мытищи" },
    { text: "Заказывали мебель в Домодедово. Замерщик учел все нюансы стен. Изготовили всего за 5 дней! Рекомендую.", tag: "На заказ · Домодедово" },
  ];

  const starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z" fill="currentColor"/></svg>';

  const renderReviews = () => {
    const fragment = document.createDocumentFragment();
    REVIEWS.forEach((review) => {
      const card = document.createElement("article");
      card.className = "review-card";

      const quote = document.createElement("span");
      quote.className = "review-card__quote";
      quote.setAttribute("aria-hidden", "true");
      quote.textContent = "“";

      const stars = document.createElement("span");
      stars.className = "review-card__stars";
      stars.setAttribute("aria-label", "Оценка: 5 из 5");
      stars.innerHTML = starSvg.repeat(5);

      const text = document.createElement("p");
      text.textContent = review.text;

      const footer = document.createElement("footer");
      const label = document.createElement("span");
      label.textContent = "Отзыв клиента";
      const marker = document.createElement("span");
      marker.textContent = review.tag;
      footer.append(label, marker);

      card.append(quote, stars, text, footer);
      fragment.append(card);
    });
    reviewTrack.innerHTML = "";
    reviewTrack.append(fragment);
  };
  renderReviews();

  const previous = document.querySelector("[data-review-prev]");
  const next = document.querySelector("[data-review-next]");

  const scrollReviews = (direction) => {
    const card = reviewTrack.querySelector(".review-card");
    const gap = Number.parseFloat(getComputedStyle(reviewTrack).gap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : reviewTrack.clientWidth * 0.9;
    const cardsPerStep = window.matchMedia("(min-width: 992px)").matches ? 3 : 2;
    reviewTrack.scrollBy({ left: direction * step * cardsPerStep, behavior: "smooth" });
  };
  previous?.addEventListener("click", () => scrollReviews(-1));
  next?.addEventListener("click", () => scrollReviews(1));

  reviewTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); scrollReviews(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); scrollReviews(1); }
  });

  // Перетаскивание мышью / пальцем.
  let dragStartX = 0;
  let dragStartScroll = 0;
  let isDraggingReviews = false;
  reviewTrack.addEventListener("pointerdown", (event) => {
    dragStartX = event.clientX;
    dragStartScroll = reviewTrack.scrollLeft;
    isDraggingReviews = true;
    reviewTrack.classList.add("is-dragging");
    reviewTrack.setPointerCapture(event.pointerId);
  });
  reviewTrack.addEventListener("pointermove", (event) => {
    if (!isDraggingReviews) return;
    reviewTrack.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });
  const finishReviewDrag = (event) => {
    if (!isDraggingReviews) return;
    isDraggingReviews = false;
    reviewTrack.classList.remove("is-dragging");
    if (reviewTrack.hasPointerCapture(event.pointerId)) reviewTrack.releasePointerCapture(event.pointerId);
  };
  reviewTrack.addEventListener("pointerup", finishReviewDrag);
  reviewTrack.addEventListener("pointercancel", finishReviewDrag);
});

/* ---------- Анимированные счётчики в тёмной полосе ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const setFinalValue = (node) => {
    node.textContent = node.dataset.counter;
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach(setFinalValue);
    return;
  }

  const animateCounter = (node) => {
    const target = Number.parseInt(node.dataset.counter, 10) || 0;
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((node) => counterObserver.observe(node));
});

/* ---------- Наклон карточек за курсором (tilt) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (prefersReducedMotion || !finePointer) return;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const maxTilt = 5;
    card.addEventListener("pointerenter", () => {
      card.style.transition = "transform .12s ease-out";
    });
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(720px) rotateX(${(-relY * maxTilt).toFixed(2)}deg) rotateY(${(relX * maxTilt).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transition = "";
      card.style.transform = "";
    });
  });
});

/* ---------- Параллакс в hero: фон при скролле, карточки за курсором ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (prefersReducedMotion) return;
  const hero = document.querySelector(".hero");
  const heroBg = document.querySelector("[data-hero-parallax]");
  if (!hero) return;

  // Фон мягко уезжает вниз при прокрутке.
  if (heroBg) {
    let bgTicking = false;
    const parallaxOnScroll = () => {
      if (bgTicking) return;
      bgTicking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const shift = Math.min(window.scrollY * 0.16, 120);
          heroBg.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
        }
        bgTicking = false;
      });
    };
    window.addEventListener("scroll", parallaxOnScroll, { passive: true });
  }

  // Плавающие карточки реагируют на курсор.
  if (!finePointer) return;
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty("--mx", relX.toFixed(3));
    hero.style.setProperty("--my", relY.toFixed(3));
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--mx", "0");
    hero.style.setProperty("--my", "0");
  });
});

/* ---------- FAQ: одновременно открыт один вопрос ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
});

/* ---------- Плавающая кнопка быстрой связи ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.querySelector("[data-fab]");
  if (!fab) return;
  const trigger = fab.querySelector(".fab__main");
  const menu = fab.querySelector(".fab__menu");
  if (!trigger || !menu) return;

  const setState = (isOpen) => {
    fab.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
  };
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setState(!fab.classList.contains("is-open"));
  });
  document.addEventListener("click", (event) => {
    if (!fab.contains(event.target)) setState(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setState(false);
  });
});
