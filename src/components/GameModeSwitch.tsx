import { appStore } from "../store/app";
import useStoreState from "../hooks/useStoreState";
import ActionIcon from "./parts/ActionIcon";
import { stopGame } from "../game";
import { FiMusic, FiTarget } from "react-icons/fi";
import style from "./GameModeSwitch.module.css";

const GameModeSwitch = () => {
  const { gameMode } = useStoreState(appStore);

  const handleClick = () => {
    stopGame();
    appStore.resetValue();
    appStore.updateValue((store) => ({
      ...store,
      gameMode: gameMode === "sing" ? "train" : "sing",
    }));
  };

  return (
    <div className={style.GameModeSwitch}>
      <ActionIcon
        icon={gameMode === "sing" ? FiTarget : FiMusic}
        onClick={handleClick}
        tooltip={gameMode === "sing" ? "Switch to Training Mode" : "Switch to Singing Mode"}
      />
    </div>
  );
};

export default GameModeSwitch; 