import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("jwt");

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { value } = token;


  const secret = process.env.JWT_SECRET || "";

  try {
    const user=verify(value, secret);

    const response = {
      user: user,
      jwt:value
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}