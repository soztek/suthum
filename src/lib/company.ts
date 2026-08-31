/**
 * Firma / yasal bilgiler (vergi levhasından).
 * Değişirse burayı güncellemen yeterli; footer ve tüm sözleşmeler buradan besleniyor.
 */
export const COMPANY = {
  legalName: "SÜT-HÜM SÜT ÜRÜNLERİ",
  owner: "Onur Işık",
  type: "Şahıs İşletmesi",
  taxOffice: "Göle Vergi Dairesi",
  taxNo: "53836714276", // Vergi/TC Kimlik No — gizlilik istenirse boş bırakılabilir
  address: "Kubilay Bey Mah. Oltu Cad. No: 7/A, Göle / ARDAHAN",
  activity: "Süt ve Süt Ürünleri Perakende Ticareti",
  mersis: "", // varsa MERSİS no
} as const;
