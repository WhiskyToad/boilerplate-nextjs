/**
 * Finds a DOM element from step data using multiple strategies
 * Tries in order: ID -> Selector -> XPath -> Text Content (fuzzy match)
 */
export function findElementFromStep(stepData: any, targetDocument: Document = document): Element | null {
  if (!stepData?.element && !stepData?.element_data) return null;

  const elementData = stepData.element || stepData.element_data;

  // Strategy 1: Try ID (most reliable)
  if (elementData.id) {
    const el = targetDocument.getElementById(elementData.id);
    if (el) {
      console.log('[Playback] Found element by ID:', elementData.id);
      return el;
    }
  }

  // Strategy 2: Try CSS selector
  if (elementData.selector) {
    try {
      const el = targetDocument.querySelector(elementData.selector);
      if (el) {
        console.log('[Playback] Found element by selector:', elementData.selector);
        return el;
      }
    } catch (e) {
      console.warn('[Playback] Invalid selector:', elementData.selector);
    }
  }

  // Strategy 3: Try XPath
  if (elementData.xpath) {
    try {
      const result = targetDocument.evaluate(
        elementData.xpath,
        targetDocument,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      if (result.singleNodeValue) {
        console.log('[Playback] Found element by XPath:', elementData.xpath);
        return result.singleNodeValue as Element;
      }
    } catch (e) {
      console.warn('[Playback] Invalid XPath:', elementData.xpath);
    }
  }

  // Strategy 4: Fuzzy match by text content (fallback)
  if (elementData.textContent || elementData.text_content) {
    const targetText = (elementData.textContent || elementData.text_content).trim();
    const interactiveTags = 'button, a, input, select, textarea, [role="button"], [role="link"]';
    const allElements = targetDocument.querySelectorAll(interactiveTags);

    for (const el of allElements) {
      const elText = el.textContent?.trim() || '';
      if (elText === targetText) {
        console.log('[Playback] Found element by text match:', targetText);
        return el;
      }
    }

    // Try partial match
    for (const el of allElements) {
      const elText = el.textContent?.trim() || '';
      if (elText.includes(targetText) || targetText.includes(elText)) {
        console.log('[Playback] Found element by partial text match:', targetText);
        return el;
      }
    }
  }

  // Strategy 5: Try by tag name + position (very last resort)
  if (elementData.tagName && (elementData.boundingRect || elementData.bounding_rect)) {
    const elements = targetDocument.getElementsByTagName(elementData.tagName);
    const targetRect = elementData.boundingRect || elementData.bounding_rect;

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      // Check if position is roughly the same (within 50px)
      if (
        Math.abs(rect.top - targetRect.top) < 50 &&
        Math.abs(rect.left - targetRect.left) < 50
      ) {
        console.log('[Playback] Found element by position match:', elementData.tagName);
        return el;
      }
    }
  }

  console.warn('[Playback] Could not find element for step:', stepData);
  return null;
}

/**
 * Checks if an element is currently visible and interactable
 */
export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

/**
 * Gets a human-readable description of an element
 */
export function getElementDescription(element: Element): string {
  const tagName = element.tagName.toLowerCase();
  const id = (element as HTMLElement).id;
  const text = element.textContent?.trim().substring(0, 30) || '';

  if (id) return `${tagName}#${id}`;
  if (text) return `${tagName} "${text}"`;
  return tagName;
}
