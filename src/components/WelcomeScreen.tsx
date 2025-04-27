import { FiHeadphones } from "react-icons/fi";
import useStoreState from "../hooks/useStoreState";
import { appStore } from "../store/app";
import style from "./WelcomeScreen.module.css";
import { COLOR_CURSOR, NOTE_HEIGHT } from "../constants";

const WelcomeScreen = () => {
  const { appPhase } = useStoreState(appStore);
  if (appPhase !== "unstarted") return null;
  return (
    <div className={style.WelcomeScreen}>
      <FiHeadphones
        className={style.icon}
        size={3 * NOTE_HEIGHT}
        color={COLOR_CURSOR}
      />
      <div className={style.title}>Headphones recommended</div>
      <div className={style.description}>Select song from the list</div>
    </div>
  );
};
export default WelcomeScreen;
