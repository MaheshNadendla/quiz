import { createSlice } from "@reduxjs/toolkit";

// Initial state structure
const initialState = {
  subject: null, // Store the subject data
  modules: [], // Store the modules data (array of modules)
  totalModules: 0, // Track the total number of modules
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    // Set subject data (single object)
    setSubjectData: (state, action) => {
      state.subject = action.payload;
    },

    // Set modules data (array of modules)
    setModulesData: (state, action) => {
      state.modules = action.payload;
    },

    // Set total modules count
    setTotalModules: (state, action) => {
      state.totalModules = action.payload;
    },

    // Set complete course data (subject, modules, totalModules)
    // setEntireCourseData: (state, action) => {
    //   const { subject, modules, totalModules } = action.payload;
    //   state.subject = subject;
    //   state.modules = modules;
    //   state.totalModules = totalModules;
    // },
  },
});

// Export the actions
export const {
  setSubjectData,
  setModulesData,
  setTotalModules,
  setEntireCourseData,
} = viewCourseSlice.actions;

// Export the reducer to be used in the store
export default viewCourseSlice.reducer;
