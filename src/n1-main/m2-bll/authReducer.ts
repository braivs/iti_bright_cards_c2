import {authAPI} from "./api/api";
import {Dispatch} from "redux";
import {setProfileAC, SetProfileType} from "./profileReducer";
import {setIsInitializeAC} from "./appReducer";

let initialState: InitialStateType = {
    isLoggedIn: false,
    error: null,
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'AUTH/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case 'AUTH/SET-IS-ERROR':
            return {...state, error: action.error}
        default:
            return {...state}
    }
}

// ActionsCreators
export const setIsLoggedInAC = (value: boolean) => {
    return ({type: 'AUTH/SET-IS-LOGGED-IN', value} as const)
}
export const setIsErrorAC = (error: string | null) => {
    return ({type: 'AUTH/SET-IS-ERROR', error} as const)
}

// Thunks
export const LoginTC = (email: string, password: string, rememberMe: boolean) => (dispatch: Dispatch<ActionsType>) => {
    authAPI.login({email, password, rememberMe})
        .then(res => {
                dispatch(setIsLoggedInAC(true))
                dispatch(setProfileAC(res.data))
            }
        )
        .catch(e => {
                dispatch(setIsErrorAC(e.response.data.error))
            }
        )
}
export const InitializeTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
                dispatch(setIsLoggedInAC(true))
                dispatch(setProfileAC(res.data))
            }
        )
        .catch(() => {
                dispatch(setIsLoggedInAC(false))
            }
        )
        .finally(() => {
            dispatch(setIsInitializeAC(true))
        })
}
export const LogoutTC = () => (dispatch: Dispatch) => {
    authAPI.logout()
        .then(() => {
                dispatch(setIsLoggedInAC(false))
                dispatch(setIsErrorAC(null))
            }
        )
        .catch(e => {
                dispatch(setIsErrorAC(e.response.data.error))
            }
        )
}

// Types
type InitialStateType = {
    isLoggedIn: boolean
    error: string | null
}
type ActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setIsErrorAC>
    | SetProfileType

