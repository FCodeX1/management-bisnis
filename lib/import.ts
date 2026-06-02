import type {
  Business,
  CapitalItem,
  CapitalRecord,
  NotificationItem,
  Product,
  Role,
  SaleLocation,
  SalesRecord,
  StockMovement,
  StockMovementType,
  Unit,
  UserProfile
} from '@/types';
import { createSku, uid } from '@/lib/id';

export interface FullImportPayload {
  user?: UserProfile | null;
  businesses: Business[];
  locations: SaleLocation[];
  products: Product[];
  capitals: CapitalRecord[];
  sales: SalesRecord[];
  stockMovements: StockMovement[];
  notifications: NotificationItem[];
  activeBusinessId?: string;
}

export interface FullImportResult {
  payload: FullImportPayload;
  stats: {
    businesses: number;
    locations: number;
    products: number;
    capitals: number;
    capitalItems: number;
    sales: number;
    stockMovements: number;
    notifications: number;
  };
  warnings: string[];
}

type SheetRow = Record<string, string>;
type SheetMap = Map<string, SheetRow[]>;

const VALID_UNITS: Unit[] = ['kg', 'gram', 'pack', 'pcs', 'liter', 'meter', 'box', 'botol', 'porsi'];
const VALID_ROLES: Role[] = ['OWNER', 'ADMIN', 'CASHIER', 'STAFF'];
const VALID_STOCK_TYPES: StockMovementType[] = ['IN', 'OUT', 'ADJUSTMENT'];
const VALID_NOTIFICATION_TYPES: NotificationItem['type'][] = ['stock', 'profit', 'target', 'expense', 'sales', 'reminder'];

const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');
const now = () => new Date().toISOString();

function byLocalName(parent: Document | Element, localName: string) {
  return Array.from(parent.getElementsByTagNameNS('*', localName));
}

function attr(element: Element, name: string) {
  return element.getAttribute(name) || element.getAttribute(`ss:${name}`) || element.getAttributeNS('urn:schemas-microsoft-com:office:spreadsheet', name) || '';
}

function readWorkbookXml(text: string): SheetMap {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const parserError = doc.getElementsByTagName('parsererror')[0];
  if (parserError) {
    throw new Error('File tidak terbaca sebagai Excel XML. Pakai file .xls hasil Export Semua Data dari aplikasi ini, lalu simpan dengan format yang sama.');
  }

  const worksheets = byLocalName(doc, 'Worksheet');
  if (!worksheets.length) {
    throw new Error('Sheet tidak ditemukan. Pastikan file yang dipilih adalah hasil Export Semua Data dari aplikasi ini.');
  }

  const sheets: SheetMap = new Map();
  for (const worksheet of worksheets) {
    const sheetName = attr(worksheet, 'Name') || 'Sheet';
    const rows = byLocalName(worksheet, 'Row')
      .map((rowElement) => {
        const values: string[] = [];
        let currentIndex = 1;
        const cells = byLocalName(rowElement, 'Cell');
        for (const cellElement of cells) {
          const indexText = attr(cellElement, 'Index');
          if (indexText) currentIndex = Math.max(1, Number(indexText) || currentIndex);
          const dataElement = byLocalName(cellElement, 'Data')[0];
          values[currentIndex - 1] = (dataElement?.textContent || '').trim();
          currentIndex += 1;
        }
        return values;
      })
      .filter((row) => row.some((value) => value !== ''));

    if (!rows.length) {
      sheets.set(sheetName, []);
      continue;
    }

    const headers = rows[0].map((header) => header.trim());
    const body = rows.slice(1).map((values) => {
      const row: SheetRow = {};
      headers.forEach((header, index) => {
        if (header) row[header] = values[index] || '';
      });
      return row;
    }).filter((row) => Object.values(row).some((value) => value !== ''));

    sheets.set(sheetName, body);
  }

  return sheets;
}

function isPlaceholderRow(row: SheetRow) {
  return Object.values(row).some((value) => norm(value) === 'belumadadatapadasheetini');
}

function sheet(sheets: SheetMap, ...names: string[]) {
  const aliases = names.map(norm);
  for (const [name, rows] of sheets.entries()) {
    if (aliases.includes(norm(name))) return rows.filter((row) => !isPlaceholderRow(row));
  }
  return [];
}

