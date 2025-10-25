import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseData: [],
  totalNoOfSubjects: 0,
};

const viewSubjectSlice = createSlice({
  name: "viewSubject",
  initialState,
  reducers: {
    setCourseData: (state, action) => {
      state.courseData = action.payload;
    },
    setTotalNoOfSubjects: (state, action) => {
      state.totalNoOfSubjects = action.payload;
    },
  },
});

export const { setCourseData, setTotalNoOfSubjects } = viewSubjectSlice.actions;

export default viewSubjectSlice.reducer;
