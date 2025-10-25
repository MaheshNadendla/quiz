import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import viewSubjectReducer from "../slices/subjectsSlice";
import viewCourseReducer from "../slices/viewCoursesSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  viewSubject: viewSubjectReducer,
  viewCourse: viewCourseReducer,
});

export default rootReducer;
