import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Retrieve cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt");

  // If no token, respond with Unauthorized status
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { value } = token;
  const secret = process.env.JWT_SECRET || "";

  try {
    // Verify JWT token
    const user = verify(value, secret);

    // Return user data and JWT if valid
    const response = {
      user: user,
      jwt: value
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    // Handle token verification failure
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}
