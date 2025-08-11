import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { linkedinScanAPI } from "../api/linkedinScan";
import { LinkedInScanResult } from "../types/linkedinTypes";

interface LinkedInScanState {
  loading: boolean;
  error: string | null;
  scanResult: LinkedInScanResult | null;
}

const initialState: LinkedInScanState = {
  loading: false,
  error: null,
  scanResult: null,
};

export const scanLinkedInProfile = createAsyncThunk<
  LinkedInScanResult,
  {
    linkedinUrl?: string;
    linkedin?: File;
    targetIndustry?: string;
    experienceLevel?: string;
    targetJobTitle?: string;
  }
>("linkedinScan/scanProfile", async (requestData) => {
  const formData = new FormData();

  if (requestData.linkedinUrl) {
    formData.append("linkedinUrl", requestData.linkedinUrl);
  }

  if (requestData.linkedin) {
    formData.append("linkedin", requestData.linkedin);
  }

  if (requestData.targetIndustry) {
    formData.append("targetIndustry", requestData.targetIndustry);
  }

  if (requestData.experienceLevel) {
    formData.append("experienceLevel", requestData.experienceLevel);
  }

  if (requestData.targetJobTitle) {
    formData.append("targetJobTitle", requestData.targetJobTitle);
  }

  const response = await linkedinScanAPI.scanLinkedInProfile(formData);
  return response.data;
});

const linkedinScanSlice = createSlice({
  name: "linkedinScan",
  initialState,
  reducers: {
    clearScanResult: (state) => {
      state.scanResult = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanLinkedInProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scanLinkedInProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.scanResult = action.payload;
      })
      .addCase(scanLinkedInProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to scan LinkedIn profile";
      });
  },
});

export const { clearScanResult, clearError } = linkedinScanSlice.actions;
export default linkedinScanSlice.reducer;
