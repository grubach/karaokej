import { PropsWithChildren, useState } from "react";
import style from "./HidePanel.module.css";
import ActionIcon from "./ActionIcon";
import cx from "classnames";

type Props = {
  direction: "left" | "right" | "up" | "down";
  className?: string;
};

const HidePanel = ({
  direction,
  children,
  className,
}: PropsWithChildren<Props>) => {
  const [hidden, setHidden] = useState(true);
    const toggleHidden = () => {
        setHidden((prev) => !prev);
    };
  return (
    <div
      className={cx(style.HidePanel, className, {
        [style.hidden]: hidden,
        [style.left]: direction === "left",
        [style.right]: direction === "right",
        [style.up]: direction === "up",
        [style.down]: direction === "down",
      })}
    >
   {children}
      <div
        className={cx(style.button, {
          [style.hidden]: hidden,
          [style.left]: direction === "left",
          [style.right]: direction === "right",
          [style.up]: direction === "up",
          [style.down]: direction === "down",
        })}
      >
        <ActionIcon icon="◀" onClick={
            toggleHidden
        } />
      </div>
    </div>
  );
};
export default HidePanel;
