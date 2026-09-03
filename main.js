import "./tailwind.css";

const nav = document.querySelector("nav");

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

  subnav.querySelectorAll(":scope > ul > li").forEach((item, index) => {
    item.addEventListener("pointerenter", () => {
      setBarHeight(barHeights[index] ?? barHeights[0]);
      bar?.setAttribute("data-visible", "");
    });
  });

  subnav.addEventListener("pointerleave", () => {
    bar?.removeAttribute("data-visible");
  });

  const setOpen = (open) => {
    trigger.setAttribute("aria-expanded", String(open));
    subnav.toggleAttribute("inert", !open);
    if (!open) bar?.removeAttribute("data-visible");
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
});


