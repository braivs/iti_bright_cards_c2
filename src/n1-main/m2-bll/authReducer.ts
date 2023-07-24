import {authAPI} from "./api/api";
import {Dispatch} from "redux";
import {setProfileAC, SetProfileType} from "./profileReducer";
import {setAppStatusAC, SetAppStatusAT, setIsInitializeAC} from "./appReducer";
import {AppStoreType} from "./store";
import {ThunkAction} from "redux-thunk";

let initialState: InitialStateType = {
    isLoggedIn: false,
    error: null,
    avatar: '',
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'AUTH/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case 'AUTH/SET-IS-ERROR':
            return {...state, error: action.error}
        case "AUTH/PROFILE-UPDATE":
            return {...state, avatar: action.avatar}
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
export const profileUpdateAC = (avatar: string) => {
    return ({type: 'AUTH/PROFILE-UPDATE', avatar} as const)
}

// Thunks
export const LoginTC = (email: string, password: string, rememberMe: boolean) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
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
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'succeeded'}))
        })
}
export const InitializeTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'} ))
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
            dispatch(setIsInitializeAC({ isInitilize: true}))
            dispatch(setAppStatusAC({ status: 'succeeded'}))
        })
}
export const LogoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'} ))
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
            dispatch(profileUpdateAC(avatar))
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

