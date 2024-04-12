import { NextResponse } from "next/server";

const jwt = `uhorn:${process.env.API_SECRET}`;

export async function middleware(request) {
	const res = NextResponse.next();

	// add the CORS headers to the response
	res.headers.append("Access-Control-Allow-Credentials", "true");
	res.headers.append("Access-Control-Allow-Origin", "*"); // replace this your actual origin
	res.headers.append("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
	res.headers.append(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
	);

	const auth = await request.headers.get("authorization");
	const token = atob(auth.split(" ")[1]);

	if (jwt !== token) {
		return NextResponse.json({ success: false, message: "authentication failed" }, { status: 401 });
	}

	return res;
}

export const config = {
	matcher: "/api/:path*",
};
