import s from "./Input.module.scss";

import icon from './../../../img/shape.svg';

export default function Input(props) {
   return (
      <div className={s.input}>
         <input id={props.inputData.id} type={props.inputData.type} name={props.inputData.name} required />
         <label className={s.placeholder} htmlFor={props.inputData.for}>{props.inputData.label}</label>
         <img className={s.icon} src={icon} alt="image" style={props.inputData.style} />
      </div>
   );
}
