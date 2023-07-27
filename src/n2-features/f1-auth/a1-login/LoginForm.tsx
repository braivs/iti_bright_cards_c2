import React from 'react'
import s from "./LoginForm.module.scss";
import {Navigate, NavLink} from "react-router-dom";
import Title from "../../../n1-main/m1-ui/common/Pvl/title/Title.jsx";
import Subtitle from "../../../n1-main/m1-ui/common/Pvl/subtitle/Subtitle.jsx";
import CheckboxLabel from "../../../n1-main/m1-ui/common/Pvl/checkbox/CheckboxLabel.jsx";
import {Input} from "../../../n1-main/m1-ui/common/Pvl/input/Input";
import {useDispatch, useSelector} from "react-redux";
import {AppStoreType} from "../../../n1-main/m2-bll/store";
import {useFormik} from "formik";
import {LoginTC} from "../../../n1-main/m2-bll/authReducer";
import Button from "../../../n1-main/m1-ui/common/Pvl/button/Button";

// данные для input email
const inputData1: inputDataType = {
    id: "email",
    type: "email",
    name: "email",
    for: "email",
    label: "Email",
    style: {
        display: "none"
    }
}

// данные для input password
const inputData2: inputDataType = {
    id: "password",
    type: "password",
    name: "password",
    for: "password",
    label: "Password",
    style: {
        display: "inlineBlock"
    }
}

export default function LoginForm() {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector<AppStoreType, boolean>(state => state.auth.isLoggedIn)
    const errorFromServer = useSelector<AppStoreType, string | null>(state => state.auth.error)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: values => {
            dispatch(LoginTC({email: values.email, password: values.password, rememberMe: values.rememberMe}));
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Required';
            }
            return errors
        },
    },);

    if (isLoggedIn) {
        return <Navigate to="/profile"/>
    }

    return (
        <form action="" onSubmit={formik.handleSubmit}>
            <div className={s.contentWrap}>
                <Title/>
                <Subtitle subtitle="Sign In"/>
                <Input
                    inputData={inputData1}
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className={s.error}>{formik.errors.email}</div>
                ) : null}
                <Input
                    inputData={inputData2}
                    {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className={s.error}>{formik.errors.password}</div>
                ) : null}
                {errorFromServer ? <span className={s.error}>{errorFromServer}</span> : null}
                <div className={s.block}>
                    <CheckboxLabel
                        id="rememberMe"
                        label="Remember Me"
                        {...formik.getFieldProps('rememberMe')}
                    />
                    <NavLink className={s.linkForgotPass} to={'/passwordrecovery'}>Forgot password</NavLink>
                </div>
                <Button label="Login" type={'submit'}/>
                <span className={s.question}>Don’t have an account?</span>
                <NavLink className={s.linkSignUp} to={'/registration'}>Sign Up</NavLink>
            </div>
        </form>
    );
}

export type inputDataType = {
    id?: string
    type?: string
    name?: string
    for?: string
    label?: string
    style: {
        display: string
    }
}

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

