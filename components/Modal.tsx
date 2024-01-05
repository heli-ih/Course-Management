import React, { useState } from "react";
import { CourseItem } from "./CourseList";
import { Course } from "@app/page";

interface ModalProps {
  CoursesList: Course[];
  open: Boolean;
  handleClose: (course: Course) => void;
  handleCourseEdit: (editedCourseName: string) => void;
  handleAddCourse: () => void;
  handleEditedCLOName: (index: number, editedCLOName: string) => void;
  handleEditedCLODescription: (
    index: number,
    editedCLODescription: string
  ) => void;
  selectedCourse: string;
}

const Modal: React.FC<ModalProps> = ({
  CoursesList,
  open,
  handleClose,
  handleCourseEdit,
  handleAddCourse,
  handleEditedCLOName,
  handleEditedCLODescription,
  selectedCourse,
}) => {
  if (!open) return null;

  const selectedItem = CoursesList.find(
    (course) => course.id === selectedCourse
  );

  if (selectedItem) {
    const [editedCourseName, setEditedCourseName] = useState<string>(
      selectedItem.name
    );
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>

        {/* body */}
        <div className="modal-container bg-white  w-[50%] mx-auto rounded shadow-lg z-50 overflow-y-auto">
          {/* close btn */}
          <button
            className="flex justify-end w-full p-3"
            onClick={() => handleClose(selectedItem)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <div className="flex justify-center rounded-md  pb-7 pt-3 bg-slate-100">
            <CourseItem>
              <div className=" w-[80%]">
                {/* Course name */}
                <input
                  id="CourseName"
                  value={editedCourseName}
                  onChange={(e) => {
                    setEditedCourseName(e.target.value);
                  }}
                  className="w-full rounded-md p-2 my-5 text-lg font-bold"
                  type="text"
                />
                {/* CLOList */}
                <ul className="w-full">
                  {selectedItem.CLOs.map((item, index) => {
                    // Create state for each clo to track changes individually
                    const [editedCLOName, setEditedCLOName] = useState(
                      item.name
                    );
                    const [editedCLODescription, setEditedCLODescription] =
                      useState(item.description);

                    return (
                      <li
                        key={index}
                        className="flex justify-between items-center my-2"
                      >
                        <input
                          id="CLOName"
                          value={editedCLOName}
                          onChange={(e) => {
                            setEditedCLOName(e.target.value);
                          }}
                          onBlur={() => {
                            handleEditedCLOName(index, editedCLOName); // Pass the current editedCLOName
                          }}
                          className="p-1 mr-2 rounded-md w-[30%] text-md"
                          type="text"
                        />
                        :
                        <input
                          id="CLODescription"
                          value={editedCLODescription}
                          onChange={(e) => {
                            setEditedCLODescription(e.target.value);
                          }}
                          onBlur={() => {
                            handleEditedCLODescription(
                              index,
                              editedCLODescription
                            ); // Pass the current editedCLODescription
                          }}
                          className="p-1 ml-2 rounded-md w-[70%] text-md"
                          type="text"
                        />
                      </li>
                    );
                  })}

                  <div className="w-full flex justify-center mt-10">
                    <button
                      className="rounded-md px-3 py-2 bg-white"
                      onClick={() => {
                        handleCourseEdit(editedCourseName),
                          handleAddCourse(),
                          handleClose(selectedItem);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </ul>
              </div>
            </CourseItem>
          </div>
        </div>
      </div>
    );
  }
};

export default Modal;
