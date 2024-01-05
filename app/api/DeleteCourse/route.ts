import { CLO, Course } from "@app/page";
import { PrismaClient } from "@prisma/client";
import { connectToDb } from "@utils";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  console.log("in delete function...");

  try {
    await connectToDb();

    const item = request.json().then(async (body) => {
      const id = body.id;
      console.log("ID to delete:", id);

      // Check if the course with the same ID  exists
      const course = await prisma.course.findUnique({
        where: {
          id: id,
        },
      });

      if (course) {
        //   first delete the related clos
        await prisma.cLO.deleteMany({
          where: {
            CourseId: id,
          },
        });

        await prisma.course.delete({
          where: {
            id: id,
          },
        });
      }
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
