export function t(path: string, lang: 'en' | 'es'): string {
  const strings = lang === 'es'
    ? { ...(window as any).ES }
    : { ...(window as any).EN };
  const keys = path.split('.');
  let result: any = strings;
  for (const key of keys) {
    result = result?.[key];
  }
  return result ?? path;
}

export function getLang(url: URL): 'en' | 'es' {
  if (url.pathname.startsWith('/es/') || url.pathname === '/es') return 'es';
  return 'en';
}
