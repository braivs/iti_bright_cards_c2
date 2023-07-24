import s from "./ProfileForm.module.scss";
import Subtitle from "../../../n1-main/m1-ui/common/Pvl/subtitle/Subtitle.jsx";
import {Input} from "../../../n1-main/m1-ui/common/Pvl/input/Input";

import img from "../../../assets/img/photo-profile.png";
import icon from "../../../assets/img/photo-icon.svg";
import {useDispatch, useSelector} from "react-redux";
import {AppStoreType} from "../../../n1-main/m2-bll/store";
import {AuthResponseType} from "../../../n1-main/m2-bll/api/api";
import {Navigate, NavigateOptions} from "react-router-dom";
import React, {ChangeEvent, useRef, useState} from "react";
import Button from "../../../n1-main/m1-ui/common/Pvl/button/Button";
import {profileUpdateAC, UpdateProfileTC} from "../../../n1-main/m2-bll/authReducer";
import {buttonCancelColor} from "../../../n1-main/m1-ui/common/styles/inlineVariables";

// данные для input nickname
const inputData1 = {
    id: "nickname",
    type: "text",
    name: "nickname",
    for: "nickname",
    label: "Nickname",
    style: {
        display: "none"
    }
}

// данные для input email
const inputData2 = {
    id: "email",
    type: "email",
    name: "email",
    for: "email",
    label: "Email",
    style: {
        display: "none"
    }
}

// данные для input publicCardPacksCount
const inputData3 = {
    id: "publicCardPacksCount",
    type: "text",
    name: "publicCardPacksCount",
    for: "publicCardPacksCount",
    label: "OldCards packs count",
    style: {
        display: "none"
    }
}


// стилизация кнопок
const styleButton1 = {
    backgroundColor: buttonCancelColor,
    color: "#21268F",
    width: "124px",
    boxShadow: "none"
}

const styleButton2 = {
    width: "124px"
}

export default function ProfileForm() {
    const isLoggedIn = useSelector<AppStoreType, boolean>(state => state.auth.isLoggedIn)
    const avatarFromState = useSelector<AppStoreType, string>(state => state.auth.avatar)

    const {
        name,
        email,
        publicCardPacksCount,
        avatar
    } = useSelector<AppStoreType, AuthResponseType>(state => state.profile)

    const dispatch = useDispatch()
    const [error, setError] = useState(false)
    const [newNickname, setNewNickname] = useState<string>(name)

    const [isEditMode, setIsEditMode] = useState(false)
    const [width, setWidth] = useState(0)

    const inRef = useRef<HTMLInputElement>(null);

    const upload = (e: ChangeEvent<HTMLInputElement>) => {
        let reader = new FileReader();
        const image = new Image()

        const newFile = e.target.files && e.target.files[0];

        try {
            reader.readAsDataURL(newFile as Blob);
            reader.onload = () => {
                image.src = reader.result as string;

                image.onload = () => {
                    setWidth(image.width)
                    if (image.width === 96 && image.height === 96) {
                        setError(false)
                        dispatch(profileUpdateAC({avatar: reader.result as string}))
                    } else setError(true)
                }

            };
            reader.onerror = (error) => {
            }
        } catch {
            console.log('error in reader.readAsDataURL')
        }

    }

    const goToEditModeHandler = () => {
        setIsEditMode(true)
    }

    const cancelEditHandler = () => {
        setIsEditMode(false)
    }

    const saveEditHandler = () => {
        setIsEditMode(false)
        dispatch(UpdateProfileTC(newNickname, avatarFromState))
    }

    if (!isLoggedIn) {
        return <Navigate to="/login"/>
    }
    return (
        <>
            <input
                ref={inRef}
                type={'file'}
                accept=".jpg, .jpeg, .png"
                style={{display: 'none'}}
                onChange={upload}
            /> {/*for select file dialog*/}

            <div>
                <div className={!isEditMode ? s.contentWrap : `${s.contentWrap} ${s.contentWrapEditOn}`}>
                    <Subtitle subtitle="Personal Information"/>
                    <div className={s.img}>
                        <img src={isEditMode ? (avatarFromState ? avatarFromState : avatar) : avatar} alt="img"
                             className={s.picture}/>

                        {
                            isEditMode
                                ?
                                <div className={s.icon} onClick={() => inRef && inRef.current && inRef.current.click()}>
                                    <img src={icon} alt="icon"/>
                                </div>
                                : <div></div>
                        }
                    </div>
                    {isEditMode && error && <div className={s.error}>Avatar must be 96x96px</div>}
                    {isEditMode
                        ? <div className={s.editOn}><Input inputData={inputData1} value={newNickname}
                                                           onChangeText={setNewNickname}/></div>
                        : <Input inputData={inputData1} value={name} autoComplete={'off'}/>
                    }
                    <Input inputData={inputData2} value={email} onChange={() => {
                    }} isHidden={isEditMode}/>
                    <Input inputData={inputData3} value={publicCardPacksCount} onChange={() => {
                    }} isHidden={isEditMode}/>

                    {isEditMode
                        ? <div className={s.block}>
                            <Button label="Cancel" style={styleButton1} onClick={cancelEditHandler}/>
                            <Button label="Save" style={styleButton2} onClick={saveEditHandler} disabled={error}/>
                        </div>
                        : <div className={`${s.block} ${s.onEditMode}`}>
                            <Button label="Edit" style={styleButton2} onClick={goToEditModeHandler}/>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

