import { CLO, Course } from "@app/page";
import { PrismaClient } from "@prisma/client";
import { connectToDb } from "@utils";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  console.log("in update function...");

  try {
    await connectToDb();

    const item = request.json().then(async (body) => {
      const id = body.data.id;
      const newName = body.data.name;
      const newCLOs = body.data.CLOs;

      console.log("ID to update:", id);
      console.log("Name:", newName);
      console.log("CLOs:", newCLOs);

      await prisma.course.update({
        where: { id: id },
        data: {
          name: newName,
          CLOs: {
            update: newCLOs.map((newC: CLO) => ({
              where: { id: newC.id },
              data: {
                name: newC.name,
                description: newC.description,
              },
            })),
          },
        },
      });
    });
    return NextResponse.json({ data: item }, { status: 201 });
    console.log(item);
  } catch (error) {
    console.log("Error deleting course and CLOs:", error);
    return NextResponse.json(
      { error: "Failed to delete course and CLOs" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
