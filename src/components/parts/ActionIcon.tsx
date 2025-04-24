import style from "./ActionIcon.module.css";
import { IconType } from "react-icons";
import { NOTE_HEIGHT, STROKE_WIDTH } from "../../constants";

type Props = {
  icon?: IconType;
  text?: string;
  onClick: () => void;
  disabled?: boolean;
};

const ActionIcon = ({ icon: Icon, text, onClick, disabled = false }: Props) => {
  return (
    <button className={style.ActionIcon} onClick={onClick} disabled={disabled}>
      {Icon && (
        <Icon
          size={1.5 * NOTE_HEIGHT}
          strokeWidth={STROKE_WIDTH}
          stroke="currentColor"
        />
      )}
      {text && <span className={style.text}>{text}</span>}
    </button>
  );
};
export default ActionIcon;
