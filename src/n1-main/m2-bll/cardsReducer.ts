import {Dispatch} from "redux";
import {cardsAPI} from "./api/api";
import {AppStoreType} from "./store";
import {
    setCardsTotalCountAC,
    SetCardsTotalCountType,
    setSelectedCardIdAC,
    SetSelectedCardIdType
} from "./findAndPaginationReducer";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {setAppStatusAC, SetAppStatusAT} from "./appReducer";
import {setErrorAC} from "./passwordRecoveryReducer";

export const initialState: InitialStateType = {
    cards: [],
    grade: 1
}


export const cardsReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case 'cards/GET-CARDS':
            return {...state, cards: action.cards}
        case 'cards/UPDATE-GRADE':
            return {
                ...state,
                cards: state.cards.map(card => card.cardsPack_id === action.id ? {...card, grade: action.grade} : card)
            }

        default:
            return state
    }
}

export const getCardsAC = (cards: CardType[]) => ({type: "cards/GET-CARDS", cards} as const)
export const updateGradeAC = (grade: number, id: string) => ({type: "cards/UPDATE-GRADE", grade, id} as const)

export const getCardsTC = (id: string): ThunkType => (dispatch: Dispatch<ActionType>, getState: () => AppStoreType) => {
    const {page, sortCards} = getState().findAndPagination.cards
    const cardQuestion = getState().findAndPagination.cards.questionText
    const pageCount = getState().findAndPagination.cards.pageCount.toString()

    dispatch(setAppStatusAC({status: 'loading'}))
    cardsAPI.getCards(id, pageCount, page, cardQuestion, sortCards)
        .then((res) => {
            if (res.data.cards) {
                dispatch(getCardsAC(res.data.cards))
                dispatch(setCardsTotalCountAC(res.data.cardsTotalCount))
                dispatch(setSelectedCardIdAC(id))
            }
        })
        .catch(e => {
            dispatch(setErrorAC(e.response.data.error))
        })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const addCardsTC = (id: string, question: string, answer: string): ThunkType =>
    (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        cardsAPI.addCards(id, question, answer)
            .then((res) => {
                dispatch(getCardsTC(id))
            }).catch(e => {
            dispatch(setErrorAC(e.response.data.error))
        })
            .finally(() => {
                dispatch(setAppStatusAC({status: 'succeeded'} ))
            })
    }

export const delCardTC = (id: string, packId: string) => (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    cardsAPI.delCard(id)
        .then(() => {
            dispatch(getCardsTC(packId))
        }).catch(e => {
        dispatch(setErrorAC(e.response.data.error))
    })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const updateCardTC = (id: string, packId: string, question: string, answer: string) => (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    cardsAPI.updateCard(id, question, answer)
        .then(() => {
            dispatch(getCardsTC(packId))
        }).catch(e => {
        dispatch(setErrorAC(e.response.data.error))
    })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const updateGradeTC = (grade: number, card_id: string) => (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    return cardsAPI.updateGrade(grade, card_id)
        .then(() => {
            dispatch(updateGradeAC(grade, card_id))
        }).catch(e => {
            dispatch(setErrorAC(e.response.data.error))
        })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}

type ActionType =
    | ReturnType<typeof getCardsAC>
    | SetCardsTotalCountType
    | SetSelectedCardIdType
    | SetAppStatusAT
    | ReturnType<typeof updateGradeAC>
    | ReturnType<typeof setErrorAC>


type ThunkType = ThunkAction<void, AppStoreType, unknown, ActionType>

export type CardType = {
    answer: string
    answerImg: string
    answerVideo: string
    cardsPack_id: string
    comments: string
    created: string
    grade: number
    more_id: string
    question: string
    questionImg: string
    questionVideo: string
    rating: number
    shots: number
    type: string
    updated: string
    user_id: string
    __v: number
    _id: string
}

type InitialStateType = {
    cards: Array<CardType>
    grade: number
}

// todo: add catch

