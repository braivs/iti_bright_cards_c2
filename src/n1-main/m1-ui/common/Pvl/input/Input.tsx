import React, {ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useState} from 'react'
import s from "./Input.module.scss";

import icon from '../../../../../assets/img/shape.svg';
import {inputDataType} from "../../../../../n2-features/f1-auth/a1-login/LoginForm";

export const Input: React.FC<PropsType> = (
    {inputData, value, onChange, onChangeText, isHidden, autoComplete, setInputType, ...restProps}
) => {
    const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
        onChange // если есть пропс onChange
        && onChange(e) // то передать ему е (поскольку onChange не обязателен)

        onChangeText && onChangeText(e.currentTarget.value)
    }

    const changeTypeHandler = () => {
        if (setInputType ) {inputData.type === 'password' ? setInputType('') : setInputType('password')}
    }

    // const [inputType, setInputType] = useState('password')

    return (
        <div className={s.input}>
            <input
                id={inputData.id}
                type={inputData.type}
                name={inputData.name}
                required {...restProps}
                value={value}
                onChange={onChangeCallback}
                className={isHidden ? s.isHidden : ''}
                autoComplete={autoComplete}
            />
            <label className={isHidden ? `${s.placeholder} ${s.isNone}` : s.placeholder}
                   htmlFor={inputData.for}>{inputData.label}</label>
            <img onClick={changeTypeHandler} className={s.icon} src={icon} alt="image" style={inputData.style}/>
        </div>
    );
}

// тип пропсов обычного инпута
type DefaultInputPropsType = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

type PropsType = DefaultInputPropsType & {
    inputData: inputDataType
    value?: string | number
    onChangeText?: (value: string) => void
    isHidden?: boolean
    autoComplete?: 'on' | 'off'
    setInputType?: React.Dispatch<React.SetStateAction<string>>
}