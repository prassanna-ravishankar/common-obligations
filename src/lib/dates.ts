// Dates on this site describe publication, disclosure or signing, never retrieval.
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(
    `${iso.length === 7 ? `${iso}-01` : iso}T12:00:00Z`,
  ).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

export const day = (iso: string) =>
  fmt(iso, { day: "numeric", month: "long", year: "numeric" });
export const shortDay = (iso: string) =>
  fmt(iso, { day: "numeric", month: "short", year: "numeric" });
export const month = (iso: string) =>
  fmt(iso, { month: "long", year: "numeric" });
