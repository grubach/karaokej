import { appStore } from "../../store/app";
import useStoreState from "../../hooks/useStoreState";
import ActionIcon from "../parts/ActionIcon";
import { stopGame } from "../../game";
import { FiMusic, FiTarget } from "react-icons/fi";

const ModeSwitch = () => {
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
    <ActionIcon
      icon={gameMode === "sing" ? FiTarget : FiMusic}
      onClick={handleClick}
    />
  );
};

export default ModeSwitch;
