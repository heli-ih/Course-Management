import React, { SetStateAction, useEffect, useState } from "react";
import { Course, CLO, Row, Column } from "@app/page";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

interface SpreadsheetProps {
  data: Row[];
  setData: (data: Row[]) => void;
  setCoursesList: (value: SetStateAction<Course[]>) => void;
  handlePostToDB: (course: Course) => void;
  handleDeleteTable: (courseName: string[]) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({
  data,
  setData,
  setCoursesList,
  handlePostToDB,
  handleDeleteTable,
}) => {
  const [shouldRenderTable, setShouldRenderTable] = useState<Boolean>(false);

  // reading the spreadsheet
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsBinaryString(e.target.files[0]);
      reader.onload = (e) => {
        if (e.target) {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json<Row>(sheet);
          setData(parsedData);
          setShouldRenderTable(true);
        }
      };
    }
  };

  // extracting rows
  const rows: Row[] = data;

  // make a new dict of unique courses as keys and list of cloa as value
  const courseMapping: { [key: string]: Row[] } = {};

  rows.map((tr) => {
    const { Course } = tr;
    if (!courseMapping[Course]) {
      courseMapping[Course] = [];
    }
    courseMapping[Course].push(tr);
  });

  if (shouldRenderTable) {
    // Object.keys(courseMap) extracts an array of keys(unique course names) from the courseMapping
    const apiRequests = Object.keys(courseMapping).map(async (uniqueCourse) => {
      const uniqueCourseCLOs = courseMapping[uniqueCourse];
      const cloList = [];

      // relating all the clos of a course to it's name
      for (const row of uniqueCourseCLOs) {
        const { CLO, Description } = row;
        const newCLO = {
          id: uuidv4(),
          name: CLO,
          description: Description,
        };
        cloList.push(newCLO);
      }

      const newCourse = {
        id: uuidv4(),
        name: uniqueCourse,
        CLOs: cloList,
      };

      // add the course to the list
      setCoursesList((prevCourses: Course[]) => [...prevCourses, newCourse]);
      console.log(newCourse);

      // make a post
      return handlePostToDB(newCourse);
    });

    // Parallel Execution / Improved Performance / Coordination / Error Handling
    Promise.all(apiRequests)
      .then((results) => {
        console.log("All API calls completed:", results);
      })
      .catch((error) => {
        console.error("Error in API calls:", error);
      });
    setShouldRenderTable(false);
  }

  // extracting cols
  const columns: Column[] = [
    { key: "Course", label: "Course" },
    { key: "CLO", label: "CLO" },
    { key: "Description", label: "Description" },
  ];

  return (
    <div className="flex flex-col justify-between w-[40%] rounded-lg bg-slate-100 m-6 p-5">
      <Table aria-label="CLO Mapping">
        <TableHeader>
          {columns.map((col) => (
            <TableColumn key={col.key}>{col.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.__rowNum__}>
              {(columnKey) => (
                <TableCell>{getKeyValue(row, columnKey)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-5 overflow-hidden">
        {/* upload */}
        <input
          type="file"
          id="file_xlsx"
          accept=".xlsx, .xls, .xlsb "
          onChange={(e) => {
            handleFileUpload(e);
          }}
        />
        {/* delete */}
        <button
          className="mx-1"
          onClick={() => {
            handleDeleteTable(Object.keys(courseMapping)), setData([]);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Spreadsheet;

//   // make a copy and update DB
//   const tableCopy = [...data];
//   console.log(tableCopy);

//   const apiRequests = tableCopy.map(async (tr) => {
//     const cloList: CLO[] = [];
//     const { __rowNum__, Course, CLO, Description } = tr;

//     const sameCourses = tableCopy.filter((r) => r.Course === Course);

//     for (const row of sameCourses) {
//       const newCLO = {
//         id: Date.now(),
//         name: row.CLO,
//         description: row.Description,
//       };
//       cloList.push(newCLO);
//     }

//     const newCourse = {
//       id: Date.now(),
//       name: Course,
//       CLOs: cloList,
//     };

//     // make a post
//     return updateTable(newCourse);
//   });
