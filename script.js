document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("site-header");
  const navCollapse = document.getElementById("mainNav");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxText = document.getElementById("lightbox-text");

  requestAnimationFrame(() => {
    body.classList.add("loaded");
  });

  const syncHeader = () => {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 4% 0px",
      }
    );

    revealElements.forEach((item) => revealObserver.observe(item));
  } else {
    revealElements.forEach((item) => item.classList.add("is-visible"));
  }

  const contactShell = document.querySelector("[data-contact-email]");
  const contactEmail = contactShell?.dataset.contactEmail?.trim();
  if (contactEmail) {
    document.querySelectorAll("[data-contact-email-link]").forEach((link) => {
      link.setAttribute("href", `mailto:${contactEmail}`);
    });

    document.querySelectorAll("[data-contact-email-text]").forEach((node) => {
      node.textContent = contactEmail;
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      const offset = header ? header.offsetHeight + 18 : 96;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap) {
        const collapseInstance = bootstrap.Collapse.getInstance(navCollapse);
        if (collapseInstance) {
          collapseInstance.hide();
        }
      }
    });
  });

  let lastTrigger = null;

  const openLightbox = (trigger) => {
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxText) {
      return;
    }

    lastTrigger = trigger;
    lightboxImage.src = trigger.dataset.lightboxImage || "";
    lightboxImage.alt = trigger.querySelector("img")?.alt || trigger.dataset.lightboxTitle || "";
    lightboxTitle.textContent = trigger.dataset.lightboxTitle || "";
    lightboxText.textContent = trigger.dataset.lightboxText || "";
    lightbox.hidden = false;

    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      body.classList.add("lightbox-open");
    });
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) {
      return;
    }

    lightbox.classList.remove("is-open");
    body.classList.remove("lightbox-open");

    window.setTimeout(() => {
      lightbox.hidden = true;
      lightboxImage.src = "";
      if (lastTrigger) {
        lastTrigger.focus();
      }
    }, 220);
  };

  document.querySelectorAll("[data-lightbox-image]").forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
  });

  lightbox?.querySelectorAll("[data-lightbox-close]").forEach((closer) => {
    closer.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
});

// Mobile contact number: reveal call, Telegram, and WhatsApp choices.
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

