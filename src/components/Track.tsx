import { PropsWithChildren } from "react";
import style from "./Track.module.css";

const Track = ({ children }: PropsWithChildren) => {
  return <div className={style.Track}>
    <div className={style.line}></div>
    {children}
    </div>;
};
export default Track;
