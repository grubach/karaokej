import style from "./ActionIcon.module.css";

type Props = {
  icon: string;
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
