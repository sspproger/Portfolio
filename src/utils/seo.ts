export function normalizePath(path: string) {
  if (!path) {
    return '/';
  }

  const pathWithoutQuery = path.split('?')[0].split('#')[0];

  if (!pathWithoutQuery || pathWithoutQuery === '/') {
    return '/';
  }

  return `/${pathWithoutQuery.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

export function joinUrl(baseUrl: string, path: string) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = normalizePath(path);

  if (cleanPath === '/') {
    return `${cleanBase}/`;
  }

  return `${cleanBase}${cleanPath}`;
}

export function getCanonicalUrl(baseUrl: string, path: string) {
  return joinUrl(baseUrl, normalizePath(path));
}