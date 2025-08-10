import axiosInstance from "./axiosInstance";

export const getResumeStats = async () => {
  const response = await axiosInstance.get("/user/resume-stats");
  return response.data;
};
