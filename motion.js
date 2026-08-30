(function () {
  "use strict";

  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const stage = document.querySelector(".feature-stage");
  const stageCards = stage ? gsap.utils.toArray(":scope > .box", stage) : [];
  const allCards = gsap.utils.toArray("main > .box");
  const laterCards = allCards.filter((card) => !stageCards.includes(card));
  const media = gsap.matchMedia();

  media.add(
    {
      desktop: "(min-width: 769px)",
      mobile: "(max-width: 768px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set([".page-title", ".page-intro", ...allCards], {
          clearProps: "all"
        });
        return;
      }

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".page-title", { y: 22, autoAlpha: 0, duration: 0.75 })
        .from(".page-intro", { y: 14, autoAlpha: 0, duration: 0.55 }, "-=0.35");

      if (desktop && stage && stageCards.length) {
        gsap.set(stageCards, { transformOrigin: "50% 50%" });

        const stageTimeline = gsap.timeline({
          defaults: { duration: 1, ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 1.8, stageCards.length * 420)}`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });

        stageTimeline.fromTo(
          stageCards,
          { y: 64, autoAlpha: 0.35, scale: 0.96 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.45 }
        );
      } else {
        stageCards.forEach((card) => {
          gsap.from(card, {
            y: 28,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true
            }
          });
        });
      }

      ScrollTrigger.batch(laterCards, {
        start: "top 88%",
        once: true,
        batchMax: desktop ? 3 : 1,
        onEnter: (cards) => gsap.fromTo(
          cards,
          { y: desktop ? 48 : 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: "auto"
          }
        )
      });
    }
  );

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();
