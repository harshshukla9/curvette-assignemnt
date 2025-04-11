import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJobController,
  deleteJobController,
  getJobsController,
  jobsStatsController,
  updateJobsController,
  editJobController
} from "../controllers/jobsController.js";

//router object
const router = express.Router();

//routes
//CREATE JOB || POST
router.post("/create-job", userAuth, createJobController);

//GET JOBS || GET
router.get("/get-jobs", userAuth, getJobsController);

//UPDATE JOBS ||  PATCH
router.patch("/update-job/:id", userAuth, updateJobsController);

//DELETE JOB || DELETE
router.delete("/delete-job/:id", userAuth, deleteJobController);

//EDIT JOB 
router.post("/edit-job/:id", userAuth, editJobController);
console.log("jonroyes")

//JOB STATS FILTER|| get
router.get("/job-stats", userAuth, jobsStatsController);

export default router;