function get(row: SheetRow, ...keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined) return row[key].trim();
  }
  const normalized = new Map(Object.keys(row).map((key) => [norm(key), key]));
  for (const key of keys) {
    const match = normalized.get(norm(key));
    if (match && row[match] !== undefined) return row[match].trim();
  }
  return '';
}

function fieldText(row: SheetRow, keys: string[], fallback = '') {
  const value = get(row, ...keys);
  return value || fallback;
}

function numberValue(value: string | number | undefined | null, fallback = 0) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;
  const stripped = raw.replace(/[^0-9,.-]/g, '');
  if (!stripped) return fallback;

  let normalized = stripped;
  const commaCount = (normalized.match(/,/g) || []).length;
  const dotCount = (normalized.match(/\./g) || []).length;

  if (commaCount === 1 && dotCount === 0) normalized = normalized.replace(',', '.');
  else if (commaCount > 0 && dotCount > 0) {
    const lastComma = normalized.lastIndexOf(',');
    const lastDot = normalized.lastIndexOf('.');
    if (lastComma > lastDot) normalized = normalized.replace(/\./g, '').replace(',', '.');
    else normalized = normalized.replace(/,/g, '');
  } else if (dotCount > 1) normalized = normalized.replace(/\./g, '');
  else if (commaCount > 1) normalized = normalized.replace(/,/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rowNumber(row: SheetRow, keys: string[], fallback = 0) {
  return numberValue(get(row, ...keys), fallback);
}

function boolValue(value: string | undefined, fallback = false) {
  const normalized = norm(value || '');
  if (['ya', 'yes', 'true', '1', 'aktif', 'active', 'sudahdibaca'].includes(normalized)) return true;
  if (['tidak', 'no', 'false', '0', 'nonaktif', 'inactive', 'belumdibaca'].includes(normalized)) return false;
  return fallback;
}

function parseDate(value: string | undefined, fallback = now()) {
  const raw = (value || '').trim();
  if (!raw) return fallback;

  const localMatch = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:,?\s*(\d{1,2})[.:](\d{1,2}))?/);
  if (localMatch) {
    const day = Number(localMatch[1]);
    const month = Number(localMatch[2]);
    const year = Number(localMatch[3].length === 2 ? `20${localMatch[3]}` : localMatch[3]);
    const hour = Number(localMatch[4] || 0);
    const minute = Number(localMatch[5] || 0);
    const parsed = new Date(year, month - 1, day, hour, minute);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  const direct = new Date(raw);
  if (!Number.isNaN(direct.getTime())) return direct.toISOString();

  return fallback;
}

function deletedAtFrom(row: SheetRow) {
  const deletedAt = get(row, 'Dihapus', 'Tanggal Dihapus', 'Deleted At');
  if (deletedAt) return parseDate(deletedAt, '');
  const status = norm(get(row, 'Status'));
  return status === 'dihapus' || status === 'deleted' ? now() : null;
}

function unitValue(value: string | undefined, fallback: Unit = 'pcs'): Unit {
  const normalized = norm(value || '');
  return VALID_UNITS.find((unit) => norm(unit) === normalized) || fallback;
}

function roleValue(value: string | undefined, fallback: Role = 'OWNER'): Role {
  const normalized = norm(value || '').toUpperCase();
  return VALID_ROLES.find((role) => role === normalized) || fallback;
}

function stockTypeValue(value: string | undefined): StockMovementType {
  const normalized = norm(value || '').toUpperCase();
  return VALID_STOCK_TYPES.find((type) => type === normalized) || 'ADJUSTMENT';
}

function notificationTypeValue(value: string | undefined): NotificationItem['type'] {
  const normalized = norm(value || '');
  return VALID_NOTIFICATION_TYPES.find((type) => norm(type) === normalized) || 'reminder';
}

function createIndex<T extends { id: string; name?: string; sku?: string; businessId?: string }>(rows: T[]) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const byName = new Map<string, T>();
  const bySku = new Map<string, T>();
  rows.forEach((row) => {
    if (row.name) byName.set(norm(`${row.businessId || ''}:${row.name}`), row);
    if (row.name) byName.set(norm(row.name), row);
    if (row.sku) bySku.set(norm(row.sku), row);
  });
  return { byId, byName, bySku };
}

