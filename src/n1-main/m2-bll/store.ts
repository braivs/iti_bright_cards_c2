import {applyMiddleware, combineReducers, createStore} from "redux";
import {testReducer} from "./testReducer";
import thunkMiddleware from "redux-thunk";
import {authReducer} from "./authReducer";
import {profileReducer} from "./profileReducer";
import {registrationReducer} from "./registrationReducer";
import {passwordRecoveryReducer} from "./passwordRecoveryReducer";
import {appReducer} from "./appReducer";

const reducers = combineReducers({
    testReducer: testReducer,
    auth: authReducer,
    profile: profileReducer,
    registration: registrationReducer,
    recovery: passwordRecoveryReducer,
    app: appReducer,
})

export const store = createStore(reducers, applyMiddleware(thunkMiddleware))

export type AppStoreType = ReturnType<typeof reducers>

// @ts-ignore
window.store = store; // for dev