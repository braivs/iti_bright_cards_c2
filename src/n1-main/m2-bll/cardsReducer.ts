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

export const initialState: CardType[] = []

export const cardsReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case 'cards/GET-CARDS':
            return [...action.cards]
        default:
            return state
    }
}

export const getCardsAC = (cards: CardType[]) => ({type: "cards/GET-CARDS", cards} as const)

export const getCardsTC = (id: string): ThunkType => (dispatch: Dispatch<ActionType>, getState: () => AppStoreType) => {
    const page = getState().findAndPagination.cards.page
    const pageCount = getState().findAndPagination.cards.pageCount.toString()
    const cardQuestion = getState().findAndPagination.cards.questionText
    const sortCards = getState().findAndPagination.cards.sortCards

    cardsAPI.getCards(id, pageCount, page, cardQuestion, sortCards)
        .then((res) => {
            if (res.data.cards) {
                dispatch(getCardsAC(res.data.cards))
                dispatch(setCardsTotalCountAC(res.data.cardsTotalCount))
                dispatch(setSelectedCardIdAC(id))
            }
        })
}
export const addCardsTC = (id: string, question: string, answer: string): ThunkType =>
    (dispatch: ThunkDispatch<AppStoreType, unknown, ActionType>) => {
    cardsAPI.addCards(id, question, answer)
        .then((res) => {
            dispatch(getCardsTC(id))
        })
}

type ActionType = ReturnType<typeof getCardsAC> | SetCardsTotalCountType | SetSelectedCardIdType
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

