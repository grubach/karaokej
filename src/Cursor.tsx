import useDetect from "./hooks/useDetect";
import style from "./Cursor.module.css";
import { useRef } from "react";
import { NOTE_HEIGHT } from "./constants";

type Props = {
  transpose: number;
}

const Cursor = ({transpose}:Props) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  useDetect(
    (history) => {
      // if (!valueRef.current) return;
      const value = history[0];
      // valueRef.current.innerText = value ? value.toFixed(2) : "null";

      if (!cursorRef.current) return;
      if (value === null) {
        cursorRef.current.style.opacity = "0";
      } else {
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translateY(${
          (-(value + transpose) * NOTE_HEIGHT/2).toFixed(2)
        }px)`;
      }
    },
    [valueRef, cursorRef,transpose]
  );

  return (
    <div className={style.cursor} ref={cursorRef}>
      {/* <div ref={valueRef}>value</div> */}
    </div>
  );
};
export default Cursor;
