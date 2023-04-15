// delivery_addresses.ts

import type { APIRoute } from '@astrojs/parser';
import type { ServerRequest } from '@astrojs/runtime';

export const get: APIRoute = async ({ request }: { request: ServerRequest }) => {
  // Extract the token from the incoming request headers
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Forward the request with the token to the Express server
  let response = await fetch('http://localhost:4000/api/delivery_addresses', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const responseBody = await response.text();

  return new Response(responseBody, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};