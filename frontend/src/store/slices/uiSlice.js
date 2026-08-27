import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeView: 'citizen_home', // 'citizen_home' | 'gov_command' | 'uni_hub' | 'ind_marketplace' | 'projects_flow' | 'gis_map' | 'public_discovery'
  lang: 'en', // 'en' | 'hi'
  activeDistrictId: 'khunti',
  isSubmitModalOpen: false,
  isAssistantOpen: false,
  isAuditDrawerOpen: false,
  isPitchTourOpen: false,
  isAuthModalOpen: false,
  authModalMode: 'login' // 'login' | 'register'
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
    toggleLanguage: (state) => {
      state.lang = state.lang === 'en' ? 'hi' : 'en';
    },
    setActiveDistrictId: (state, action) => {
      state.activeDistrictId = action.payload;
    },
    setIsSubmitModalOpen: (state, action) => {
      state.isSubmitModalOpen = action.payload;
    },
    setIsAssistantOpen: (state, action) => {
      state.isAssistantOpen = action.payload;
    },
    setIsAuditDrawerOpen: (state, action) => {
      state.isAuditDrawerOpen = action.payload;
    },
    setIsPitchTourOpen: (state, action) => {
      state.isPitchTourOpen = action.payload;
    },
    setAuthModal: (state, action) => {
      state.isAuthModalOpen = action.payload.isOpen;
      if (action.payload.mode) {
        state.authModalMode = action.payload.mode;
      }
    }
  }
});

export const {
  setActiveView,
  setLanguage,
  toggleLanguage,
  setActiveDistrictId,
  setIsSubmitModalOpen,
  setIsAssistantOpen,
  setIsAuditDrawerOpen,
  setIsPitchTourOpen,
  setAuthModal
} = uiSlice.actions;

export default uiSlice.reducer;
