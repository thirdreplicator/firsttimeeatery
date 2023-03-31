export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const name = body.name;

    const params = {
      name: "David",
      email: "thirdreplicator@gmail.com",
      password: "abc123",
      phone_number: "+63-977-362-1506"
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
    return new Response(JSON.stringify({
      message: "Your name was: " + name
    }), {
      status: 200
    })
  } else {
    return new Response(JSON.stringify({ message: "Oops!" }), { status: 400 });
  }

}
