/**
 * Frontend encoding/mojibake fixer for Hawaiian text.
 *
 * We sometimes see characters like "Ä" or sequences like "â€™" or stray "Â"
 * that result from a UTF-8 string decoded as Latin-1 before reaching the UI.
 * This lightweight fixer performs targeted replacements and leaves already
 * correct Unicode untouched. Idempotent: calling multiple times is safe.
 */

export function fixEncoding(text: string | null | undefined): string {
  if (!text) return text || '';
  let fixed = text;

  // Normalize Unicode to composed form (handles decomposed chars like MÄ + combining macron)
  fixed = fixed.normalize('NFC');

  // Remove C1 control characters (128-159) that corrupt text like U+0081
  // Keep printable ASCII (32-126), high Unicode (>=160), and newline/tab
  fixed = fixed.split('').filter(ch => {
    const code = ch.charCodeAt(0);
    return (32 <= code && code < 127) || code >= 160 || ch === '\n' || ch === '\t';
  }).join('');

  // Remove stray placeholder bytes
  fixed = fixed.replace(/Â+/g, '');

  // Okina / smart quote variants -> ʻ
  fixed = fixed.replace(/â€˜|â€™|â€ʻ|Ê»|Ê¿/g, 'ʻ');

  // Lowercase macron letters often show as single high ASCII chars when broken.
  // If truly mis-decoded, we could attempt a re-decode, but browsers rarely expose raw bytes.
  // Provide minimal direct substitutions where user reported issues.
  fixed = fixed.replace(/Ä/g, 'ā'); // "Ä" representing lowercase a-macron

  // Capitalization normalization for common place name - handle multiple variants
  fixed = fixed.replace(/\bMĀnoa\b/g, 'Mānoa'); // Capital A-macron
  fixed = fixed.replace(/\bMÄnoa\b/g, 'Mānoa'); // Ä variant (after control char removed)
  fixed = fixed.replace(/\bM[ĀĒĪŌŪäëïöü]noa\b/g, 'Mānoa'); // Any uppercase macron

  // Collapse accidental double spaces caused by removals
  fixed = fixed.replace(/ {2,}/g, ' ');

  // Final normalization
  fixed = fixed.normalize('NFC');

  return fixed;
}

export function fixProgramEncoding<T extends { [k: string]: any }>(program: T): T {
  return {
    ...program,
    name: fixEncoding(program.name),
    description: fixEncoding(program.description),
    degree_type: fixEncoding(program.degree_type),
    prerequisites: Array.isArray(program.prerequisites)
      ? program.prerequisites.map(p => fixEncoding(p))
      : program.prerequisites,
    delivery_modes: Array.isArray(program.delivery_modes)
      ? program.delivery_modes.map(m => fixEncoding(m))
      : program.delivery_modes,
  } as T;
}

export function fixOccupationEncoding<T extends { [k: string]: any }>(occupation: T): T {
  return {
    ...occupation,
    title: fixEncoding(occupation.title),
    description: fixEncoding(occupation.description),
    employment_outlook: fixEncoding(occupation.employment_outlook),
  } as T;
}
