import en from './en.json';
import es from './es.json';

export { en, es };

export function getLang(url: URL): 'en' | 'es' {
  if (url.pathname.startsWith('/es/') || url.pathname === '/es') return 'es';
  return 'en';
}

export function t(lang: 'en' | 'es', path: string): string {
  const keys = path.split('.');
  const dict = lang === 'es' ? es : en;
  let val: any = dict;
  for (const k of keys) {
    val = val?.[k];
  }
  return val ?? path;
}
