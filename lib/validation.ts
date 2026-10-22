export class InputError extends Error {}
export function text(
  value: unknown,
  label: string,
  max = 120,
  optional = false,
) {
  if (
    typeof value !== "string" ||
    (!optional && !value.trim()) ||
    value.length > max
  )
    throw new InputError(
      `${label}: valor inválido (máximo ${max} caracteres).`,
    );
  return value.trim();
}
export function integer(
  value: unknown,
  label: string,
  min = 1,
  max = 2147483647,
) {
  const n = Number(value);
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    !Number.isInteger(n) ||
    n < min ||
    n > max
  )
    throw new InputError(`${label}: número inválido.`);
  return n;
}
export function email(value: unknown) {
  const result = text(value, "Correo", 190).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result))
    throw new InputError("Correo inválido.");
  return result;
}
export function password(value: unknown) {
  if (typeof value !== "string" || value.length < 10 || value.length > 128)
    throw new InputError("La contraseña debe tener entre 10 y 128 caracteres.");
  return value;
}
export function choice(value: unknown, options: string[], label: string) {
  if (typeof value !== "string" || !options.includes(value))
    throw new InputError(`${label}: opción inválida.`);
  return value;
}
