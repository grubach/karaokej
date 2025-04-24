import style from "./ActionIcon.module.css";
import { IconType } from "react-icons";
import { NOTE_HEIGHT, STROKE_WIDTH } from "../../constants";

type Props = {
  icon: IconType;
  onClick: () => void;
  disabled?: boolean;
};

const ActionIcon = ({ icon: Icon, onClick, disabled = false }: Props) => {
  return (
    <button className={style.ActionIcon} onClick={onClick} disabled={disabled}>
      <Icon
        size={1.5 * NOTE_HEIGHT}
        strokeWidth={STROKE_WIDTH}
        stroke="currentColor"
      />
    </button>
  );
};
export default ActionIcon;
