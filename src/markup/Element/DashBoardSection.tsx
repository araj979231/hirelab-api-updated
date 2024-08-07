"use client";
import React, { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  useGetRecentJobsQuery,
  usePostSaveJobMutation,
  useDeleteSavedJobMutation,
  useGetEventsQuery,
  useGetMembershipQuery,
  useGetCtcDataQuery,
} from "@/store/global-store/global.query";

import { RecentJobData } from "@/types/index";
import { fetchRecentJobsStart } from "@/store/global-store/global.slice";
import { formaterDate } from "@/utils/formateDate";
import Loading from "@/components/Loading";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
var bnr = require("./../../images/banner/bnr1.jpg");

const DashboardSection = () => {
  const { user } = useLoggedInUser();
  console.log("user", user);
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { data: membershipData } = useGetMembershipQuery();
  const {
    data: recentJob,
    isLoading: recentLoading,
    isError,
  } = useGetRecentJobsQuery();
  const [saveJob, { isLoading: isSaving }] = usePostSaveJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteSavedJobMutation();
  const { data: eventsData, isLoading: eventLoading } = useGetEventsQuery();
  const { data: ctcData } = useGetCtcDataQuery();
  const [likedJobs, setLikedJobs] = useState<string[]>([]);

  const viewJobHandler = (id: number) => {
    push(`/job-detail?jobId=${id}`);
  };

  // Function to toggle like state
  const handleLikeToggle = async (jobId: string) => {
    if (isSaving || isDeleting) {
      return; // If already saving or deleting, do nothing
    }

    if (likedJobs.includes(jobId)) {
      // Unlike job
      try {
        await deleteJob(jobId);
        setLikedJobs(likedJobs.filter((id) => id !== jobId));
        dispatch(fetchRecentJobsStart());
        Swal.fire({
          icon: "success",
          title: "Job Deleted Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error deleting job:", error);
        Swal.fire({
          icon: "error",
          title: "Error in Deleted Job",
          text: "Failed to deleting job.",
          confirmButtonText: "OK",
        });
      }
    } else {
      // Like job
      try {
        await saveJob({ job_id: jobId });
        setLikedJobs([...likedJobs, jobId]);
        dispatch(fetchRecentJobsStart());
        Swal.fire({
          icon: "success",
          title: "Job Saved Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error liking job:", error);
        Swal.fire({
          icon: "error",
          title: "Error in Saving Job",
          text: "Failed to saving job.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const [clickedIndexes, setClickedIndexes] = useState<number[]>([]);

  const handleIconClick = (index: number) => {
    const updatedIndexes = [...clickedIndexes];
    const currentIndex = updatedIndexes.indexOf(index);
    if (currentIndex === -1) {
      updatedIndexes.push(index);
    } else {
      updatedIndexes.splice(currentIndex, 1);
    }
    setClickedIndexes(updatedIndexes);
  };
  const getCtcTitleById = (id: any) => {
    const ctcItem = ctcData?.data?.find((item) => item.id == id);
    return ctcItem ? ctcItem.title : "N/A";
  };
  return (
    <>
      {recentLoading && eventLoading && <Loading />}
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="section-full bg-white browse-job p-b50">
            <div className="ds-wrap">
              <div className="row">
                <div className="col-lg-9">
                  <h3
                    className="text-center mt-5"
                    style={{ fontWeight: "600px", fontSize: "bold" }}
                  >
                    Recent Jobs
                  </h3>
                  <div>
                    <ul
                      className="post-job-bx"
                      style={{
                        padding: "5px",
                      }}
                    >
                      {recentJob?.data?.map(
                        (item: RecentJobData, index: number) => (
                          <li key={index}>
                            {item && (
                              <div className="post-bx">
                                <div className="d-flex m-b30">
                                  <div className="job-post-info">
                                    <h4
                                      style={{ cursor: "pointer" }}
                                      className="text-secondry"
                                      onClick={() => viewJobHandler(item.id)}
                                    >
                                      <Link href="">{item?.job_title}</Link>
                                    </h4>
                                    <ul>
                                      <li>
                                        <i className="fa fa-map-marker"></i>
                                        {item?.address}
                                      </li>
                                      <li>
                                        <i className="fa fa-bookmark-o"></i>
                                        {item?.location?.title}
                                      </li>
                                      <li>
                                        <i className="fa fa-clock-o"></i>{" "}
                                        Published{" "}
                                        {formaterDate(item?.created_at)}
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="job-time m-t15 m-b10">
                                  {item.tags &&
                                    item.tags.split(",").map((tag, index) => (
                                      <Link
                                        key={index}
                                        href="#"
                                        className="mr-1"
                                      >
                                        <span>{tag.trim()}</span>
                                      </Link>
                                    ))}
                                </div>

                                <div className="d-flex">
                                  <div className="job-time mr-auto">
                                    <Link href="">
                                      <span>{item?.location?.title}</span>
                                    </Link>
                                  </div>

                                  <div className="salary-bx">
                                    <span className="ctc-badge">
                                      <i className="fa fa-money"></i>{" "}
                                      {getCtcTitleById(item.ctc)}
                                    </span>
                                  </div>
                                </div>
                                <label
                                  className={`like-btn ${
                                    likedJobs.includes(item.id.toString())
                                      ? "liked"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleLikeToggle(item.id.toString())
                                  }
                                >
                                  <input type="checkbox" />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div
                    className="sticky-top browse-candidates shadow"
                    style={{
                      marginTop: "100px",
                      display: "grid",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        paddingTop: "20px",
                      }}
                    >
                      Membership Plan
                    </h3>
                    <p className="text-center">You path to Success</p>

                    <div className="ds-mp-wrap">
                      {membershipData?.data?.map((item, index) => (
                        <div
                          className="membership_class"
                          style={{
                            backgroundColor:
                              user?.user?.membership?.membership_id === item.id
                                ? "#2A6310"
                                : "rgb(42 99 16 / 67%)",
                            padding: "10px",
                            minWidth: "230px",
                            position: "relative",
                            height: "auto",
                          }}
                          key={index}
                        >
                          <div className="quote-info">
                            <div className="d-flex align-items-center relative">
                              <h5 className="text-white text-center  flex-grow-1 mb-0">
                                {item?.title}
                              </h5>
                              {user?.user?.membership?.membership_id ===
                                item.id && (
                                <div
                                  className="px-2 absolute"
                                  style={{ right: "0", top: "5px" }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="26"
                                    height="26"
                                    viewBox="0 0 36 36"
                                    fill="none"
                                  >
                                    <circle
                                      cx="18"
                                      cy="18"
                                      r="18"
                                      fill="#42A5F5"
                                    />
                                    <path
                                      d="M25.5 11.41L15.5 21.41L10 15.91L11.41 14.5L15.5 18.58L24.09 10L25.5 11.41Z"
                                      fill="#fff"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            <h6
                              className="text-white text-center mb-1"
                              style={{
                                fontFamily: "Lato, sans-serif !important",
                              }}
                            >
                              Price
                            </h6>
                            <li
                              className="text-center mp-lists"
                              style={{
                                fontFamily: "Lato, sans-serif !important",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {item?.monthly_price}
                            </li>

                            <li
                              className="text-center mp-lists"
                              style={{
                                fontFamily: "Lato, sans-serif !important",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {item?.quarterly_price}
                            </li>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="row mt-3 justify-content-center"
                style={{ gap: "2rem" }}
              >
                <div
                  className="col-lg-6 col-md-12 shadow p-4"
                  style={{
                    marginTop: "30px",

                    paddingRight: "-15px",
                    borderRadius: "1rem",
                    maxWidth: "550px",
                  }}
                >
                  <h2 style={{ fontWeight: 600, textAlign: "center" }}>
                    Meet Ups
                  </h2>
                  <ul
                    className="post-job-bx col"
                    style={{
                      paddingTop: "10px",
                    }}
                  >
                    {eventsData &&
                      eventsData.data.slice(0, 2).map((event, index) => (
                        <li key={index}>
                          <div className="post-bx">
                            <div className="d-flex m-b10">
                              <div className="job-post-info w-100">
                                <div className="d-flex justify-content-between w-100">
                                  <h5>
                                    <Link
                                      href={`/single-event?query=${event.title}`}
                                      style={{ fontWeight: "600" }}
                                    >
                                      {event.title}
                                    </Link>
                                  </h5>
                                  <div className="d-flex justify-content-end">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 10 13"
                                      fill="none"
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: 400,
                                        marginLeft: "8px",
                                        cursor: "pointer",
                                        width: "20px",
                                        height: "20px",
                                      }}
                                      onClick={() => handleIconClick(index)}
                                    >
                                      <path
                                        d="M0.5 0H9.5V12.5L5 10L0.5 12.5V0Z"
                                        fill={
                                          clickedIndexes.includes(index)
                                            ? "#2A6310"
                                            : "#fff"
                                        }
                                        stroke="#2A6310"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <ul
                                  style={{
                                    display: "flex",
                                    marginTop: "20px",
                                    color: "#2A6310 !important",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <li className="mr-4">
                                    <i
                                      className="fa fa-map-marker"
                                      style={{
                                        fontSize: "large",
                                        color: "#2A6310",
                                      }}
                                    ></i>
                                    {event.location}
                                  </li>
                                  <li className="mr-4">{event.date}</li>
                                  <li className="mr-4">{event.time}</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    className="mt-4 mb-3"
                  >
                    <button
                      className="btn btn-primary"
                      style={{ background: "rgb(42, 99, 16)", border: "none" }}
                    >
                      Browse All
                    </button>
                  </div>
                </div>

                <div
                  className="col-lg-6 col-md-12 shadow p-4"
                  style={{
                    marginTop: "30px",
                    paddingLeft: "-15px",
                    borderRadius: "1rem",
                    maxWidth: "550px",
                  }}
                >
                  <h2 style={{ fontWeight: 600, textAlign: "center" }}>
                    Discussion Forum
                  </h2>
                  <ul
                    className="post-job-bx col"
                    style={{
                      paddingTop: "10px",
                    }}
                  >
                    <li>
                      <div className="post-bx">
                        <div className="d-flex m-b10">
                          <div className="job-post-info w-100">
                            <h5>
                              <Link href="/">
                                Q:Lorem ipsum tell me about your plans
                              </Link>
                            </h5>
                            <ul
                              style={{
                                display: "flex",
                                marginTop: "20px",
                                color: "#2A6310 !important",
                              }}
                            >
                              <p>Author: testsldeldedledldmldlele</p>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="post-bx">
                        <div className="d-flex m-b10">
                          <div className="job-post-info w-100">
                            <h5>
                              <Link href="/">
                                Q:Lorem ipsum tell me about your plans
                              </Link>
                            </h5>
                            <ul
                              style={{
                                display: "flex",
                                marginTop: "20px",
                                color: "#2A6310 !important",
                              }}
                            >
                              <p>Author: testsldeldedledldmldlele</p>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        className="mt-4 mb-3"
                      >
                        <button
                          className="btn btn-primary"
                          style={{
                            background: "rgb(42, 99, 16)",
                            border: "none",
                          }}
                        >
                          Ask a Question
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .text-center-li {
            display: flex;
            justify-content: center;
            align-item: center;
          }
        `}</style>
      </div>
    </>
  );
};
export default DashboardSection;
