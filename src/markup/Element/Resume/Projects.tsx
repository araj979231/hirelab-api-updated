"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import Link from "next/link";
import {
  useGetResumeDataQuery,
  useCreateResumeProjectMutation,
  useUpdateResumeProjectMutation,
} from "@/app/my-resume/store/resume.query";
import { toast } from "react-toastify";

interface ProjectsProps {
  show: boolean;
  onShow: () => void;
  onHide: () => void;
}

interface ProjectData {
  title: string;
  client: string;
  project_status: string;
  start_from_year: string;
  start_from_month: string;
  worked_till_year: string;
  worked_till_month: string;
}

const Projects: React.FC<ProjectsProps> = ({ show, onShow, onHide }) => {
  const { data: resumeData, isLoading } = useGetResumeDataQuery();
  const [createProject] = useCreateResumeProjectMutation();
  const [updateProject] = useUpdateResumeProjectMutation();

  const [project, setProject] = useState<ProjectData>({
    title: "",
    client: "",
    project_status: "",
    start_from_year: "",
    start_from_month: "",
    worked_till_year: "",
    worked_till_month: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (resumeData && resumeData.data.length > 0) {
      const existingProject = resumeData.data[0].projects[0]; // Assuming single project entry for simplicity
      if (existingProject) {
        setProject({
          title: existingProject.title,
          client: existingProject.client,
          project_status: existingProject.project_status,
          start_from_year: existingProject.start_from_year,
          start_from_month: existingProject.start_from_month,
          worked_till_year: existingProject.worked_till_year,
          worked_till_month: existingProject.worked_till_month,
        });
        setProjectId(existingProject.id);
        setEditMode(true);
      }
    }
  }, [resumeData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 51 }, (_, index) => currentYear - index);
  };

  const validateForm = () => {
    const {
      title,
      client,
      project_status,
      start_from_year,
      start_from_month,
      worked_till_year,
      worked_till_month,
    } = project;

    const newErrors: string[] = [];

    if (!title || !client || !project_status || !start_from_year || !start_from_month) {
      newErrors.push("All required fields must be filled.");
    }

    if (project_status === "finished") {
      if (!worked_till_year || !worked_till_month) {
        newErrors.push("All fields must be filled for finished projects.");
      }

      const startDate = new Date(
        parseInt(start_from_year),
        new Date(`${start_from_month} 1`).getMonth()
      );
      const endDate = new Date(
        parseInt(worked_till_year),
        new Date(`${worked_till_month} 1`).getMonth()
      );

      if (startDate > endDate) {
        newErrors.push("Start date must be before or equal to the end date.");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (editMode && projectId !== null) {
        const response = await updateProject({
          data: project,
          project_id: projectId,
        });
        toast.success(response?.data?.message, { theme: "colored" });
      } else {
        const response = await createProject(project);
        toast.success(response?.data?.message, { theme: "colored" });
      }
      onHide();
    } catch (error: any) {
      toast.error(error?.message, { theme: "colored" });
    }
  };

  return (
    <div id="projects_bx" className="job-bx bg-white m-b30">
      <div className="d-flex">
        <h5 className="m-b15">Projects</h5>
        <Link href="" onClick={onShow} className="site-button add-btn button-sm">
          <i className="fa fa-pencil m-r5"></i> Edit
        </Link>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h6 className="font-14 m-b0">{project.title}</h6>
          <p className="m-b0">{project.client}</p>
          <p className="m-b0">
            {project.start_from_month} {project.start_from_year} to{" "}
            {project.project_status === "finished"
              ? `${project.worked_till_month} ${project.worked_till_year}`
              : "Present"}
          </p>
        </>
      )}

      <Modal
        className="modal fade modal-bx-info editor"
        show={show}
        onHide={onHide}
      >
        <div className="modal-dialog my-0" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ProjectsModalLongTitle">
                Add Projects
              </h5>
              <button type="button" className="close" onClick={onHide}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  {errors.length > 0 && (
                    <div className="col-lg-12 col-md-12">
                      <div className="alert alert-danger">
                        {errors.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={project.title}
                        onChange={handleChange}
                        placeholder="Enter Project Title"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Client</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client"
                        value={project.client}
                        onChange={handleChange}
                        placeholder="Enter Client Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Project Status</label>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="inprogress"
                              name="project_status"
                              value="inprogress"
                              checked={project.project_status === "inprogress"}
                              onChange={handleChange}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="inprogress"
                            >
                              In Progress
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="finished"
                              name="project_status"
                              value="finished"
                              checked={project.project_status === "finished"}
                              onChange={handleChange}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="finished"
                            >
                              Finished
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Started Working From</label>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <Form.Control
                            as="select"
                            name="start_from_year"
                            value={project.start_from_year}
                            onChange={handleChange}
                          >
                            <option value="">Year</option>
                            {generateYears().map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <Form.Control
                            as="select"
                            name="start_from_month"
                            value={project.start_from_month}
                            onChange={handleChange}
                          >
                            <option value="">Month</option>
                            {[
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ].map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                      </div>
                    </div>
                  </div>

                  {project.project_status === "finished" && (
                    <>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Worked Till</label>
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <Form.Control
                                as="select"
                                name="worked_till_year"
                                value={project.worked_till_year}
                                onChange={handleChange}
                              >
                                <option value="">Year</option>
                                {generateYears().map((year) => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </Form.Control>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <Form.Control
                                as="select"
                                name="worked_till_month"
                                value={project.worked_till_month}
                                onChange={handleChange}
                              >
                                <option value="">Month</option>
                                {[
                                  "January",
                                  "February",
                                  "March",
                                  "April",
                                  "May",
                                  "June",
                                  "July",
                                  "August",
                                  "September",
                                  "October",
                                  "November",
                                  "December",
                                ].map((month) => (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                ))}
                              </Form.Control>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="site-button" onClick={onHide}>
                Cancel
              </button>
              <button
                type="button"
                className="site-button"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
