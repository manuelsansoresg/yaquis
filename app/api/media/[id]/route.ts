import { rows } from "@/lib/db";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [file] = await rows<{ mime: string; content: Buffer }>(
    "SELECT mime,content FROM media WHERE id=?",
    [id],
  );
  if (!file) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(file.content), {
    headers: {
      "Content-Type": file.mime,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
