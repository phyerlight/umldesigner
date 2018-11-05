export function exists(...v) {
  return v.every(v => v != null && v != undefined);
}