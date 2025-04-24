import { PropsWithChildren } from "react";
import style from "./HidePanel.module.css";
import ActionIcon from "./ActionIcon";
import cx from "classnames";
import { IconType } from "react-icons";

type Props = {
  direction: "left" | "right" | "up" | "down";
  icon: IconType;
  className?: string;
  open: boolean;
  onToggle: (value: boolean) => void;
};

const HidePanel = ({
  direction,
  children,
  className,
  icon,
  open,
  onToggle,
}: PropsWithChildren<Props>) => {
  const handleClick = () => {
    onToggle(!open);
  };
  return (
    <div
      className={cx(style.HidePanel, className, {
        [style.hidden]: !open,
        [style.left]: direction === "left",
        [style.right]: direction === "right",
        [style.up]: direction === "up",
        [style.down]: direction === "down",
      })}
    >
      {children}
      <div
        className={cx(style.button, {
          [style.hidden]: !open,
          [style.left]: direction === "left",
          [style.right]: direction === "right",
          [style.up]: direction === "up",
          [style.down]: direction === "down",
        })}
      >
        <ActionIcon icon={icon} onClick={handleClick} />
      </div>
    </div>
  );
};
export default HidePanel;
