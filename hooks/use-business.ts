'use client';

import { useAppStore } from '@/store/app-store';

export function useBusinessData() {
  const state = useAppStore();
  const business = state.businesses.find((item) => item.id === state.activeBusinessId && !item.deletedAt);
  const businessId = business?.id || '';
  const products = state.products.filter((item) => item.businessId === businessId && !item.deletedAt);
  const capitals = state.capitals.filter((item) => item.businessId === businessId && !item.deletedAt);
  const sales = state.sales.filter((item) => item.businessId === businessId && !item.deletedAt);
  const locations = state.locations.filter((item) => item.businessId === businessId && !item.deletedAt);
  const stockMovements = state.stockMovements.filter((item) => item.businessId === businessId);
  const notifications = state.notifications.filter((item) => item.businessId === businessId);

  return { ...state, business, products, capitals, sales, locations, stockMovements, notifications };
}
