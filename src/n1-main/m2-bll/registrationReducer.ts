import {Dispatch} from "redux";
import {registrationAPI} from "./api/api";
import {setAppStatusAC, SetAppStatusAT} from "./appReducer";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    message: null,
}

export const registrationReducer = (state = initialState, action: ActionsType) => {
    switch (action.type) {
        case "registrationReducer/SET-REGISTER-STATUS":
            return {
                ...state, status: action.status
            }
        case "registrationReducer/SET-REGISTER-ERROR":
            return {
                ...state, error: action.error
            }
        case "registrationReducer/SET-REGISTER-MESSAGE":
            return {
                ...state, message: action.message
            }
        default:
            return state
    }
}

export const setRegisterStatus = (status: RequestStatusType) =>
    ({type: "registrationReducer/SET-REGISTER-STATUS", status} as const)
export const setRegisterError = (error: string | null) =>
    ({type: "registrationReducer/SET-REGISTER-ERROR", error} as const)
export const setRegisterMessage = (message: string | null) =>
    ({type: "registrationReducer/SET-REGISTER-MESSAGE", message} as const)


export const createNewUser = (email: string, password: string) => (dispatch: Dispatch<ActionsType /*| SetAppErrorActionType | SetAppStatusActionType*/>) => {
    dispatch(setRegisterStatus('loading'))
    dispatch(setAppStatusAC({status: 'loading'} ))
    registrationAPI.registerUser(email, password)
        .then(res => {
            dispatch(setRegisterMessage('success!'))
            dispatch(setRegisterStatus('succeeded'))
            setTimeout(() => {
                dispatch(setRegisterStatus('register_success'))
                dispatch(setRegisterMessage(null))
                dispatch(setRegisterStatus('idle'))
            }, 2000)
        })
        .catch((error) => {
            dispatch(setRegisterError(error.response.data.error))
            dispatch(setRegisterStatus('failed'))
            setTimeout(() => {
                dispatch(setRegisterError(null))
            }, 2000)
        })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'} ))
        })
}


type InitialStateType = {
    status: RequestStatusType
    error: string | null
    message: string | null
}
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' | 'register_success'

type ActionsType =
    | ReturnType<typeof setRegisterStatus>
    | ReturnType<typeof setRegisterError>
    | ReturnType<typeof setRegisterMessage>
    | SetAppStatusAT
