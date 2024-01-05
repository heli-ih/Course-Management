"use client";
import { CLO } from "@app/page";
import React from "react";
import CLOList from "./CLOList";

interface InputProps {
  CourseName: string;
  setCourseName: (CourseName: string) => void;
  CLOName: string;
  setCLOName: (CLOName: string) => void;
  CLODescription: string;
  setCLODescription: (CLODescription: string) => void;
  CLOsList: CLO[];
  handleAddCLO: () => void;
  handleAddCourse: () => void;
  handleReset: () => void;
}

const Input: React.FC<InputProps> = ({
  CourseName,
  setCourseName,
  CLOName,
  setCLOName,
  CLODescription,
  setCLODescription,
  CLOsList,
  handleAddCLO,
  handleAddCourse,
  handleReset,
}) => {
  return (
    <div className="p-5 flex flex-col flex-auto w-[40%] rounded-lg bg-slate-100 m-6">
      <h1 className="rounded-md font-bold mt-10 mb-5">Create a Course</h1>
      {/* course name   */}
      <input
        id="Cname"
        value={CourseName}
        onChange={(e) => {
          setCourseName(e.target.value);
        }}
        className=" rounded-md p-2 my-5 w-full"
        type="text"
        placeholder="Course name.."
      />
      {/* clo */}
      <div className="flex justify-between items-center mb-5">
        {/* clo name */}
        <input
          id="CLOname"
          value={CLOName}
          onChange={(e) => {
            setCLOName(e.target.value);
          }}
          className="rounded-md p-2 w-[30%]"
          type="text"
          placeholder="CLO..."
        />
        :{/* clo description */}
        <input
          id="CLOdesc"
          value={CLODescription}
          onChange={(e) => {
            setCLODescription(e.target.value);
          }}
          className="rounded-md p-2 w-[50%]"
          type="text"
          placeholder="Description..."
        />
        {/* add btn */}
        <button
          type="submit"
          className="rounded-full px-2  bg-white"
          onClick={handleAddCLO}
        >
          +
        </button>
      </div>
      {/* clo list ---children*/}
      <div className="rounded-md p-2 w-full mb-5">
        <CLOList>
          <ul>
            {CLOsList.map((item) => (
              <li
                key={item.id}
                className="flex justify-between my-2 border-b-4 border-black"
              >
                <p className="text-md">
                  {item.name} : {item.description}
                </p>
              </li>
            ))}
          </ul>
        </CLOList>
      </div>
      {/* submit & reset btn */}
      <div className="flex justify-center mt-7">
        <button
          onClick={async () => {
            handleAddCourse();
          }}
          className="rounded-md py-2 px-3 mr-5 bg-white"
          type="submit"
        >
          Submit
        </button>
        <button
          className="rounded-md py-2 px-3 ml-5 bg-white"
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Input;
