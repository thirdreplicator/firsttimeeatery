export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") != "application/json") {
    return new Response(JSON.stringify({ message: "Oops!" }), { status: 400 })
  }

  const body = await request.json();
  const name = body.name
  const email = body.email
  const password = body.password

  const params = {
    name: name,
    email: email,
    password: password
  }

  let json = JSON.stringify(params)
  let response = await fetch("http://localhost:4000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: json,
  });

  return response
}
