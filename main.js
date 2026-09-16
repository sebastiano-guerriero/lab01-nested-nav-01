import "./tailwind.css";
import { definePatch } from "@web-kits/audio";
import minimal from "./.web-kits/minimal.json";

const sounds = definePatch(minimal);

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

  if (dot.style.translate === offset) return;

  dot.removeAttribute("data-instant");
  dot.style.translate = offset;
};

document.querySelectorAll("[data-has-subnav]").forEach((trigger) => {
  const subnav = trigger.nextElementSibling?.matches("[data-subnav]")
    ? trigger.nextElementSibling
    : null;

  if (!subnav) return;

  const setOpen = (open) => {
    trigger.setAttribute("aria-expanded", String(open));
    subnav.toggleAttribute("inert", !open);
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
