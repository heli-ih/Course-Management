"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { CourseList } from "@components/CourseList";
import { PrismaClient } from "@prisma/client";
import Spreadsheet from "@components/Spreadsheet";
const prisma = new PrismaClient();

export interface Course {
  id: string;
  name: string;
  CLOs: CLO[];
}

export interface CLO {
  id: string;
  name: string;
  description: string;
}
export interface Row {
  __rowNum__: number;
  Course: string;
  CLO: string;
  Description: string;
}

export interface Column {
  key: string;
  label: string;
}

const Page: React.FC = () => {
  const [CourseName, setCourseName] = useState<string>("");
  const [CoursesList, setCoursesList] = useState<Course[]>([]);
  const [CLOName, setCLOName] = useState<string>("");
  const [CLODescription, setCLODescription] = useState<string>("");
  const [CLOsList, setCLOsList] = useState<CLO[]>([]);
  const [open, setOpen] = useState<Boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [data, setData] = useState<Row[]>([]);
  const [shouldRenderTable, setShouldRenderTable] = useState<Boolean>(false);

  const handleAddCourse = async () => {
    if (!CourseName) return null;

    const newCourse: Course = {
      id: uuidv4(),
      name: CourseName,
      CLOs: CLOsList,
    };

    try {
      console.log("sending...");
      await postToDB(newCourse);
    } catch (error) {
      console.log(newCourse);
      console.error("Failed to create course:", error);
    }

    setCoursesList((prevCourses) => [...prevCourses, newCourse]);
    setCourseName("");
    setCLOName("");
    setCLODescription("");
    setCLOsList([]);
  };

  async function postToDB(data: Course) {
    console.log("in postToDB...");

    const response = await fetch("/api/NewCourse", {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  const handleAddCLO = () => {
    if (!CLOName || !CLODescription) return null;

    const newCLO: CLO = {
      id: uuidv4(),
      name: CLOName,
      description: CLODescription,
    };

    setCLOName("");
    setCLODescription("");
    setCLOsList((prevCLOs) => [...prevCLOs, newCLO]);
  };

  const handleReset = () => {
    setCourseName("");
    setCLOName("");
    setCLODescription("");
    setCLOsList([]);
  };

  async function deleteFromDB(id: string) {
    await fetch("/api/DeleteCourse", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      console.log("deleting course...");
      console.log(id);
      await deleteFromDB(id);
    } catch (error) {
      console.error("Failed to delete course:", error);
    }

    setCoursesList(CoursesList.filter((c) => c.id != id));
  };

  const handleDeleteTable = async (courseNames: string[]) => {
    try {
      console.log("deleting table...");
      console.log(courseNames);
      for (const cName of courseNames) {
        let idToDelete = "";
        CoursesList.find((c) => {
          c.name === cName ? (idToDelete = c.id) : null;
        });
        await deleteFromDB(idToDelete);
        // deleting from the course list
        setCoursesList((prevCoursesList) =>
          prevCoursesList.filter((c) => c.id != idToDelete)
        );
      }
    } catch (error) {
      console.error("Failed to delete table:", error);
    }
  };

  async function updateDB(data: Course) {
    console.log("in updateDB...");
    console.log(data);

    const response = await fetch("/api/UpdateCourse", {
      method: "PATCH",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const handleClose = async (selectedItem: Course) => {
    console.log(CoursesList);
    setOpen(!open);
    await updateDB(selectedItem);
  };

  function handleCourseEdit(editedCourseName: string) {
    CoursesList.map((c) =>
      c.id === selectedCourse ? (c.name = editedCourseName) : c
    );
  }

  function handleEditedCLOName(index: number, editedCLOName: string) {
    CoursesList[index];
    CoursesList.find((c) => {
      c.id === selectedCourse ? (c.CLOs[index].name = editedCLOName) : c;
    });
  }

  function handleEditedCLODescription(
    index: number,
    editedCLODescription: string
  ) {
    CoursesList.find((c) => {
      c.id === selectedCourse
        ? (c.CLOs[index].description = editedCLODescription)
        : c;
    });
  }

  function handlePostToDB(course: Course) {
    postToDB(course);
  }

  return (
    <main>
      <section className="flex flex-row absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-[50%] min-w-[90%] bg-gray-300 rounded-lg ">
        <Input
          CourseName={CourseName}
          setCourseName={setCourseName}
          CLOName={CLOName}
          setCLOName={setCLOName}
          CLODescription={CLODescription}
          CLOsList={CLOsList}
          setCLODescription={setCLODescription}
          handleAddCLO={handleAddCLO}
          handleAddCourse={handleAddCourse}
          handleReset={handleReset}
        />

        <CourseList
          CoursesList={CoursesList}
          handleDeleteCourse={handleDeleteCourse}
          setSelectedCourse={setSelectedCourse}
          open={open}
          setOpen={setOpen}
        >
          <Modal
            open={open}
            handleClose={handleClose}
            handleAddCourse={handleAddCourse}
            selectedCourse={selectedCourse}
            CoursesList={CoursesList}
            handleCourseEdit={handleCourseEdit}
            handleEditedCLOName={handleEditedCLOName}
            handleEditedCLODescription={handleEditedCLODescription}
          />
        </CourseList>

        <Spreadsheet
          data={data}
          setData={setData}
          setCoursesList={setCoursesList}
          handlePostToDB={handlePostToDB}
          handleDeleteTable={handleDeleteTable}
        />
      </section>
    </main>
  );
};

export default Page;
