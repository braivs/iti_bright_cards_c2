import axios, {AxiosResponse} from "axios"
import {PackType} from "../packsReducer"
import {CardType} from "../cardsReducer"
import {SortCardsType, SortPackType} from "../findAndPaginationReducer"
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const instance = axios.create({
    // baseURL: 'http://localhost:7542/2.0/',
    baseURL: 'https://neko-back.herokuapp.com/2.0/',
    withCredentials: true,
})

const baseUrl = 'https://neko-back.herokuapp.com/2.0/'

export const authAPI = {
    login(data: LoginType) {
        return instance.post<AuthResponseType>('auth/login', data)
    },
    me() {
        return instance.post<AuthResponseType>('/auth/me', {})
    },
    logout() {
        return instance.delete('auth/me')
    },
    updateProfile(name: string, avatar: string) {
        return instance.put('auth/me', {name, avatar})
    }
}

export const authAPIUpg = createApi({
    reducerPath: 'authAPIUpg',
    baseQuery: fetchBaseQuery({baseUrl: 'https://neko-back.herokuapp.com/2.0/'}),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponseType, { data: LoginType }>({
            query: body => ({
                url: `auth/login`,
                method: 'POST',
                body: body.data,
            }),
        }),
    }),
})

export const registrationAPI = {
    registerUser(email: string, password: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType>>('auth/register', {
            email: email,
            password: password
        })
    },
}
export const RecoveryAPI = {
    recoveryPass(email: string) {
        return instance.post<recoveryType>('/auth/forgot', {
            email,
            from: "test-front-admin <ivanin.jay@gmail.com>",
            message: `<div style="background-color: lime; padding: 15px">password recovery link: 
                            <a href='http://localhost:3000/#/passwordnew/$token$'>link</a></div>`
        })
    },

    newPass(password: string, token: string) {
        return instance.post<recoveryType>('/auth/set-new-password', {
            password: password,
            resetPasswordToken: token,
        })
    }
}

export const packsAPI = {
    getPacks(user_id: string, pageCount: string, page: number, min: number, max: number, packName: string, sortPacks: SortPackType) {
        return instance.get<getPacksType>(`/cards/pack`, {
            params: {
                user_id: (user_id ? user_id : ''),
                pageCount, page, min, max, packName, sortPacks
            }
        })
    },
    addPacks(isPrivate: boolean, name: string) {
        return instance.post<getPacksType>(`/cards/pack`, {
            cardsPack: {
                name,
                private: isPrivate
            }
        })
    },
    delPacks(id: string) {
        return instance.delete<getPacksType>(`/cards/pack?id=${id}`)
    },
    updatePacks(id: string, name: string) {
        return instance.put<getPacksType>(`/cards/pack`, {
                cardsPack: {
                    _id: id,
                    name: name
                }
            }
        )
    },
}

export const cardsAPI = {
    getCards(id: string, pageCount: string, page: number, cardQuestion: string, sortCards: SortCardsType) {
        return instance.get<getCardType>(`/cards/card`, {
            params: {
                cardsPack_id: id, pageCount, page, cardQuestion, sortCards
            }
        })
    },
    addCards(cardsPack_id: string, question: string, answer: string) {
        return instance.post<getCardType>(`/cards/card`, {
            card: {
                cardsPack_id,
                question,
                answer,
                grade: Math.random() * 5,
                shots: 0,
            }
        })
    },
    delCard(id: string) {
        return instance.delete<getCardType>(`/cards/card?id=${id}`)
    },
    updateCard(id: string, question: string, answer: string) {
        return instance.put<getCardType>(`/cards/card`, {
                card: {
                    _id: id,
                    question: question,
                    answer: answer
                }
            }
        )
    },
    updateGrade(grade: number, card_id: string) {
        return instance.put<getCardType>(`/cards/grade`, {
                grade: grade,
                card_id: card_id
            }
        )
    },
}

export const packsAPIUpg = createApi({
    reducerPath: 'packsAPIUpg',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints: (builder) => ({
        getCards: builder.query<AuthResponseType, {
            id: string,
            pageCount: string,
            page: number,
            cardQuestion: string,
            sortCards: SortCardsType
        }>({
            query: ({id, pageCount, page, cardQuestion, sortCards}) => ({
                url: '/cards/card',
                params: {id, pageCount, page, cardQuestion, sortCards},
            }),
        }),
    }),
})

export const {useGetCardsQuery} = packsAPIUpg

export type LoginType = {
    email: string,
    password: string,
    rememberMe: boolean,
}
export type AuthResponseType = {
    avatar: string
    email: string
    name: string
    publicCardPacksCount: number
    _id: string
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
export type recoveryType = {
    error: string
    success: boolean
    info: string
}

export type getPacksType = {
    user_id?: string
    cardPacks: PackType[]
    cardPacksTotalCount: number // количество колод
    maxCardsCount: number
    minCardsCount: number
    page: number // выбранная страница
    pageCount: number // количество элементов на странице
    error: string
}
export type getCardType = {
    cards: CardType[]
    cardsTotalCount: number
}