import type { Business, CapitalRecord, NotificationItem, Product, SaleLocation, SalesRecord, StockMovement, UserProfile } from '@/types';

export function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? '')).join(','))
  ].join('\n');
  downloadBlob(filename, csv, 'text/csv;charset=utf-8;');
}

export interface FullExportData {
  user?: UserProfile | null;
  businesses: Business[];
  locations: SaleLocation[];
  products: Product[];
  capitals: CapitalRecord[];
  sales: SalesRecord[];
  stockMovements: StockMovement[];
  notifications: NotificationItem[];
}

type SpreadsheetRow = Record<string, string | number | boolean | null | undefined>;

const EXPORT_NOTE = 'Data ini berasal dari penyimpanan lokal browser pada device ini. Untuk penyimpanan permanen multi-device, sambungkan aplikasi ke Supabase/PostgreSQL.';

function downloadBlob(filename: string, content: BlobPart, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeXml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function safeSheetName(name: string) {
  return name.replace(/[\\/?*\[\]:]/g, ' ').slice(0, 31) || 'Sheet';
}

function statusLabel(item: { deletedAt?: string | null; isActive?: boolean }) {
  if (item.deletedAt) return 'Dihapus';
  if (item.isActive === false) return 'Nonaktif';
  return 'Aktif';
}

function toDateText(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function toNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function cell(value: SpreadsheetRow[keyof SpreadsheetRow], styleId?: string) {
  const style = styleId ? ` ss:StyleID="${styleId}"` : '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<Cell${style}><Data ss:Type="Number">${value}</Data></Cell>`;
  }
  const normalized = typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value ?? '';
  return `<Cell${style}><Data ss:Type="String">${escapeXml(normalized)}</Data></Cell>`;
}

function worksheet(name: string, rows: SpreadsheetRow[]) {
  const headers = Array.from(rows.reduce<Set<string>>((set, row) => {
    Object.keys(row).forEach((key) => set.add(key));
    return set;
  }, new Set<string>()));

  const tableRows = rows.length
    ? [
        `<Row>${headers.map((header) => cell(header, 'Header')).join('')}</Row>`,
        ...rows.map((row) => `<Row>${headers.map((header) => cell(row[header], typeof row[header] === 'number' ? 'Number' : undefined)).join('')}</Row>`)
      ]
    : [`<Row>${cell('Keterangan', 'Header')}</Row>`, `<Row>${cell('Belum ada data pada sheet ini.')}</Row>`];

  const columnCount = rows.length ? headers.length : 1;
  const columns = Array.from({ length: columnCount }, () => '<Column ss:AutoFitWidth="0" ss:Width="150"/>').join('');

  return `
    <Worksheet ss:Name="${escapeXml(safeSheetName(name))}">
      <Table>
        ${columns}
        ${tableRows.join('')}
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <FreezePanes/>
        <FrozenNoSplit/>
        <SplitHorizontal>1</SplitHorizontal>
        <TopRowBottomPane>1</TopRowBottomPane>
        <ActivePane>2</ActivePane>
      </WorksheetOptions>
    </Worksheet>`;
}

function createExcelXml(sheets: { name: string; rows: SpreadsheetRow[] }[]) {
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Manajemen Bisnis</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="Aptos" ss:Size="11" ss:Color="#1E293B"/>
    </Style>
    <Style ss:ID="Header">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="Aptos" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#5F7F68" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
    </Style>
    <Style ss:ID="Number">
      <NumberFormat ss:Format="#,##0"/>
    </Style>
  </Styles>
  ${sheets.map((sheet) => worksheet(sheet.name, sheet.rows)).join('')}
</Workbook>`;
}

export function buildAllDataRows(data: FullExportData) {
  const businessById = new Map(data.businesses.map((item) => [item.id, item]));
  const productById = new Map(data.products.map((item) => [item.id, item]));
  const locationById = new Map(data.locations.map((item) => [item.id, item]));

  const capitalItems = data.capitals.flatMap((capital) => capital.items.map((item, index) => ({
    'ID Modal': capital.id,
    'Judul Modal': capital.title,
    'Bisnis': businessById.get(capital.businessId)?.name || capital.businessId,
    'Tanggal Modal': toDateText(capital.recordedAt),
    'Kategori Modal': capital.category,
    'No Item': index + 1,
    'Nama Item': item.name,
    'Qty': item.qty,
    'Satuan': item.unit,
    'Harga Satuan': item.price,
    'Subtotal': item.subtotal,
    'URL Nota': capital.noteUrl || '',
    'Status': statusLabel(capital)
  })));

  const summaryRows: SpreadsheetRow[] = [
    { 'Keterangan': 'Nama file', 'Nilai': 'Backup Semua Data Manajemen Bisnis' },
    { 'Keterangan': 'Waktu export', 'Nilai': toDateText(new Date().toISOString()) },
    { 'Keterangan': 'User', 'Nilai': data.user ? `${data.user.name} (${data.user.email})` : 'Belum login' },
    { 'Keterangan': 'Catatan penting', 'Nilai': EXPORT_NOTE },
    { 'Keterangan': 'Total bisnis', 'Nilai': data.businesses.length },
    { 'Keterangan': 'Total toko/lokasi', 'Nilai': data.locations.length },
    { 'Keterangan': 'Total produk', 'Nilai': data.products.length },
    { 'Keterangan': 'Total catatan modal', 'Nilai': data.capitals.length },
    { 'Keterangan': 'Total detail item modal', 'Nilai': capitalItems.length },
    { 'Keterangan': 'Total penjualan', 'Nilai': data.sales.length },
    { 'Keterangan': 'Total riwayat stok', 'Nilai': data.stockMovements.length },
    { 'Keterangan': 'Total notifikasi', 'Nilai': data.notifications.length }
  ];

  const readmeRows: SpreadsheetRow[] = [
    { 'Bagian': 'Sumber data', 'Keterangan': 'Semua data diambil dari localStorage browser yang sedang dipakai saat tombol export ditekan.' },
    { 'Bagian': 'Cakupan', 'Keterangan': 'File ini berisi semua bisnis, toko/lokasi, produk, modal, item modal, penjualan, stok, dan notifikasi yang ada di device ini.' },
    { 'Bagian': 'Backup', 'Keterangan': 'Simpan file ini sebagai cadangan manual sebelum reset demo, ganti browser, atau clear cache.' },
    { 'Bagian': 'Batasan', 'Keterangan': 'Versi ini belum memiliki tombol import ulang otomatis dari Excel. Data online permanen perlu Supabase/PostgreSQL.' },
    { 'Bagian': 'Status data', 'Keterangan': 'Kolom Status menunjukkan Aktif, Nonaktif, atau Dihapus sesuai soft delete di aplikasi.' }
  ];

  const userRows: SpreadsheetRow[] = data.user ? [{
    'ID User': data.user.id,
    'Nama': data.user.name,
    'Email': data.user.email,
    'Role': data.user.role,
    'Avatar URL': data.user.avatarUrl || ''
  }] : [];

  const businessRows: SpreadsheetRow[] = data.businesses.map((business) => ({
    'ID Bisnis': business.id,
    'Nama Bisnis': business.name,
    'Kategori': business.category,
    'Deskripsi': business.description || '',
    'Alamat': business.address || '',
    'Mata Uang': business.currency,
    'Logo URL': business.logoUrl || '',
    'Dibuat': toDateText(business.createdAt),
    'Diupdate': toDateText(business.updatedAt),
    'Dihapus': toDateText(business.deletedAt || ''),
    'Status': statusLabel(business)
  }));

  const locationRows: SpreadsheetRow[] = data.locations.map((location) => ({
    'ID Toko': location.id,
    'Bisnis': businessById.get(location.businessId)?.name || location.businessId,
    'Nama Toko/Lokasi': location.name,
    'Alamat': location.address || '',
    'Telepon': location.phone || '',
    'PIC/Penanggung Jawab': location.managerName || '',
    'Jam Operasional': location.openingHours || '',
    'Target Omzet Harian': location.targetDailyRevenue || 0,
    'Catatan Harga/Lokasi': location.priceNote || '',
    'Aktif': location.isActive !== false,
    'Dibuat': toDateText(location.createdAt),
    'Diupdate': toDateText(location.updatedAt),
    'Dihapus': toDateText(location.deletedAt || ''),
    'Status': statusLabel(location)
  }));

  const productRows: SpreadsheetRow[] = data.products.map((product) => ({
    'ID Produk': product.id,
    'Bisnis': businessById.get(product.businessId)?.name || product.businessId,
    'Nama Produk': product.name,
    'SKU': product.sku,
    'Barcode': product.barcode || '',
    'Kategori': product.category,
    'Satuan': product.baseUnit,
    'Harga Modal': product.costPrice,
    'Harga Jual': product.sellingPrice,
    'Margin Nominal': product.sellingPrice - product.costPrice,
    'Margin %': product.sellingPrice ? Number((((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(2)) : 0,
    'Stok Saat Ini': product.stock,
    'Minimum Stok': product.minStock,
    'Peringatan Stok': product.stock <= product.minStock ? 'Ya' : 'Tidak',
    'Foto URL': product.photoUrl || '',
    'Dibuat': toDateText(product.createdAt),
    'Diupdate': toDateText(product.updatedAt),
    'Dihapus': toDateText(product.deletedAt || ''),
    'Status': statusLabel(product)
  }));

  const capitalRows: SpreadsheetRow[] = data.capitals.map((capital) => ({
    'ID Modal': capital.id,
    'Bisnis': businessById.get(capital.businessId)?.name || capital.businessId,
    'Judul': capital.title,
    'Kategori': capital.category,
    'Total Modal': capital.totalAmount,
    'Jumlah Item': capital.items.length,
    'Tanggal Modal': toDateText(capital.recordedAt),
    'URL Nota': capital.noteUrl || '',
    'Dibuat': toDateText(capital.createdAt),
    'Diupdate': toDateText(capital.updatedAt),
    'Dihapus': toDateText(capital.deletedAt || ''),
    'Status': statusLabel(capital)
  }));

  const salesRows: SpreadsheetRow[] = data.sales.map((sale) => {
    const product = productById.get(sale.productId);
    const location = sale.locationId ? locationById.get(sale.locationId) : undefined;
    return {
      'ID Penjualan': sale.id,
      'Bisnis': businessById.get(sale.businessId)?.name || sale.businessId,
      'Produk': product?.name || sale.productId,
      'SKU Produk': product?.sku || '',
      'Toko/Lokasi': location?.name || sale.locationName,
      'Produksi Masuk': sale.productionQty,
      'Jumlah Terjual': sale.soldQty,
      'Sisa Produksi': sale.remainingQty,
      'Harga Jual/Unit': sale.unitPrice,
      'Omzet': sale.revenue,
      'HPP/Modal Terjual': sale.cost,
      'Laba': sale.profit,
      'Margin %': sale.revenue ? Number(((sale.profit / sale.revenue) * 100).toFixed(2)) : 0,
      'Tanggal Penjualan': toDateText(sale.soldAt),
      'URL Bukti': sale.proofUrl || '',
      'Dibuat': toDateText(sale.createdAt),
      'Diupdate': toDateText(sale.updatedAt),
      'Dihapus': toDateText(sale.deletedAt || ''),
      'Status': statusLabel(sale)
    };
  });

  const stockRows: SpreadsheetRow[] = data.stockMovements.map((movement) => ({
    'ID Movement': movement.id,
    'Bisnis': businessById.get(movement.businessId)?.name || movement.businessId,
    'Produk': productById.get(movement.productId)?.name || movement.productId,
    'SKU Produk': productById.get(movement.productId)?.sku || '',
    'Tipe': movement.type,
    'Qty': movement.qty,
    'Catatan': movement.note || '',
    'Referensi Tipe': movement.refType || '',
    'Referensi ID': movement.refId || '',
    'Tanggal': toDateText(movement.createdAt)
  }));

  const notificationRows: SpreadsheetRow[] = data.notifications.map((notification) => ({
    'ID Notifikasi': notification.id,
    'Bisnis': businessById.get(notification.businessId)?.name || notification.businessId,
    'Judul': notification.title,
    'Pesan': notification.message,
    'Tipe': notification.type,
    'Sudah Dibaca': notification.isRead,
    'Tanggal': toDateText(notification.createdAt)
  }));

  return {
    summaryRows,
    readmeRows,
    userRows,
    businessRows,
    locationRows,
    productRows,
    capitalRows,
    capitalItems,
    salesRows,
    stockRows,
    notificationRows
  };
}

export function exportAllDataExcel(data: FullExportData) {
  const rows = buildAllDataRows(data);
  const fileDate = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
  const filename = `manajemen-bisnis-semua-data-${fileDate}.xls`;
  const workbook = createExcelXml([
    { name: 'Ringkasan', rows: rows.summaryRows },
    { name: 'Keterangan', rows: rows.readmeRows },
    { name: 'User', rows: rows.userRows },
    { name: 'Bisnis', rows: rows.businessRows },
    { name: 'Toko Lokasi', rows: rows.locationRows },
    { name: 'Produk', rows: rows.productRows },
    { name: 'Modal', rows: rows.capitalRows },
    { name: 'Detail Item Modal', rows: rows.capitalItems },
    { name: 'Penjualan', rows: rows.salesRows },
    { name: 'Riwayat Stok', rows: rows.stockRows },
    { name: 'Notifikasi', rows: rows.notificationRows }
  ]);

  downloadBlob(filename, workbook, 'application/vnd.ms-excel;charset=utf-8;');
  return filename;
}

export function getFullExportCount(data: FullExportData) {
  return data.businesses.length + data.locations.length + data.products.length + data.capitals.length + data.sales.length + data.stockMovements.length + data.notifications.length;
}
