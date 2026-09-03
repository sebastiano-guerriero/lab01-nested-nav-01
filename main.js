import "./tailwind.css";

const nav = document.querySelector("nav");
const dotOffsets = ["0px", "37px", "74px"];

const syncDot = (subnav) => {
  const dot = subnav.querySelector("[data-dot]");
  if (!dot) return;

  const items = [...subnav.querySelectorAll(":scope > ul > li")];
  const currentIndex = items.findIndex((item) => item.querySelector("[data-current]"));

  if (currentIndex === -1) {
    dot.getAnimations().forEach((animation) => {
      if (animation.transitionProperty === "translate") {
        animation.commitStyles();
        animation.cancel();
      }
    });
    dot.setAttribute("data-instant", "");
    dot.removeAttribute("data-visible");
    return;
  }

  const offset = `0 ${dotOffsets[currentIndex]}`;
  const isVisible = dot.hasAttribute("data-visible");

  if (!isVisible) {
    dot.setAttribute("data-instant", "");
    dot.style.translate = offset;
    dot.offsetHeight;
    dot.setAttribute("data-visible", "");
    return;
  }

  dot.removeAttribute("data-instant");
  dot.style.translate = offset;
};

document.querySelectorAll("[data-has-subnav]").forEach((trigger) => {
  const subnav = trigger.nextElementSibling?.matches("[data-subnav]")
    ? trigger.nextElementSibling
    : null;

  if (!subnav) return;

  const bar = subnav.querySelector("[data-bar]");
  const barHeights = ["10px", "47px", "84px"];

  const setBarHeight = (height) => {
    bar?.style.setProperty("--bar-height", height);
  };

  const hideBar = () => {
    if (!bar) return;

    bar.getAnimations().forEach((animation) => {
      if (animation.transitionProperty === "--bar-height") {
        animation.commitStyles();
        animation.cancel();
      }
    });

    bar.setAttribute("data-instant", "");
    bar.removeAttribute("data-visible");
  };

  const showBar = (index) => {
    if (!bar) return;

    const height = barHeights[index] ?? barHeights[0];
    const isVisible = bar.hasAttribute("data-visible");

    if (!isVisible) {
      bar.setAttribute("data-instant", "");
      setBarHeight(height);
      bar.offsetHeight;
      bar.setAttribute("data-visible", "");
      return;
    }

    bar.removeAttribute("data-instant");
    setBarHeight(height);
  };

  subnav.querySelectorAll(":scope > ul > li").forEach((item, index) => {
    item.addEventListener("pointerenter", () => {
      showBar(index);
    });
  });

  subnav.addEventListener("pointerleave", hideBar);

  const setOpen = (open) => {
    trigger.setAttribute("aria-expanded", String(open));
    subnav.toggleAttribute("inert", !open);
    if (!open) hideBar();
  };

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    setOpen(trigger.getAttribute("aria-expanded") !== "true");
  });
});

nav?.addEventListener("click", (event) => {
  const item = event.target.closest("a");
  if (!item || item.hasAttribute("data-has-subnav")) return;

  event.preventDefault();
  nav.querySelectorAll("[data-current]").forEach((current) => {
    current.removeAttribute("data-current");
  });
  item.setAttribute("data-current", "");
  nav.querySelectorAll("[data-subnav]").forEach(syncDot);
});


