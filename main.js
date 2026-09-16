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

  const parent = trigger.parentElement;
  const indicator = parent?.querySelector("[data-curved-hover-indicator]");
  const filling = parent?.querySelector("[data-filling-fx]");
  const curveEndY = 8;

  const commitTransition = (el, property) => {
    el.getAnimations().forEach((animation) => {
      if (animation.transitionProperty === property) {
        animation.commitStyles();
        animation.cancel();
      }
    });
  };

  const hideHoverFx = () => {
    if (indicator) {
      commitTransition(indicator, "translate");
      indicator.setAttribute("data-instant", "");
      indicator.removeAttribute("data-visible");
    }

    if (filling) {
      commitTransition(filling, "height");
      filling.setAttribute("data-instant", "");
      filling.removeAttribute("data-visible");
    }
  };

  const alignHoverFx = (item) => {
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset = itemRect.top + itemRect.height / 2 - parentRect.top - curveEndY;

    if (indicator) {
      const translate = `0 ${offset}px`;
      const isVisible = indicator.hasAttribute("data-visible");

      if (!isVisible) {
        indicator.setAttribute("data-instant", "");
        indicator.style.translate = translate;
        indicator.offsetHeight;
        indicator.setAttribute("data-visible", "");
      } else if (indicator.style.translate !== translate) {
        indicator.removeAttribute("data-instant");
        indicator.style.translate = translate;
      }
    }

    if (filling) {
      const height = `${Math.max(0, offset - filling.offsetTop)}px`;
      const isVisible = filling.hasAttribute("data-visible");

      if (!isVisible) {
        filling.setAttribute("data-instant", "");
        filling.style.height = height;
        filling.offsetHeight;
        filling.setAttribute("data-visible", "");
      } else if (filling.style.height !== height) {
        filling.removeAttribute("data-instant");
        filling.style.height = height;
      }
    }
  };

  subnav.querySelectorAll(":scope > ul > li > a").forEach((item) => {
    item.addEventListener("pointerenter", () => {
      alignHoverFx(item);
    });
  });

  subnav.addEventListener("pointerleave", hideHoverFx);

  const setOpen = (open) => {
    trigger.setAttribute("aria-expanded", String(open));
    subnav.toggleAttribute("inert", !open);
    if (!open) hideHoverFx();
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
