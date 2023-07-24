import {Dispatch} from "redux";
import {packsAPI} from "./api/api";
import {AppStoreType} from "./store";
import {setCardPacksTotalCountAC, SetCardPacksTotalCountType} from "./findAndPaginationReducer";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {setAppStatusAC, SetAppStatusAT} from "./appReducer";
import {setErrorAC} from "./passwordRecoveryReducer";

export const initialState: packsStateType = {
    cardPacks: [],
    packUser_id: '',
}

export const packsReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case 'pack/GET-CARD-PACKS':
            return {...state, cardPacks: action.cardPacks}
        case 'pack/GET-USER-ID':
            return {...state, packUser_id: action.packUser_id}
        case "pack/ADD-CARD-PACKS":
            return {...state, name: action.name}
        default:
            return state
    }
}

export const getPacksAC = (cardPacks: PackType[]) => ({type: "pack/GET-CARD-PACKS", cardPacks} as const)
export const getUserIdAC = (packUser_id: string) => ({type: "pack/GET-USER-ID", packUser_id} as const)
export const addPacksAC = (name: string) => ({type: "pack/ADD-CARD-PACKS", name} as const)


export const getPacksTC = (): ThunkType => (dispatch: Dispatch<ActionType>, getState: () => AppStoreType) => {
    const {page, min, max, packName, sortPacks} = getState().findAndPagination.cardPacks
    const pageCount = getState().findAndPagination.cardPacks.pageCount.toString()
    const user_id = getState().packs.packUser_id

    dispatch(setAppStatusAC({status: 'loading'}))
    return packsAPI.getPacks(user_id, pageCount, page, min, max, packName, sortPacks)
        .then((res) => {
            dispatch(getPacksAC(res.data.cardPacks))
            dispatch(setCardPacksTotalCountAC(res.data.cardPacksTotalCount))
        }).catch((e) => {
            dispatch(setErrorAC(e.response.data.error))
        })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'} ))
        })
}

export const addPacksTC = (cardPackName: string): ThunkType => (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
    dispatch(setAppStatusAC({ status: 'loading'}))
    packsAPI.addPacks(false, cardPackName)
        .then((res) => {
            dispatch(addPacksAC(cardPackName))
            dispatch(getPacksTC())
        }).catch(e => {
        dispatch(setErrorAC(e.response.data.error))
    })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}


export const delPacksTC = (id: string) => (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    packsAPI.delPacks(id)
        .then(() => {
            dispatch(getPacksTC())
        }).catch(e => {
        dispatch(setErrorAC(e.response.data.error))
    })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const updatePacksTC = (id: string, name: string) => (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
    dispatch(setAppStatusAC({status: 'loading'} ))
    packsAPI.updatePacks(id, name)
        .then(() => {
            dispatch(getPacksTC())
        }).catch(e => {
        dispatch(setErrorAC(e.response.data.error))
    })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}

type ThunkType = ThunkAction<void, AppStoreType, unknown, ActionType>

export type PackType = {
    _id: string
    user_id: string
    user_name: string
    private: boolean
    name: string
    path: string
    grade: number
    cardsCount: number
    type: string
    rating: number
    created: string
    updated: string
}

export type packsStateType = {
    cardPacks: PackType[]
    packUser_id: string
}

type ActionType =
    | ReturnType<typeof getPacksAC>
    | ReturnType<typeof getUserIdAC>
    | SetCardPacksTotalCountType
    | ReturnType<typeof addPacksAC>
    | SetAppStatusAT
    | ReturnType<typeof setErrorAC>


//todo: add catch. For example if no internet.