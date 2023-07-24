import {combineReducers} from "redux"
import {testReducer} from "./testReducer"
import thunkMiddleware from "redux-thunk"
import {authReducer} from "./authReducer"
import {profileReducer} from "./profileReducer"
import {registrationReducer} from "./registrationReducer"
import {passwordRecoveryReducer} from "./passwordRecoveryReducer"
import {appReducer} from "./appReducer"
import {packsReducer} from "./packsReducer"
import {cardsReducer} from "./cardsReducer"
import {findAndPaginationReducer} from "./findAndPaginationReducer"
import {modalReducer} from "./modalReducer"
import {configureStore} from "@reduxjs/toolkit"

const rootReducer = combineReducers({
    testReducer: testReducer,
    auth: authReducer,
    profile: profileReducer,
    registration: registrationReducer,
    recovery: passwordRecoveryReducer,
    app: appReducer,
    packs: packsReducer,
    cards: cardsReducer,
    findAndPagination: findAndPaginationReducer,
    modal: modalReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppStoreType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store // for dev