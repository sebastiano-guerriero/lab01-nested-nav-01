import "./tailwind.css";

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