// Project results, conditions, and the client reviews carousel.
document.addEventListener("DOMContentLoaded", () => {
  const oldWorks = document.getElementById("works");
  const advantages = document.getElementById("advantages");
  if (!oldWorks || !advantages) return;

  const durationFeature = document.querySelectorAll(".hero-feature")[2];
  const durationTitle = durationFeature?.querySelector(".hero-feature__title");
  const durationText = durationFeature?.querySelector(".hero-feature__text");
  if (durationTitle && durationText) {
    durationTitle.textContent = "От 7 дней";
    durationText.textContent = "Срок изготовления мебели.";
  }

  advantages.insertAdjacentHTML("afterend", `
    <section class="section-spacer service-assurances" id="conditions">
      <div class="container">
        <div class="service-assurances__head">
          <div class="section-heading reveal-static">
            <span class="section-kicker">Условия</span>
            <h2 class="section-title">Спокойствие на каждом этапе</h2>
          </div>
          <p class="service-assurances__intro">Качественная мебель по разумной цене в Москве и Московской области — с понятными сроками и условиями.</p>
        </div>
        <div class="service-assurances__grid">
          <article class="assurance-card"><span class="assurance-card__value">6 месяцев</span><h3>Гарантия на всю продукцию</h3><p>Фиксируем условия заранее, чтобы вы чувствовали себя уверенно после установки.</p></article>
          <article class="assurance-card"><span class="assurance-card__value">В удобный день</span><h3>Замер и расчёт</h3><p>Согласуем удобный день выезда замерщика и детали будущей мебели.</p></article>
          <article class="assurance-card"><span class="assurance-card__value">от 7 дней</span><h3>Срок изготовления</h3><p>Согласуем детали и запустим мебель в работу без лишнего ожидания.</p></article>
          <article class="assurance-card assurance-card--accent"><span class="assurance-card__value">Москва + МО</span><h3>Работаем рядом</h3><p>Поможем сориентироваться по проекту и согласуем удобное время замера.</p></article>
        </div>
      </div>
    </section>
  `);

  oldWorks.insertAdjacentHTML("afterend", `
    <section class="section-spacer project-results" id="projects">
      <div class="container">
        <div class="project-results__top">
          <div class="section-heading reveal-static">
            <span class="section-kicker">Реальные проекты</span>
            <h2 class="section-title">Проект → результат</h2>
            <p class="section-subtitle">От эскиза и точных размеров — к мебели, которая встаёт на своё место.</p>
          </div>
          <a class="project-results__channel" href="https://t.me/shkafsborka" target="_blank" rel="noopener">Все работы в Telegram <span aria-hidden="true">↗</span></a>
        </div>

        <div class="project-results__grid">
          <article class="project-result-card project-result-card--wide">
            <button class="project-result-card__result project-pair-trigger" type="button" data-project-image="assets/projects/tv-unit-sketch.jpg" data-result-image="assets/projects/tv-unit-result.jpg" data-project-title="Эскиз тумбы под ТВ" data-result-title="Готовая тумба под ТВ" aria-label="Открыть эскиз и готовую тумбу под ТВ"><img src="assets/projects/tv-unit-result.jpg" alt="Тумба под телевизор по индивидуальным размерам" loading="lazy"></button>
            <button class="project-result-card__sketch project-pair-trigger" type="button" data-project-image="assets/projects/tv-unit-sketch.jpg" data-result-image="assets/projects/tv-unit-result.jpg" data-project-title="Эскиз тумбы под ТВ" data-result-title="Готовая тумба под ТВ" aria-label="Открыть эскиз и готовую тумбу под ТВ"><img src="assets/projects/tv-unit-sketch.jpg" alt="Эскиз тумбы под телевизор" loading="lazy"><span>Эскиз</span></button>
            <div class="project-result-card__body"><span class="project-result-card__eyebrow">Тумба под ТВ</span><h3>Чистая линия для гостиной</h3><p>Продуманное хранение и аккуратная посадка в интерьер.</p></div>
          </article>

          <article class="project-result-card">
            <button class="project-result-card__result project-pair-trigger" type="button" data-project-image="assets/projects/storage-system-sketch.jpg" data-result-image="assets/projects/bedroom-wardrobe-result.jpg" data-project-title="Эскиз встроенного шкафа" data-result-title="Готовый встроенный шкаф" aria-label="Открыть эскиз и готовый встроенный шкаф"><img src="assets/projects/bedroom-wardrobe-result.jpg" alt="Встроенный шкаф в спальне с зеркальными фасадами" loading="lazy"></button>
            <button class="project-result-card__sketch project-pair-trigger" type="button" data-project-image="assets/projects/storage-system-sketch.jpg" data-result-image="assets/projects/bedroom-wardrobe-result.jpg" data-project-title="Эскиз встроенного шкафа" data-result-title="Готовый встроенный шкаф" aria-label="Открыть эскиз и готовый встроенный шкаф"><img src="assets/projects/storage-system-sketch.jpg" alt="Эскиз встроенного шкафа" loading="lazy"><span>Эскиз</span></button>
            <div class="project-result-card__body"><span class="project-result-card__eyebrow">Спальня</span><h3>Встроенный шкаф</h3><p>Максимум хранения в точной геометрии комнаты.</p></div>
          </article>

          <article class="project-result-card">
            <button class="project-result-card__result project-pair-trigger" type="button" data-project-image="assets/projects/wardrobe-plan.jpg" data-result-image="assets/projects/storage-system-result.jpg" data-project-title="Эскиз системы хранения" data-result-title="Собранная система хранения" aria-label="Открыть эскиз и готовую систему хранения"><img src="assets/projects/storage-system-result.jpg" alt="Система хранения по индивидуальному проекту" loading="lazy"></button>
            <button class="project-result-card__sketch project-pair-trigger" type="button" data-project-image="assets/projects/wardrobe-plan.jpg" data-result-image="assets/projects/storage-system-result.jpg" data-project-title="Эскиз системы хранения" data-result-title="Собранная система хранения" aria-label="Открыть эскиз и готовую систему хранения"><img src="assets/projects/wardrobe-plan.jpg" alt="Эскиз системы хранения" loading="lazy"><span>Проект</span></button>
            <div class="project-result-card__body"><span class="project-result-card__eyebrow">Гардеробная</span><h3>Система хранения</h3><p>Полки, секции и глубина — под ваши вещи и привычки.</p></div>
          </article>

          <article class="project-result-card project-result-card--tall">
            <button class="project-result-card__result project-pair-trigger" type="button" data-project-image="assets/projects/bathroom-cabinet-sketch.jpg" data-result-image="assets/projects/bathroom-cabinet-result.jpg" data-project-title="Эскиз шкафа для ванной" data-result-title="Готовый шкаф для ванной" aria-label="Открыть эскиз и готовый шкаф для ванной"><img src="assets/projects/bathroom-cabinet-result.jpg" alt="Встроенный шкаф для ванной комнаты" loading="lazy"></button>
            <button class="project-result-card__sketch project-pair-trigger" type="button" data-project-image="assets/projects/bathroom-cabinet-sketch.jpg" data-result-image="assets/projects/bathroom-cabinet-result.jpg" data-project-title="Эскиз шкафа для ванной" data-result-title="Готовый шкаф для ванной" aria-label="Открыть эскиз и готовый шкаф для ванной"><img src="assets/projects/bathroom-cabinet-sketch.jpg" alt="Эскиз шкафа для ванной комнаты" loading="lazy"><span>Эскиз</span></button>
            <div class="project-result-card__body"><span class="project-result-card__eyebrow">Ванная комната</span><h3>Шкаф в ограниченном пространстве</h3><p>Функциональная мебель, рассчитанная до миллиметра.</p></div>
          </article>
        </div>
      </div>
    </section>
  `);

  const projects = document.getElementById("projects");
  projects?.insertAdjacentHTML("afterend", `
    <section class="section-spacer section-alt reviews-section" id="reviews">
      <div class="container">
        <div class="reviews-section__head">
          <div class="section-heading reveal-static"><span class="section-kicker">Отзывы</span><h2 class="section-title">Нас рекомендуют близким</h2><p class="section-subtitle">Несколько слов от клиентов, для которых мы уже сделали мебель.</p></div>
          <div class="review-controls" aria-label="Листать отзывы"><button class="review-control" type="button" data-review-prev aria-label="Предыдущие отзывы"><span aria-hidden="true">←</span></button><button class="review-control" type="button" data-review-next aria-label="Следующие отзывы"><span aria-hidden="true">→</span></button></div>
        </div>
        <div class="review-viewport" aria-label="Отзывы клиентов">
          <div class="review-track" data-review-track tabindex="0">
            <article class="review-card"><span class="review-card__quote" aria-hidden="true">“</span><p>Заказывали шкаф в спальню. Мебель привезли очень быстро, качество на высоте, цена для Москвы очень даже разумная.</p><footer><span>Отзыв клиента</span><span>Шкаф в спальню</span></footer></article>
            <article class="review-card"><span class="review-card__quote" aria-hidden="true">“</span><p>Отличная компания. Замерщик приехал в Химки со всеми образцами, на месте всё посчитал. Мебель была готова уже на шестой день. Рекомендую!</p><footer><span>Отзыв клиента</span><span>Гардеробная</span></footer></article>
            <article class="review-card"><span class="review-card__quote" aria-hidden="true">“</span><p>Редко пишу отзывы, но тут ребята удивили. Нужна была тумба под ТВ срочно, сделали за 4 дня. Все стыки ровные, кромка идеальная.</p><footer><span>Отзыв клиента</span><span>Тумба под ТВ</span></footer></article>
          </div>
        </div>
        <p class="reviews-section__hint">Листайте отзывы вбок или используйте стрелки</p>
      </div>
    </section>
  `);

  oldWorks.remove();

  document.body.insertAdjacentHTML("beforeend", `
    <div class="project-pair-modal" data-project-pair-modal hidden>
      <div class="project-pair-modal__backdrop" data-project-pair-close></div>
      <section class="project-pair-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="project-pair-title">
        <button class="project-pair-modal__close" type="button" aria-label="Закрыть просмотр" data-project-pair-close>×</button>
        <header class="project-pair-modal__header"><span>Проект → результат</span><h2 id="project-pair-title">Реализованный проект</h2></header>
        <div class="project-pair-modal__grid">
          <figure class="project-pair-modal__panel" data-project-panel><figcaption data-project-caption>Проект</figcaption><img data-project-pair-image src="" alt=""></figure>
          <figure class="project-pair-modal__panel" data-result-panel><figcaption data-result-caption>Результат</figcaption><img data-result-pair-image src="" alt=""></figure>
        </div>
      </section>
    </div>
  `);

  const pairModal = document.querySelector("[data-project-pair-modal]");
  const pairTitle = pairModal?.querySelector("#project-pair-title");
  const projectPanel = pairModal?.querySelector("[data-project-panel]");
  const resultPanel = pairModal?.querySelector("[data-result-panel]");
  const projectImage = pairModal?.querySelector("[data-project-pair-image]");
  const resultImage = pairModal?.querySelector("[data-result-pair-image]");
  const projectCaption = pairModal?.querySelector("[data-project-caption]");
  const resultCaption = pairModal?.querySelector("[data-result-caption]");
  let activePairTrigger = null;

  const closeProjectPair = () => {
    if (!pairModal || pairModal.hidden) return;
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
    if (!pairModal || !resultPanel || !resultImage || !resultCaption || !pairTitle) return;
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
  pairModal?.querySelectorAll("[data-project-pair-close]").forEach((closer) => {
    closer.addEventListener("click", closeProjectPair);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectPair();
  });

  const reviewTrack = document.querySelector("[data-review-track]");
  const previous = document.querySelector("[data-review-prev]");
  const next = document.querySelector("[data-review-next]");
  if (!reviewTrack || !previous || !next) return;

  const scrollReviews = (direction) => {
    const card = reviewTrack.querySelector(".review-card");
    const gap = Number.parseFloat(getComputedStyle(reviewTrack).gap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : reviewTrack.clientWidth * 0.9;
    const cardsPerStep = window.matchMedia("(min-width: 992px)").matches ? 3 : 2;
    reviewTrack.scrollBy({ left: direction * step * cardsPerStep, behavior: "smooth" });
  };
  previous.addEventListener("click", () => scrollReviews(-1));
  next.addEventListener("click", () => scrollReviews(1));

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

  const reviewStarts = [
    "Заказывали шкаф в спальню.", "Отличная компания. Замерщик приехал", "Редко пишу отзывы", "Все супер! Качественная мебель", "Делали детскую кровать", "Заказывала комод в Люберцы.", "Самая быстрая фабрика", "Спасибо за честный подход.", "Искали недорогой", "Рекомендую фирму.", "Понравился сервис.", "Качественная мебель, адекватный ценник", "Отличный шкаф за свои деньги.", "Большой плюс компании", "Заказывал офисный стол.", "Приятно иметь дело", "Цена и качество на пятерку!", "Всё четко, быстро", "Лучшее предложение", "Очень довольна комодом", "Качество сборки идеальное", "Спасибо за оперативность!", "Вызвал замерщика", "Надежная компания", "Все понравилось.", "Привезли наш заказ в Красногорск", "Отличная фабрика. Разумные цены", "Заказывали обувницу", "Сервис на уровне.", "Хорошая, крепкая мебель", "Обращался по поводу", "Быстро, качественно, недорого.", "Мебель супер", "Порадовала скорость", "Заказывали стол и тумбу.", "Всё отлично.", "Качественная мебель по очень разумной", "Очень доволен сервисом.", "Мебель сделана на совесть.", "Спасибо за новую прихожую!", "Отличная компания, рекомендую.", "Разумная цена и супер-быстрые сроки.", "Всё на высшем уровне.", "Нуна была мебель", "Заказывала шкаф-витрину.", "Понравилось, что расчет мебели", "Отличная фабрика в МО.", "Качественная мебель, приятные цены.", "Всё супер! Заказывали комод", "Огромное спасибо", "Мебель качественная, сборка быстрая.", "Разумные цены, бесплатный расчет", "Заказывали мебель в Домодедово."
  ];

  // Kept in the page itself so the carousel works even when index.html is opened without a web server.
  const bundledReviewSource = `Заказывали шкаф в спальню. Мебель привезли очень быстро, качество на высоте, цена для Москвы очень даже разумная.Отличная компания. Замерщик приехал в Химки со всеми образцами, на месте всё посчитал. Мебель была готова уже на шестой день. Рекомендую!Редко пишу отзывы, но тут ребята удивили. Нужна была тумба под ТВ срочно, сделали за 4 дня. Все стыки ровные, кромка идеальная.Все супер! Качественная мебель по доступной цене. Порадовало, что за сам расчет проекта денег вообще не взяли.Делали детскую кровать на заказ. Срок изготовления порадовал, нам привезли на шестой день. Материалы качественные, запаха нет.Заказывала комод в Люберцы. Очень аккуратная сборка, фурнитура прочная. Буду обращаться еще!Самая быстрая фабрика в Москве, с которой я сталкивался. За 6 дней собрали отличную прихожую. Цена полностью устроила.Спасибо за честный подход. Расчет стоимости сделали быстро, сумма в процессе работы не выросла. Качество топ.Искали недорогой, но приличный шкаф-купе. Здесь предложили лучшую цену в МО. Фабричное качество, двери ходят бесшумно.Рекомендую фирму. Привезли наш заказ вовремя, уложились в неделю. Все фасады идеальные, без сколов.Понравился сервис. Мастер сделал замер, показал образцы материалов, всё подсказал. Цвет подобрали идеально под ламинат.Качественная мебель, адекватный ценник и реально шустрые ребята. Доставили в Одинцово на пятый день после заказа.Отличный шкаф за свои деньги. Сборщики трезвые, вежливые, весь мусор за собой убрали.Большой плюс компании — точный замер и быстрый расчет. Ценник не кусается, сделали за 5 дней.Заказывал офисный стол. Уложились строго в срок, привезли на четвертый день. Договор на руках, все официально.Приятно иметь дело с профессионалами. Оперативно замерили, составили проект. Через несколько дней мебель уже у нас дома в Балашихе.Цена и качество на пятерку! Сделали кухонный гарнитур за рекордные 6 дней. Нам всё очень нравится.Всё четко, быстро и по делу. Замерщик помог определиться с дизайном и грамотным расположением полок.Лучшее предложение в Москве и области. Разумная стоимость, фабричное качество и изготовление без лишних проволочек.Очень довольна комодом и навесными полками. Сроки шикарные, мне привезли на пятый день. Спасибо!Качество сборки идеальное, ничего не скрипит, двери ходят плавно. На всю продукцию идет официальная гарантия 6 месяцев.Спасибо за оперативность! Нужен был стеллаж в кратчайшие сроки, изготовили за 4 дня. Цена очень порадовала.Вызвал замерщика, приехал в тот же день в Королев. Рассчитали проект гардеробной, цена полностью устроила.Надежная компания в Москве. Заказываю тут второй раз, качество проверено. Привозят без опозданий, упаковка плотная.Все понравилось. От замера до установки прошло всего 5 дней. Мебель качественная, фурнитура крепкая.Привезли наш заказ в Красногорск ровно через 6 дней после замера. Качество супер, рекомендую эту фабрику.Отличная фабрика. Разумные цены, официальный договор и реально быстрое производство. Уложились в 5 дней.Заказывали обувницу и шкаф в коридор. Качество на высоте, фасады очень красивые, ручки стильные.Сервис на уровне. Грамотный замер и быстрый расчет стоимости. Привезли и сразу собрали, никаких царапин.Хорошая, крепкая мебель по адекватной цене. Срок изготовления до 7 дней выдержали четко, ни дня задержки.Обращался по поводу шкафа-купе. Сделали за 6 дней, привезли в Мытищи. Качеством доволен, зеркала без дефектов.Быстро, качественно, недорого. Изготовили стеллаж за 5 дней. Отличная работа!Мебель супер, запаха клея нет, все стыки ровные. Буду рекомендовать вас соседям.Порадовала скорость работы. В Москве редко кто делает мебель так быстро без потери качества. Ребята справились за 5 дней!Заказывали стол и тумбу. Привезли на 6-й день после замера. Цена полностью соответствует качеству.Всё отлично. Рассчитали проект, предложили хорошую цену. Мебель была готова уже через 5 дней.Качественная мебель по очень разумной цене в Москве. Сроки изготовления моментальные — всего 6 дней.Очень доволен сервисом. Замерщик подсказал, как лучше сделать, чтобы сэкономить пространство в узком коридоре.Мебель сделана на совесть. Никаких нареканий по качеству, пользуемся уже месяц, все отлично.Спасибо за новую прихожую! Изготовили за 5 дней, привезли в Подольск. Дали гарантию на 6 месяцев, все официально.Отличная компания, рекомендую. Быстро сделали замер и расчет проекта. Качество материалов очень порадовало.Разумная цена и супер-быстрые сроки. Мебель качественная, стоит прочно, выглядит стильно и современно.Всё на высшем уровне. Замерщик приехал вовремя, мебель изготовили за 6 дней. Все идеально подошло под наши неровные стены.Нуна была мебель в съемную квартиру в Москве, искали подешевле и побыстрее. Сделали за 5 дней, качество отличное для такой цены.Заказывала шкаф-витрину. Изготовили за 6 дней, доставили аккуратно. Очень довольна покупкой!Понравилось, что расчет мебели делают детально. Цена устроила, подписали договор. На 5-й день всё привезли.Отличная фабрика в МО. Быстро приехали на замер. Через 6 дней привезли готовую стенку в гостиную.Качественная мебель, приятные цены. Срок изготовления до 7 дней соблюдают строго, мне шкаф сделали за 5 дней.Всё супер! Заказывали комод, сделали за 4 дня. Качество отличное, фурнитура надежная.Огромное спасибо за оперативность. Точный замер и изготовление за 6 дней — это лучший сервис в Москве.Мебель качественная, сборка быстрая. Изготовили кровать за 5 дней. Цена полностью адекватная.Разумные цены, бесплатный расчет проекта. Шкаф привезли на 6-й день. Всё аккуратно упаковано, комплектация полная.Заказывали мебель в Домодедово. Замерщик учел все нюансы стен. Изготовили всего за 5 дней! Рекомендую.`;

  const renderReviews = (reviews) => {
    reviewTrack.innerHTML = "";
    reviews.forEach((review, index) => {
      const card = document.createElement("article");
      card.className = "review-card";
      const quote = document.createElement("span");
      quote.className = "review-card__quote";
      quote.setAttribute("aria-hidden", "true");
      quote.textContent = "“";
      const text = document.createElement("p");
      text.textContent = review;
      const footer = document.createElement("footer");
      const label = document.createElement("span");
      label.textContent = `Отзыв клиента ${String(index + 1).padStart(2, "0")}`;
      const marker = document.createElement("span");
      marker.textContent = "ШкафСборка";
      footer.append(label, marker);
      card.append(quote, text, footer);
      reviewTrack.append(card);
    });
  };

  const cleanReviewSource = bundledReviewSource.replace(/\s+/g, " ").trim();
  const reviewPositions = reviewStarts.map((start, index) => {
    const from = index === 0 ? 0 : cleanReviewSource.indexOf(reviewStarts[index - 1]) + reviewStarts[index - 1].length;
    return cleanReviewSource.indexOf(start, from);
  });
  if (reviewPositions.every((position) => position >= 0)) {
    const reviews = reviewPositions.map((position, index) => cleanReviewSource.slice(position, reviewPositions[index + 1] ?? cleanReviewSource.length).trim());
    renderReviews(reviews);
  }
});
