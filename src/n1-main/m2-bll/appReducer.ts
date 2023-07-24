import {createSlice, PayloadAction} from "@reduxjs/toolkit"

let initialState: InitialStateType = {
    isInitilize: false,
    error:null,
    message:null,
    status: 'idle',
}

export const appSlice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setIsInitializeAC(state, action: PayloadAction<{ isInitilize: boolean }>) {
            state.isInitilize = action.payload.isInitilize
        },
        setAppError(state, action: PayloadAction<{error: string}>) {
            state.error = action.payload.error
        },
        setAppMessage(state, action: PayloadAction<{message: string}>) {
            state.message = action.payload.message
        },
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        }
    }
})

export const appReducer = appSlice.reducer
export const {
    setAppStatusAC,
    setIsInitializeAC,
    setAppMessage,
    setAppError
} = appSlice.actions

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// Types
type InitialStateType = {
    isInitilize: boolean
    error: null | string
    message: null | string
    status: RequestStatusType
}

export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>