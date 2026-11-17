import { NextResponse } from "next/server";

async function proxy(request, { params }) {
  try {
    const { path } = await params;

    const backendURL = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!backendURL) {
      return NextResponse.json(
        { message: "Backend URL is not configured" },
        { status: 500 },
      );
    }

    // Build the original backend URL
    const pathname = path.map(encodeURIComponent).join("/");
    const search = new URL(request.url).search;

    const targetURL = `${backendURL}/${pathname}${search}`;

    // Forward necessary headers, including the login cookie
    const headers = new Headers();

    ["content-type", "authorization", "cookie"].forEach((key) => {
      const value = request.headers.get(key);
      if (value) headers.set(key, value);
    });

    const options = {
      method: request.method,
      headers,
      cache: "no-store",
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      options.body = await request.arrayBuffer();
    }

    // Send request to Express
    const response = await fetch(targetURL, options);

    const responseHeaders = new Headers();

    const contentType = response.headers.get("content-type");

    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend Proxy Error:", error);

    return NextResponse.json(
      { message: "Backend request failed" },
      { status: 500 },
    );
  }
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as HEAD,
};
