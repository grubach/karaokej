import { ReactNode } from "react";
import style from "./ActionIcon.module.css";

type Props = {
  icon: ReactNode
  onClick: () => void;
  disabled?: boolean;
};

const ActionIcon = ({ icon, onClick, disabled = false }: Props) => {
  return (
    <button className={style.ActionIcon} onClick={onClick} disabled={disabled}>
      {icon}
    </button>
  );
};
export default ActionIcon;
