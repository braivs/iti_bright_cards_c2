import {authAPI} from "./api/api"
import {Dispatch} from "redux"
import {setProfileAC, SetProfileType} from "./profileReducer"
import {setAppStatusAC, SetAppStatusAT, setIsInitializeAC} from "./appReducer"
import {AppStoreType} from "./store"
import {ThunkAction} from "redux-thunk"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

let initialState: InitialStateType = {
    isLoggedIn: false,
    error: null,
    avatar: '',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        },
        setIsErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        profileUpdateAC(state, action: PayloadAction<{ avatar: string }>) {
            state.avatar = action.payload.avatar
        }
    }
})

export const authReducer = authSlice.reducer

export const {
    setIsLoggedInAC,
    profileUpdateAC,
    setIsErrorAC
} = authSlice.actions

// Thunks
export const LoginTC = (email: string, password: string, rememberMe: boolean) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login({email, password, rememberMe})
        .then(res => {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setProfileAC(res.data))
            }
        )
        .catch(e => {
                dispatch(setIsErrorAC(e.response.data.error))
            }
        )
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'succeeded'}))
        })
}
export const InitializeTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'} ))
    authAPI.me()
        .then(res => {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setProfileAC(res.data))
            }
        )
        .catch(() => {
                dispatch(setIsLoggedInAC({value: false}))
            }
        )
        .finally(() => {
            dispatch(setIsInitializeAC({ isInitilize: true}))
            dispatch(setAppStatusAC({ status: 'succeeded'}))
        })
}
export const LogoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'} ))
    authAPI.logout()
        .then(() => {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setIsErrorAC({error: null}))
            }
        )
        .catch(e => {
                dispatch(setIsErrorAC(e.response.data.error))
            }
        )
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'} ))
        })
}
export const UpdateProfileTC = (name: string, avatar: string): ThunkType =>
    (dispatch, getState: () => AppStoreType) => {
    // const name = getState().profile.name
    dispatch(setAppStatusAC({status: 'loading'} ))
    authAPI.updateProfile(name, avatar)
        .then(() => {
            dispatch(profileUpdateAC({avatar}))
        })
        .then(() => {
            dispatch(InitializeTC())
        })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'} ))
        })
}

// Types
type InitialStateType = {
    isLoggedIn: boolean
    error: string | null
    avatar: string
}
type ActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setIsErrorAC>
    | SetProfileType
    | SetAppStatusAT
    | ReturnType<typeof profileUpdateAC>

type ThunkType = ThunkAction<void, AppStoreType, unknown, ActionsType>

