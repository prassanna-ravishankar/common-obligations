export const $ = (selector) => document.querySelector(selector);
export function setPressed(selector, attribute, value) {
  document.querySelectorAll(selector).forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(Number(button.dataset[attribute]) === value),
    );
  });
}
