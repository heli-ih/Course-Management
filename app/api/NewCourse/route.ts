import { CLO, Course } from "@app/page";
import { PrismaClient } from "@prisma/client";
import { connectToDb } from "@utils";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log("in Post function...");

  try {
    await connectToDb();

    const item = request.json().then(async (body) => {
      const id = body.data.id;
      const name = body.data.name;
      const clos = body.data.CLOs;

      console.log("ID:", id);
      console.log("Name:", name);
      console.log("CLOs:", clos);

      // Check if the course with the same ID already exists
      const existingCourse = await prisma.course.findUnique({
        where: {
          name: name,
        },
      });

      if (!existingCourse) {
        const createdCourse = await prisma.course.create({
          data: {
            id: id,
            name: name,
            CLOs: {
              create: clos.map((clo: CLO) => ({
                id: clo.id,
                name: clo.name,
                description: clo.description,
              })),
            },
          },
          include: {
            CLOs: true,
          },
        });
      }
    });
    return NextResponse.json({ data: item }, { status: 201 });
    console.log(item);
  } catch (error) {
    // Handle any JSON parsing errors or database errors
    console.log("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
