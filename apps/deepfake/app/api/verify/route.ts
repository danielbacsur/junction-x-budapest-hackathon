import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { url } = (await req.json()) as {
    url: string;
  };

  if (!url) {
    return new NextResponse("URL not found.", { status: 400 });
  }

  const { tags } = (await fetch(`${req.nextUrl.origin}/api/flask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
    }),
  }).then((res) => res.json())) as {
    tags: { timestamp: number; type: string }[];
  };

  return NextResponse.json({ tags });
}
