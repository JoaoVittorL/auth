import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod";

// Define a schem for input validation

const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

// CODIGO PARA VERIFICAR A EXISTENCIA DE USER
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "Esse email já existe!",
        },
        { status: 409 }
      );
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          user: null,
          message: "Esse user já existe!",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10); // Use bcrypt para criar um hash seguro da senha

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword, // Salve a senha hashada no banco de dados
      },
    });

    // Forma de sugrança par anão enviar a senha cript
    const { password: newUserPassword, ...rest } = newUser;
    // Forma de sugrança par anão enviar a senha cript

    return NextResponse.json({ user: rest, message: "User created" });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      {
        user: null,
        message:
          "Erro ao criar usuário. Por favor, tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
