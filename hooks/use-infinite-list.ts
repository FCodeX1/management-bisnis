'use client';

import { useMemo, useState } from 'react';

export function useInfiniteList<T>(items: T[], pageSize = 20) {
  const [page, setPage] = useState(1);
  const visibleItems = useMemo(() => items.slice(0, page * pageSize), [items, page, pageSize]);
  const hasMore = visibleItems.length < items.length;
  return { visibleItems, hasMore, loadMore: () => setPage((value) => value + 1), reset: () => setPage(1) };
}
