import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import problemApi from '../../services/problemApi';
import { universityApi, industryApi } from '../../services/universityApi';
import analyticsApi from '../../services/analyticsApi';

/**
 * Consolidated Async Thunk: Fetch Complete Ecosystem Data in one unified call directly from Backend REST APIs
 */
export const fetchEcosystemData = createAsyncThunk('ecosystem/fetchAll', async (filterParams = {}, { rejectWithValue }) => {
  try {
    const [problemsRes, universitiesRes, industryRes, analyticsRes] = await Promise.allSettled([
      problemApi.getProblems(filterParams),
      universityApi.getUniversities(),
      industryApi.getIndustryPartners(),
      analyticsApi.getAnalytics()
    ]);

    return {
      problems: problemsRes.status === 'fulfilled' ? problemsRes.value.problems : [],
      universities: universitiesRes.status === 'fulfilled' ? universitiesRes.value.universities : [],
      industryPartners: industryRes.status === 'fulfilled' ? industryRes.value.partners : [],
      analytics: analyticsRes.status === 'fulfilled' ? analyticsRes.value.data : null
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

/**
 * Targeted Async Thunk: Fetch Oldest 6 Solved Challenges for Landing Page (Minimal API Call)
 */
export const fetchSolvedChallenges = createAsyncThunk('ecosystem/fetchSolved', async (limit = 6, { rejectWithValue }) => {
  try {
    const data = await problemApi.getProblems({ resolutionStatus: 'solved', sort: 'oldest', limit });
    return data.problems || [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk: Submit New Problem
export const submitProblemThunk = createAsyncThunk('ecosystem/submitProblem', async (formData, { rejectWithValue }) => {
  try {
    const data = await problemApi.submitProblem(formData);
    return data.problem;
  } catch (error) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: error.message });
  }
});

// Async Thunk: Allocate University (Govt)
export const allocateUniversityThunk = createAsyncThunk('ecosystem/allocateUniversity', async ({ problemId, allocationData }, { rejectWithValue }) => {
  try {
    const data = await problemApi.allocateUniversity(problemId, allocationData);
    return data.problem;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk: Submit Proposal (University)
export const submitProposalThunk = createAsyncThunk('ecosystem/submitProposal', async ({ problemId, proposalData }, { rejectWithValue }) => {
  try {
    const data = await problemApi.submitProposal(problemId, proposalData);
    return data.problem;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk: Pledge CSR Funding (Industry)
export const fundProblemThunk = createAsyncThunk('ecosystem/fundProblem', async ({ problemId, fundingData }, { rejectWithValue }) => {
  try {
    const data = await problemApi.pledgeFunding(problemId, fundingData);
    return data.problem;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk: Update Milestone (Workflow)
export const updateMilestoneThunk = createAsyncThunk('ecosystem/updateMilestone', async ({ problemId, milestoneId, milestoneData }, { rejectWithValue }) => {
  try {
    const data = await problemApi.updateMilestone(problemId, milestoneId, milestoneData);
    return data.problem;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk: Validate Solution (Govt & Stakeholders)
export const validateSolutionThunk = createAsyncThunk('ecosystem/validateSolution', async ({ problemId, validationData }, { rejectWithValue }) => {
  try {
    const data = await problemApi.validateSolution(problemId, validationData);
    return data.problem;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  problems: [],
  selectedProblemId: null,
  universities: [],
  industryPartners: [],
  departments: [],
  districts: [],
  analytics: null,
  filters: {
    domain: 'all',
    district: 'all',
    status: 'all',
    search: ''
  },
  auditLogs: [],
  loading: false,
  error: null
};

export const ecosystemSlice = createSlice({
  name: 'ecosystem',
  initialState,
  reducers: {
    setSelectedProblemId: (state, action) => {
      state.selectedProblemId = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { domain: 'all', district: 'all', status: 'all', search: '' };
    },
    addLocalAuditLog: (state, action) => {
      state.auditLogs.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    // Fetch All Data
    builder
      .addCase(fetchEcosystemData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEcosystemData.fulfilled, (state, action) => {
        state.problems = action.payload.problems || [];
        state.universities = action.payload.universities || [];
        state.industryPartners = action.payload.industryPartners || [];
        if (action.payload.analytics) {
          state.analytics = action.payload.analytics;
          state.departments = action.payload.analytics.departments || [];
          state.districts = action.payload.analytics.districts || [];
          if (action.payload.analytics.recentAuditTrail) {
            state.auditLogs = action.payload.analytics.recentAuditTrail;
          }
        }
        if (!state.selectedProblemId && state.problems.length > 0) {
          state.selectedProblemId = state.problems[0]._id;
        }
        state.loading = false;
      })
      .addCase(fetchEcosystemData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Solved Challenges (Landing Page Minimal)
    builder
      .addCase(fetchSolvedChallenges.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolvedChallenges.fulfilled, (state, action) => {
        state.problems = action.payload || [];
        if (!state.selectedProblemId && action.payload.length > 0) {
          state.selectedProblemId = action.payload[0]._id;
        }
        state.loading = false;
      })
      .addCase(fetchSolvedChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Helper for updating single problem in array
    const updateProblemInState = (state, updatedProblem) => {
      if (!updatedProblem) return;
      const index = state.problems.findIndex(
        p => p._id === updatedProblem._id
      );
      if (index !== -1) {
        state.problems[index] = updatedProblem;
      } else {
        state.problems.unshift(updatedProblem);
      }
      state.selectedProblemId = updatedProblem._id;
    };

    builder
      .addCase(submitProblemThunk.fulfilled, (state, action) => {
        updateProblemInState(state, action.payload);
      })
      .addCase(allocateUniversityThunk.fulfilled, (state, action) => {
        updateProblemInState(state, action.payload);
      })
      .addCase(submitProposalThunk.fulfilled, (state, action) => {
        updateProblemInState(state, action.payload);
      })
      .addCase(fundProblemThunk.fulfilled, (state, action) => {
        updateProblemInState(state, action.payload);
      })
      .addCase(updateMilestoneThunk.fulfilled, (state, action) => {
        updateProblemInState(state, action.payload);
      })
      .addCase(validateSolutionThunk.fulfilled, (state, action) => {
        updateProblemInState(state, action.payload);
      });
  }
});

export const {
  setSelectedProblemId,
  setFilters,
  resetFilters,
  addLocalAuditLog
} = ecosystemSlice.actions;

export default ecosystemSlice.reducer;
