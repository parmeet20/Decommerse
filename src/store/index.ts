import { configureStore } from "@reduxjs/toolkit";
import { globalSlices } from "./globalSlice";

export const store = configureStore({
    reducer:{
        globalStates: globalSlices.reducer,
    }
})