import { PropsWithChildren } from "react";
import style from "./Track.module.css";

const Track = ({ children }: PropsWithChildren) => {
  return <div className={style.container}>{children}</div>;
};
export default Track;
