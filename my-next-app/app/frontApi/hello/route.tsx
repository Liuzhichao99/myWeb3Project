// app/frontApi/hello/route.tsx
export async function GET() {
    return Response.json({ message: 'Hello Next.js!' });
}