import { NextResponse } from "next/server";

const jwt = `uhorn:${process.env.API_SECRET}`;

export async function middleware(request) {
	const auth = await request.headers.get("authorization");
	const token = atob(auth.split(" ")[1]);

	if (jwt !== token) {
		return NextResponse.json({ success: false, message: "authentication failed" }, { status: 401 });
	}
}

export const config = {
	matcher: "/api/:path*",
};