export function parseAllDataExcelText(text: string): FullImportResult {
  const sheets = readWorkbookXml(text);
  const warnings: string[] = [];
  const businessRows = sheet(sheets, 'Bisnis');
  const locationRows = sheet(sheets, 'Toko Lokasi', 'Toko/Lokasi', 'Toko');
  const productRows = sheet(sheets, 'Produk');
  const capitalRows = sheet(sheets, 'Modal');
  const capitalItemRows = sheet(sheets, 'Detail Item Modal', 'Item Modal');
  const salesRows = sheet(sheets, 'Penjualan');
  const stockRows = sheet(sheets, 'Riwayat Stok', 'Stok');
  const notificationRows = sheet(sheets, 'Notifikasi');
  const userRows = sheet(sheets, 'User');

  const userRow = userRows[0];
  const user: UserProfile | null = userRow && fieldText(userRow, ['Email']) ? {
    id: fieldText(userRow, ['ID User'], uid('user')),
    name: fieldText(userRow, ['Nama'], 'Owner'),
    email: fieldText(userRow, ['Email'], 'owner@local.app'),
    role: roleValue(fieldText(userRow, ['Role'])),
    avatarUrl: fieldText(userRow, ['Avatar URL'], '')
  } : null;

  const businesses: Business[] = businessRows.map((row, index) => {
    const name = fieldText(row, ['Nama Bisnis', 'Bisnis', 'Nama'], `Bisnis ${index + 1}`);
    return {
      id: fieldText(row, ['ID Bisnis'], uid('biz')),
      name,
      category: fieldText(row, ['Kategori'], 'Umum'),
      description: fieldText(row, ['Deskripsi'], ''),
      address: fieldText(row, ['Alamat'], ''),
      currency: fieldText(row, ['Mata Uang', 'Currency'], 'IDR'),
      logoUrl: fieldText(row, ['Logo URL'], ''),
      createdAt: parseDate(fieldText(row, ['Dibuat']), now()),
      updatedAt: parseDate(fieldText(row, ['Diupdate']), now()),
      deletedAt: deletedAtFrom(row)
    };
  }).filter((business) => business.name.trim());

  const businessById = new Map(businesses.map((business) => [business.id, business]));
  const businessByName = new Map(businesses.map((business) => [norm(business.name), business]));

  function ensureBusiness(label?: string) {
    const raw = (label || '').trim();
    if (raw && businessById.has(raw)) return raw;
    if (raw && businessByName.has(norm(raw))) return businessByName.get(norm(raw))!.id;
    const existing = businesses.find((item) => !item.deletedAt) || businesses[0];
    if (existing && !raw) return existing.id;

    const business: Business = {
      id: uid('biz'),
      name: raw || `Bisnis ${businesses.length + 1}`,
      category: 'Umum',
      description: 'Dibuat otomatis saat import karena kolom bisnis belum ada di sheet Bisnis.',
      address: '',
      currency: 'IDR',
      logoUrl: '',
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null
    };
    businesses.push(business);
    businessById.set(business.id, business);
    businessByName.set(norm(business.name), business);
    warnings.push(`Bisnis "${business.name}" dibuat otomatis karena ditemukan di sheet lain tetapi tidak ada di sheet Bisnis.`);
    return business.id;
  }

  if (!businesses.length) ensureBusiness('Bisnis Saya');

  const locations: SaleLocation[] = locationRows.map((row, index) => {
    const name = fieldText(row, ['Nama Toko/Lokasi', 'Nama Toko', 'Toko/Lokasi', 'Toko', 'Lokasi'], `Toko ${index + 1}`);
    const status = norm(get(row, 'Status'));
    const deletedAt = deletedAtFrom(row);
    return {
      id: fieldText(row, ['ID Toko', 'ID Lokasi'], uid('loc')),
      businessId: ensureBusiness(fieldText(row, ['Bisnis', 'ID Bisnis'])),
      name,
      address: fieldText(row, ['Alamat'], ''),
      phone: fieldText(row, ['Telepon', 'No Telepon', 'No. telepon'], ''),
      managerName: fieldText(row, ['PIC/Penanggung Jawab', 'Penanggung Jawab', 'PIC'], ''),
      openingHours: fieldText(row, ['Jam Operasional'], ''),
      targetDailyRevenue: rowNumber(row, ['Target Omzet Harian'], 0),
      priceNote: fieldText(row, ['Catatan Harga/Lokasi', 'Catatan Harga'], ''),
      isActive: deletedAt ? false : boolValue(get(row, 'Aktif'), status !== 'nonaktif'),
      createdAt: parseDate(fieldText(row, ['Dibuat']), now()),
      updatedAt: parseDate(fieldText(row, ['Diupdate']), now()),
      deletedAt
    };
  }).filter((location) => location.name.trim());

  const products: Product[] = productRows.map((row, index) => {
    const businessId = ensureBusiness(fieldText(row, ['Bisnis', 'ID Bisnis']));
    const name = fieldText(row, ['Nama Produk', 'Produk', 'Nama'], `Produk ${index + 1}`);
    return {
      id: fieldText(row, ['ID Produk'], uid('prd')),
      businessId,
      name,
      sku: fieldText(row, ['SKU'], createSku(name, index + 1)),
      barcode: fieldText(row, ['Barcode'], ''),
      category: fieldText(row, ['Kategori'], 'Umum'),
      photoUrl: fieldText(row, ['Foto URL'], ''),
      baseUnit: unitValue(fieldText(row, ['Satuan', 'Satuan Dasar']), 'pcs'),
      costPrice: rowNumber(row, ['Harga Modal', 'Harga Modal/Unit', 'Modal'], 0),
      sellingPrice: rowNumber(row, ['Harga Jual', 'Harga Jual/Unit'], 0),
      minStock: rowNumber(row, ['Minimum Stok', 'Min Stok'], 0),
      stock: rowNumber(row, ['Stok Saat Ini', 'Stok Awal', 'Stok'], 0),
      variants: [],
      createdAt: parseDate(fieldText(row, ['Dibuat']), now()),
      updatedAt: parseDate(fieldText(row, ['Diupdate']), now()),
      deletedAt: deletedAtFrom(row)
    };
  }).filter((product) => product.name.trim());

  const locationIndex = createIndex(locations);
  const productIndex = createIndex(products);

  function ensureLocation(label: string, businessId: string) {
    const raw = (label || '').trim();
    if (!raw) return undefined;
    const byNameInBusiness = locationIndex.byName.get(norm(`${businessId}:${raw}`));
    const byName = locationIndex.byName.get(norm(raw));
    const byId = locationIndex.byId.get(raw);
    const found = byId || byNameInBusiness || byName;
    if (found) return found.id;

    const location: SaleLocation = {
      id: uid('loc'),
      businessId,
      name: raw,
      address: '',
      phone: '',
      managerName: '',
      priceNote: 'Dibuat otomatis saat import dari sheet Penjualan.',
      openingHours: '',
      targetDailyRevenue: 0,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null
    };
    locations.push(location);
    locationIndex.byId.set(location.id, location);
    locationIndex.byName.set(norm(`${businessId}:${location.name}`), location);
    locationIndex.byName.set(norm(location.name), location);
    warnings.push(`Toko/lokasi "${location.name}" dibuat otomatis karena ada di penjualan tetapi tidak ada di sheet Toko Lokasi.`);
    return location.id;
  }

  function ensureProduct(label: string, sku: string, businessId: string) {
    const rawLabel = (label || '').trim();
    const rawSku = (sku || '').trim();
    const bySku = rawSku ? productIndex.bySku.get(norm(rawSku)) : undefined;
    const byNameInBusiness = rawLabel ? productIndex.byName.get(norm(`${businessId}:${rawLabel}`)) : undefined;
    const byName = rawLabel ? productIndex.byName.get(norm(rawLabel)) : undefined;
    const byId = rawLabel ? productIndex.byId.get(rawLabel) : undefined;
    const found = byId || bySku || byNameInBusiness || byName;
    if (found) return found;

    const name = rawLabel || rawSku || `Produk ${products.length + 1}`;
    const product: Product = {
      id: uid('prd'),
      businessId,
      name,
      sku: rawSku || createSku(name, products.length + 1),
      barcode: '',
      category: 'Umum',
      photoUrl: '',
      baseUnit: 'pcs',
      costPrice: 0,
      sellingPrice: 0,
      minStock: 0,
      stock: 0,
      variants: [],
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null
    };
    products.push(product);
    productIndex.byId.set(product.id, product);
    productIndex.byName.set(norm(`${businessId}:${product.name}`), product);
    productIndex.byName.set(norm(product.name), product);
    productIndex.bySku.set(norm(product.sku), product);
    warnings.push(`Produk "${product.name}" dibuat otomatis karena ada di transaksi/stok tetapi tidak ada di sheet Produk.`);
    return product;
  }

  const capitalItemGroups = new Map<string, CapitalItem[]>();
  let capitalItemCount = 0;
  for (const row of capitalItemRows) {
    const capitalId = fieldText(row, ['ID Modal'], '');
    if (!capitalId) {
      warnings.push('Ada baris Detail Item Modal tanpa ID Modal, baris dilewati.');
      continue;
    }
    const qty = rowNumber(row, ['Qty', 'Jumlah'], 0);
    const price = rowNumber(row, ['Harga Satuan', 'Harga/Unit', 'Harga'], 0);
    const item: CapitalItem = {
      id: uid('capitem'),
      name: fieldText(row, ['Nama Item', 'Item', 'Nama'], 'Item modal'),
      qty,
      unit: unitValue(fieldText(row, ['Satuan']), 'pcs'),
      price,
      subtotal: rowNumber(row, ['Subtotal'], qty * price)
    };
    if (!capitalItemGroups.has(capitalId)) capitalItemGroups.set(capitalId, []);
    capitalItemGroups.get(capitalId)!.push(item);
    capitalItemCount += 1;
  }

  const capitalMap = new Map<string, CapitalRecord>();
  for (const row of capitalRows) {
    const id = fieldText(row, ['ID Modal'], uid('cap'));
    const items = capitalItemGroups.get(id) || [];
    const totalFromItems = items.reduce((sum, item) => sum + item.subtotal, 0);
    const capital: CapitalRecord = {
      id,
      businessId: ensureBusiness(fieldText(row, ['Bisnis', 'ID Bisnis'])),
      title: fieldText(row, ['Judul', 'Judul Modal'], 'Catatan modal'),
      category: fieldText(row, ['Kategori', 'Kategori Modal'], 'Operasional'),
      totalAmount: rowNumber(row, ['Total Modal', 'Total'], totalFromItems),
      noteUrl: fieldText(row, ['URL Nota', 'Nota URL'], ''),
      items,
      recordedAt: parseDate(fieldText(row, ['Tanggal Modal', 'Tanggal']), now()),
      createdAt: parseDate(fieldText(row, ['Dibuat']), now()),
      updatedAt: parseDate(fieldText(row, ['Diupdate']), now()),
      deletedAt: deletedAtFrom(row)
    };
    if (!capital.totalAmount && totalFromItems) capital.totalAmount = totalFromItems;
    capitalMap.set(id, capital);
  }

  for (const [capitalId, items] of capitalItemGroups.entries()) {
    if (capitalMap.has(capitalId)) continue;
    const firstSourceRow = capitalItemRows.find((row) => fieldText(row, ['ID Modal']) === capitalId);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    capitalMap.set(capitalId, {
      id: capitalId,
      businessId: ensureBusiness(firstSourceRow ? fieldText(firstSourceRow, ['Bisnis', 'ID Bisnis']) : ''),
      title: firstSourceRow ? fieldText(firstSourceRow, ['Judul Modal', 'Judul'], 'Catatan modal') : 'Catatan modal',
      category: firstSourceRow ? fieldText(firstSourceRow, ['Kategori Modal', 'Kategori'], 'Operasional') : 'Operasional',
      totalAmount,
      noteUrl: firstSourceRow ? fieldText(firstSourceRow, ['URL Nota'], '') : '',
      items,
      recordedAt: parseDate(firstSourceRow ? fieldText(firstSourceRow, ['Tanggal Modal', 'Tanggal']) : '', now()),
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null
    });
    warnings.push(`Modal "${capitalId}" dibuat otomatis dari Detail Item Modal karena tidak ada di sheet Modal.`);
  }

  const capitals = Array.from(capitalMap.values());

  const sales: SalesRecord[] = salesRows.map((row) => {
    const businessId = ensureBusiness(fieldText(row, ['Bisnis', 'ID Bisnis']));
    const product = ensureProduct(fieldText(row, ['Produk', 'Nama Produk', 'ID Produk']), fieldText(row, ['SKU Produk', 'SKU']), businessId);
    const locationName = fieldText(row, ['Toko/Lokasi', 'Lokasi', 'Toko'], 'Lokasi manual');
    const locationId = ensureLocation(locationName, businessId);
    const productionQty = rowNumber(row, ['Produksi Masuk', 'Produksi'], 0);
    const soldQty = rowNumber(row, ['Jumlah Terjual', 'Qty Terjual', 'Terjual'], 0);
    const unitPrice = rowNumber(row, ['Harga Jual/Unit', 'Harga Jual', 'Unit Price'], product.sellingPrice);
    const revenue = rowNumber(row, ['Omzet', 'Revenue'], soldQty * unitPrice);
    const cost = rowNumber(row, ['HPP/Modal Terjual', 'Modal Terjual', 'Cost'], soldQty * product.costPrice);
    const profit = rowNumber(row, ['Laba', 'Profit'], revenue - cost);

    return {
      id: fieldText(row, ['ID Penjualan'], uid('sale')),
      businessId,
      productId: product.id,
      locationId,
      locationName,
      productionQty,
      soldQty,
      remainingQty: rowNumber(row, ['Sisa Produksi', 'Sisa'], Math.max(productionQty - soldQty, 0)),
      unitPrice,
      revenue,
      cost,
      profit,
      proofUrl: fieldText(row, ['URL Bukti', 'Bukti URL'], ''),
      soldAt: parseDate(fieldText(row, ['Tanggal Penjualan', 'Tanggal']), now()),
      createdAt: parseDate(fieldText(row, ['Dibuat']), now()),
      updatedAt: parseDate(fieldText(row, ['Diupdate']), now()),
      deletedAt: deletedAtFrom(row)
    };
  }).filter((sale) => sale.productId && sale.soldQty >= 0);

  const stockMovements: StockMovement[] = stockRows.map((row) => {
    const businessId = ensureBusiness(fieldText(row, ['Bisnis', 'ID Bisnis']));
    const product = ensureProduct(fieldText(row, ['Produk', 'Nama Produk', 'ID Produk']), fieldText(row, ['SKU Produk', 'SKU']), businessId);
    return {
      id: fieldText(row, ['ID Movement', 'ID Stok'], uid('mov')),
      businessId,
      productId: product.id,
      type: stockTypeValue(fieldText(row, ['Tipe', 'Type'])),
      qty: rowNumber(row, ['Qty', 'Jumlah'], 0),
      note: fieldText(row, ['Catatan', 'Note'], ''),
      refType: fieldText(row, ['Referensi Tipe', 'Ref Type'], ''),
      refId: fieldText(row, ['Referensi ID', 'Ref ID'], ''),
      createdAt: parseDate(fieldText(row, ['Tanggal', 'Dibuat']), now())
    };
  }).filter((movement) => movement.productId);

  const notifications: NotificationItem[] = notificationRows.map((row) => ({
    id: fieldText(row, ['ID Notifikasi'], uid('notif')),
    businessId: ensureBusiness(fieldText(row, ['Bisnis', 'ID Bisnis'])),
    title: fieldText(row, ['Judul'], 'Notifikasi'),
    message: fieldText(row, ['Pesan'], ''),
    type: notificationTypeValue(fieldText(row, ['Tipe'])),
    isRead: boolValue(get(row, 'Sudah Dibaca'), false),
    createdAt: parseDate(fieldText(row, ['Tanggal', 'Dibuat']), now())
  })).filter((notification) => notification.title.trim());

  const activeBusinessId = businesses.find((business) => !business.deletedAt)?.id || businesses[0]?.id || '';

  const payload: FullImportPayload = {
    user,
    businesses,
    locations,
    products,
    capitals,
    sales,
    stockMovements,
    notifications,
    activeBusinessId
  };

  return {
    payload,
    stats: {
      businesses: businesses.length,
      locations: locations.length,
      products: products.length,
      capitals: capitals.length,
      capitalItems: capitalItemCount,
      sales: sales.length,
      stockMovements: stockMovements.length,
      notifications: notifications.length
    },
    warnings
  };
}

export async function parseAllDataExcelFile(file: File) {
  const text = await file.text();
  return parseAllDataExcelText(text);
}
