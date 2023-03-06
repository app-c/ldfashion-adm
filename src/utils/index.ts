export function currency(e: string) {
  let value = e;

  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1,$2");

  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
  return value;
}

export function number(e: string) {
  let value = e;

  value = value.replace(/\D/g, "");
  return value;
}
