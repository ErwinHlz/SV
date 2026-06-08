export const resolveScrollContainer = (
  element: HTMLElement | null,
): Window | HTMLElement => {
  const appContent = element?.closest(".app-content");

  if (!(appContent instanceof HTMLElement)) {
    return window;
  }

  const canScrollVertically = appContent.scrollHeight > appContent.clientHeight + 1;
  const overflowY = window.getComputedStyle(appContent).overflowY;
  const usesOwnScroll =
    canScrollVertically && (overflowY === "auto" || overflowY === "scroll");

  return usesOwnScroll ? appContent : window;
};
