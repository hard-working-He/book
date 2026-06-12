export function sanitizeText(input: FormDataEntryValue | string | null | undefined) {
  const value = String(input ?? "").trim();
  return value.replace(/<[^>]*>/g, "");
}

export function sanitizeNumber(input: FormDataEntryValue | string | number | null | undefined) {
  const numeric = Number(input ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}
