import { configureStore } from "@reduxjs/toolkit";
import global from "./global";

export default configureStore({
  reducer: { global },
});
