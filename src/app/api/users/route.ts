import { NextResponse } from "next/server";
import { getAllUsers,createUser,deleteUserById } from "@/db/queries/users";
import { isValidUser } from "@/utils/validators";
import { hashPassword } from "@/services/password.service";

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

    const validation= isValidUser(body)

    if (!validation.success) {
      return NextResponse.json(
        validation,
        { status: 400 }
      );
    }
    const { name, email, password }= validation.data
    const passwordHash= await hashPassword(password)
    await createUser(name,email,passwordHash)
    return NextResponse.json({ success: true, message: "User created successfully" });
  } catch (err:any) {
    if (err?.cause?.code === "23505") {
        return NextResponse.json(
            {
                success: false,
                message: "Email already exists"
            },
            { status: 409 }
        );
    }
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