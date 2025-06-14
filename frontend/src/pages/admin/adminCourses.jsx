/** @format */

import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/sidebar2";
import axios from "axios";
import { FaBars, FaSort } from "react-icons/fa";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableReviewers, setAvailableReviewers] = useState([]);
  const [topics, setTopics] = useState([]);

  const [assignReviewer, setAssignReviewer] = useState(false);


  useEffect(() => {
    axios
      .get("https://instituteproject.up.railway.app/admin/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const getSelectedCourse = (CID) => {
    axios
      .get(`https://instituteproject.up.railway.app/admin/course/${CID}`)
      .then((response) => {
        setSelectedCourse(response.data);
        console.log("Selected course:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching selected course:", error);
      });
  };

  const getCourseTopics = (CID) => {
    axios
      .get(`https://instituteproject.up.railway.app/admin/get-topics/${CID}`)
      .then((response) => {
        setTopics(response.data);
        console.log("Course topics:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching course topics:", error);
      });
  };

  const getAvailableReviewers = () => {
    axios
      .get("https://instituteproject.up.railway.app/admin/available-reviewers")
      .then((response) => {
        setAvailableReviewers(response.data);
        console.log("Available reviewers:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching available reviewers:", error);
      });
  };

  const assignReviewerToCourse = (reviewer, courseId) => {
    axios
      .post("https://instituteproject.up.railway.app/admin/assign-reviewers", {
        courseId: courseId,
        reviewer: reviewer,
      })
      .then((response) => {
        console.log("Reviewer assigned successfully:", response.data);
        setAssignReviewer(false);
        setSelectedCourse(null);
      })
      .catch((error) => {
        console.error("Error assigning reviewer:", error);
      });
  };

  const coursesColumns = [
    {
      header: "Course Name",
      accessorKey: "Course_name",
      cell: (props) => (
        <p
          className="cursor-pointer hover:underline"
          onClick={() => {
            getSelectedCourse(props.row.original.CID);
            getCourseTopics(props.row.original.CID);
          }}
        >
          {props.getValue()}
        </p>
      ),
    },
    {
      header: "Faculty Name",
      accessorKey: "Faculty_Name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty Qualification",
      accessorKey: "Faculty_Qualification",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty Department",
      accessorKey: "Faculty_department",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Faculty Institution",
      accessorKey: "Faculty_Institution",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Reviewer",
      accessorKey: "Reviewer",
      cell: (props) => (
        <>
          {props.getValue() == null ? <p className="text-red-600">No Reviewer Assigned</p> : props.getValue()}
        </>
      ),
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (props) => <p>{props.getValue()}</p>,
    },
  ];

  const reviewersColumns = [
    {
      header: "Name",
      accessorKey: "Faculty_Name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Qualification",
      accessorKey: "Faculty_Qualification",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Department",
      accessorKey: "Faculty_department",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Institution",
      accessorKey: "Faculty_Institution",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "No. of Courses Assigned",
      accessorKey: "Number_of_Courses_Reviewing",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Assign Reviewer",
      cell: (props) => (
        <button
          className="bg-green-700 hover:bg-green-700 text-white p-2 rounded-lg w-1/2"
          onClick={() => {
            assignReviewerToCourse(props.row.original.FID, selectedCourse.CID);
          }}
        >
          Assign
        </button>
      ),
    },
  ];

  const topicsColumns = [
    {
      header: "Topic Name",
      accessorKey: "File_name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "File Type",
      accessorKey: "File_type",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "File Link",
      accessorKey: "File_link",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Uploaded At",
      accessorKey: "Uploaded_at",
      cell: (props) => <p>{props.getValue()}</p>,
    },
  ]

  const coursesTable = useReactTable({
    data: courses,
    columns: coursesColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const reviewersTable = useReactTable({
    data: availableReviewers,
    columns: reviewersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const topicsTable = useReactTable({
    data: topics,
    columns: topicsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex">
      <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarToggle ? "ml-0" : "md:ml-60"
        }`}
      >
        <nav className="fixed top-0 left-0 w-full md:w-[calc(100%-16rem)] md:ml-64 bg-white shadow-md p-4 flex justify-between items-center z-10">
          <button
            className="md:hidden text-2xl text-black"
            onClick={() => setSidebarToggle(!sidebarToggle)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-black">Courses</h1>
        </nav>

        <main className="p-10 pt-24 bg-gray-200 min-h-screen overflow-y-scroll overflow-x-scroll">
          <div className="bg-white p-8 text-black rounded-lg text-center shadow-md max-w-auto">
            <h2 className="mb-6 text-black">All Courses</h2>
            <div style={{ width: coursesTable.getCenterTotalSize() }}>
              {coursesTable.getRowModel().rows.length > 0 ? (
                <>
                  {coursesTable.getHeaderGroups().map((headerGroup) => (
                    <div key={headerGroup.id} className="flex">
                      {headerGroup.headers.map((header) => (
                        <div
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="w-4xl font-bold text-left text-white bg-[#2b193d] border border-gray-600 p-2"
                        >
                          {header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <FaSort onClick={header.column.getToggleSortingHandler()} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  {coursesTable.getRowModel().rows.map((row) => (
                    <div key={row.id} className="flex">
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="text-left border border-gray-600 p-2"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  ))}
                  <p>
                    Page {coursesTable.getState().pagination.pageIndex + 1} of{" "}
                    {coursesTable.getPageCount()}
                  </p>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={coursesTable.getState().pagination.previousPage}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={coursesTable.getState().pagination.nextPage}
                  >
                    {">"}
                  </button>
                </>
              ) : (
                <div className="flex">
                  <div className="flex-1 text-left border border-gray-600 p-2">
                    No courses available
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedCourse !== null && (
            <div className="bg-white mt-4 p-8 text-black rounded-lg shadow-md width-3xl mt-10">
              <div className="flex justify-content">
                <div className="flex flex-col w-1/2">
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Course Name</h2>
                    <h2 className="text-black">{selectedCourse.Course_name}</h2>
                  </div>
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Course Description</h2>
                    <p className="text-black">{selectedCourse.Course_description}</p>
                  </div>
                  <div className="text-left">
                    <h2 className="text-black font-bold">No. of resources</h2>
                    <p className="text-black">{selectedCourse.File_Count}</p>
                  </div>
                </div>
                <div className="flex flex-col w-1/2">
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Faculty Name</h2>
                    <p className="text-black">{selectedCourse.Faculty_Name}</p>
                  </div>
                  <div className="text-left mb-4">
                    <h2 className="text-black font-bold">Reviewer</h2>
                    <p className="text-black">
                      {selectedCourse.Reviewer == null
                        ? "No reviewer assigned"
                        : selectedCourse.Reviewer}
                    </p>
                  </div>
                  <div>
                    {selectedCourse.Reviewer == null ? (
                      <button
                        className="bg-[#2b193d] hover:bg-green-700 text-white p-2 w-1/2 rounded-lg"
                        onClick={() => {
                          setAssignReviewer(!assignReviewer);
                          getAvailableReviewers();
                        }}
                      >
                        {assignReviewer ? "Close" : "Assign Reviewer"}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              {assignReviewer && (
                <div className=" mt-4 text-center">
                  <h2 className="text-black text-left">Available Reviewers</h2>
                  <div style={{ width: reviewersTable.getCenterTotalSize() }}>
                    {reviewersTable.getRowModel().rows.length > 0 ? (
                      <>
                        {reviewersTable.getHeaderGroups().map((headerGroup) => (
                          <div key={headerGroup.id} className="flex">
                            {headerGroup.headers.map((header) => (
                              <div
                                key={header.id}
                                style={{ width: header.getSize() }}
                                className="w-4xl font-bold text-left text-white bg-[#2b193d] border border-gray-600 p-2"
                              >
                                {header.column.columnDef.header}
                                {header.column.getCanSort() && (
                                  <FaSort onClick={header.column.getToggleSortingHandler()} />
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                        {reviewersTable.getRowModel().rows.map((row) => (
                          <div key={row.id} className="flex">
                            {row.getVisibleCells().map((cell) => (
                              <div
                                key={cell.id}
                                style={{ width: cell.column.getSize() }}
                                className="text-left border border-gray-600 p-2"
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            ))}
                          </div>
                        ))}
                        <p>
                          Page {reviewersTable.getState().pagination.pageIndex + 1} of{" "}
                          {reviewersTable.getPageCount()}
                        </p>
                        <button
                          className="border border-gray-600 text-15"
                          onClick={reviewersTable.getState().pagination.previousPage}
                        >
                          {"<"}
                        </button>
                        <button
                          className="border border-gray-600 text-15"
                          onClick={reviewersTable.getState().pagination.nextPage}
                        >
                          {">"}
                        </button>
                      </>
                    ) : (
                      <div className="flex">
                        <div className="flex-1 text-left border border-gray-600 p-2">
                          Reviewers Not Available
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedCourse !== null && (
          <div className="bg-white mt-4 p-8 text-black rounded-lg text-center shadow-md max-w-auto">
            <h2 className="mb-6 text-black">Topics of "{selectedCourse.Course_name}"</h2>
            <div style={{ width: topicsTable.getCenterTotalSize() }}>
              {topicsTable.getRowModel().rows.length > 0 ? (
                <>
                  {topicsTable.getHeaderGroups().map((headerGroup) => (
                    <div key={headerGroup.id} className="flex">
                      {headerGroup.headers.map((header) => (
                        <div
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="w-4xl font-bold text-left text-white bg-[#2b193d] border border-gray-600 p-2"
                        >
                          {header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <FaSort onClick={header.column.getToggleSortingHandler()} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  {topicsTable.getRowModel().rows.map((row) => (
                    <div key={row.id} className="flex">
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="text-left border border-gray-600 p-2"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  ))}
                  <p>
                    Page {topicsTable.getState().pagination.pageIndex + 1} of{" "}
                    {topicsTable.getPageCount()}
                  </p>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={topicsTable.getState().pagination.previousPage}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border border-gray-600 text-15"
                    onClick={topicsTable.getState().pagination.nextPage}
                  >
                    {">"}
                  </button>
                </>
              ) : (
                <div className="flex">
                  <div className="flex-1 text-left p-2">
                    Topics have not been uploaded yet
                  </div>
                </div>
              )}
            </div>
          </div>)}
        </main>
      </div>
    </div>
  );
};

export default AdminCourses;
