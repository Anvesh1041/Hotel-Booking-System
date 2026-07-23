import { NextResponse } from "next/server";
import { getAllUsers,createUser,deleteUserById } from "@/db/queries/users";

export async function GET(){
  try {
    const data= await getAllUsers();

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await createUser(name, email);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const {searchParams} = new URL(req.url)
    const user_id = Number(searchParams.get("user_id"))

    if (!user_id) {
      return NextResponse.json(
        { success: false, message:"user_id required"},
        { status: 400 }
      )
    }
    const result = await deleteUserById(user_id)
    return NextResponse.json({ success: true, data: result });
  }
  catch (err) {
    return NextResponse.json(
      { success: false, error:err},
      { status: 500 }
    )
  }
}