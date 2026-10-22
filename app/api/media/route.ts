import { currentUser, sameOrigin } from "@/lib/auth";
import { storeLogo } from "@/lib/media";
import { InputError } from "@/lib/validation";
export async function POST(request: Request) {
  if ((await currentUser())?.role !== "admin")
    return Response.json({ error: "Sin permiso." }, { status: 403 });
  try {
    sameOrigin(request);
    if (Number(request.headers.get("content-length")) > 2200000)
      throw new InputError("Archivo demasiado grande.");
    const data = await request.formData();
    const file = data.get("logo");
    if (!(file instanceof File)) throw new InputError("Selecciona una imagen.");
    return Response.json({ id: await storeLogo(file) });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof InputError
            ? error.message
            : "No se pudo guardar el logo.",
      },
      { status: 400 },
    );
  }
}
