export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createSku(name: string, index = 1) {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.slice(0, 3))
    .join('-')
    .slice(0, 14);
  return `${slug || 'PRD'}-${String(index).padStart(3, '0')}`;
}
