import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { deleteJob, editJob } from "../../http";

const JobCards = ({ jobs, getAllJobsData }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const formatCreatedAtDistance = (d) => {
    const date = new Date(d);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await deleteJob(id);
      enqueueSnackbar(data.message, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      getAllJobsData();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.response.data.message, {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setSelectedStatus(job.status);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentJob(null);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleEditUpdate = async () => {
    if (!currentJob || !selectedStatus) return;
    try {
      const { data } = await editJob(currentJob._id, { status: selectedStatus });
      enqueueSnackbar(data.message || "Status updated successfully!", {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      getAllJobsData();
      closeEditModal();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.response?.data?.message || "Failed to update status", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "interview":
        return "bg-green-900 text-green-300";
      case "reject":
        return "bg-red-900 text-red-300";
      default:
        return "bg-yellow-900 text-yellow-300";
    }
  };

  const getWorkTypeBadgeClass = (workType) => {
    switch (workType) {
      case "full-time":
        return "bg-gray-700 text-blue-400 border border-blue-400";
      case "part-time":
        return "bg-gray-700 text-indigo-400 border border-indigo-400";
      case "internship":
        return "bg-gray-700 text-purple-400 border border-purple-400";
      default:
        return "bg-gray-700 text-pink-400 border border-pink-400";
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <div
              key={job._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white truncate">{job.company}</h3>
                  <div className="flex space-x-2">
                    <button
                      className="text-green-500 hover:text-green-400 transition-colors"
                      onClick={() => openEditModal(job)}
                      aria-label="Edit job status"
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500 hover:text-red-400 transition-colors"
                      onClick={() => handleDelete(job._id)}
                      aria-label="Delete job"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-300 mb-3">{job.position}</h4>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`${getWorkTypeBadgeClass(job.workType)} text-xs font-medium px-2.5 py-1 rounded`}>
                    {job.workType}
                  </span>
                  <span className={`${getStatusBadgeClass(job.status)} text-xs font-medium px-2.5 py-1 rounded`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center text-gray-400 mb-1 text-sm">
                  📍 <span className="ml-1">{job.workLocation}</span>
                </div>

                <div className="flex items-center text-gray-400 text-xs italic">
                  ⏰ <span className="ml-1">{formatCreatedAtDistance(job.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {jobs?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="text-4xl mb-4">😕</div>
            <p>No job entries found.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Job Status</h2>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="reject">Rejected</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
            <button
              onClick={closeEditModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobCards;
