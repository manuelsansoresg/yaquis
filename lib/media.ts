import { randomUUID } from "node:crypto";
import { execute } from "./db";
import { InputError } from "./validation";
export async function storeLogo(file: File) {
  if (file.size > 2 * 1024 * 1024)
    throw new InputError("El logo debe pesar máximo 2 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  let mime = "";
  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    mime = "image/png";
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
    mime = "image/jpeg";
  else if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  )
    mime = "image/webp";
  if (!mime) throw new InputError("Selecciona un logo PNG, JPG o WebP.");
  const id = randomUUID();
  await execute("INSERT INTO media(id,mime,content) VALUES (?,?,?)", [
    id,
    mime,
    buffer,
  ]);
  return id;
}
