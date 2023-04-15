export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") != "application/json") {
    return new Response(JSON.stringify({ message: "Oops! Need to send JSON" }), { status: 400 })
  }

  const body = await request.json()

  let json = JSON.stringify(body)
  let response = await fetch("http://localhost:4000/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: json,
  });

  return response
}
