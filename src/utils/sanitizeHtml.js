/**
 * Untrusted HTML Sanitizer for MailTrace-AI Email Bodies
 * 
 * SECURITY PRINCIPLES:
 * 1. Treat all email content as untrusted input.
 * 2. Strip executable scripts, inline event handlers (on*), iframes, objects, forms, and base tags.
 * 3. Neutralize dangerous URIs (javascript:, vbscript:, data:text/html).
 * 4. Prevent automatic external tracking image loading (remote beacons/pixels).
 * 5. Enforce rel="noopener noreferrer" on all hyperlinks.
 */

export function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  // Use browser DOMParser to safely parse HTML in isolated document fragment
  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(dirtyHtml, 'text/html');

      // 1. Remove dangerous script and executable embedding tags
      const dangerousTags = [
        'script', 'iframe', 'object', 'embed', 'applet', 
        'form', 'base', 'link', 'meta', 'frame', 'frameset'
      ];
      
      dangerousTags.forEach((tagName) => {
        const elements = doc.querySelectorAll(tagName);
        elements.forEach((el) => el.remove());
      });

      // 2. Iterate all remaining elements to sanitize attributes and links
      const allElements = doc.querySelectorAll('*');
      allElements.forEach((el) => {
        // Remove all inline event handlers (onload, onerror, onclick, etc.)
        const attributeNames = Array.from(el.attributes).map((attr) => attr.name);
        attributeNames.forEach((attrName) => {
          if (attrName.toLowerCase().startsWith('on')) {
            el.removeAttribute(attrName);
          }
          if (attrName.toLowerCase() === 'style') {
            // Strip style attributes containing expression() or url() JavaScript vectors
            const styleVal = el.getAttribute('style') || '';
            if (/expression|javascript:|behavior|(-moz-binding)/i.test(styleVal)) {
              el.removeAttribute('style');
            }
          }
        });

        // Sanitize <a> tags
        if (el.tagName.toLowerCase() === 'a') {
          const href = el.getAttribute('href') || '';
          const trimmedHref = href.trim().toLowerCase();
          
          if (trimmedHref.startsWith('javascript:') || trimmedHref.startsWith('vbscript:') || trimmedHref.startsWith('data:text/html')) {
            el.setAttribute('href', '#');
            el.setAttribute('title', 'Blocked dangerous link protocol');
          }
          
          el.setAttribute('rel', 'noopener noreferrer');
          el.setAttribute('target', '_blank');
        }

        // Sanitize <img> tags to block tracking pixels & remote beacons
        if (el.tagName.toLowerCase() === 'img') {
          const src = el.getAttribute('src') || '';
          const trimmedSrc = src.trim().toLowerCase();

          if (trimmedSrc.startsWith('http://') || trimmedSrc.startsWith('https://')) {
            // Replace external tracking image with safe placeholder badge
            el.setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="24" viewBox="0 0 120 24"><rect width="100%" height="100%" fill="%23f1f5f9" rx="4"/><text x="50%" y="50%" fill="%2364748b" font-size="10" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">[External Image Blocked]</text></svg>');
            el.setAttribute('alt', '[External Tracking Image Blocked for Privacy]');
            el.setAttribute('title', 'Remote image load blocked by MailTrace privacy policy');
            el.style.border = '1px dashed #cbd5e1';
            el.style.borderRadius = '4px';
          }
        }
      });

      return doc.body.innerHTML;
    } catch (err) {
      console.error('[MailTrace HTML Sanitizer Error]:', err);
    }
  }

  // Fallback string-based regex sanitizer if DOMParser is unavailable
  return dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, 'blocked:');
}

export default sanitizeHtml;
