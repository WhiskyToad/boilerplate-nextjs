/**
 * Smoothly scrolls an element into view with customizable options
 */
export function scrollToElement(
  element: Element,
  options: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
    offset?: number;
  } = {}
): void {
  const {
    behavior = 'smooth',
    block = 'center',
    inline = 'center',
    offset = 0
  } = options;

  // First, use native scrollIntoView for smooth scrolling
  element.scrollIntoView({
    behavior,
    block,
    inline
  });

  // If offset is specified, adjust scroll position
  if (offset !== 0) {
    setTimeout(() => {
      window.scrollBy({
        top: offset,
        behavior: 'smooth'
      });
    }, 100);
  }
}

/**
 * Checks if an element is in the viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Gets the scroll position needed to center an element in viewport
 */
export function getScrollPositionToCenter(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const centerX = window.scrollX + rect.left + rect.width / 2 - viewportWidth / 2;
  const centerY = window.scrollY + rect.top + rect.height / 2 - viewportHeight / 2;

  return { x: centerX, y: centerY };
}
