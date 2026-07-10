// Matches a query against vehicle number, customer mobile, or service date
// (accepts either a locale date string like "9/7/2026" or an ISO date like "2026-07-09").
export const matchesSearch = (item, query) => {
  if (!query || !query.trim()) return true;
  const q = query.trim().toLowerCase();

  const vehicleNumber = (item.vehicleNumber || '').toLowerCase();
  const customerMobile = (item.customerMobile || '').toLowerCase();

  // service cards store the date on item.appointment.serviceDate; appointments store it directly
  const rawDate = item.serviceDate || item.appointment?.serviceDate;
  const localeDate = rawDate ? new Date(rawDate).toLocaleDateString().toLowerCase() : '';
  const isoDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : '';

  return (
    vehicleNumber.includes(q) ||
    customerMobile.includes(q) ||
    localeDate.includes(q) ||
    isoDate.includes(q)
  );
};