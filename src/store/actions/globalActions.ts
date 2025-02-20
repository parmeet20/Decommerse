import { GlobalState, IProduct, ProgramState } from "@/utils/interface";
import { PayloadAction } from '@reduxjs/toolkit';

export const globalStateActions = {
    setProduct:(state:GlobalState,actions:PayloadAction<IProduct>)=>{
        state.product = actions.payload;
    },
    setState:(state:GlobalState,actions:PayloadAction<ProgramState>)=>{
        state.programState = actions.payload;
    }
}