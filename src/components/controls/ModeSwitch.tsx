import { appStore } from "../../store/app";
import useStoreState from "../../hooks/useStoreState";
import ActionIcon from "../parts/ActionIcon";
import { FiMusic, FiTarget } from "react-icons/fi";

const ModeSwitch = () => {
  const { gameMode } = useStoreState(appStore);

  const handleClick = () => {
    appStore.updateValue((store) => ({
      ...store,
      gameMode: store.gameMode === "sing" ? "train" : "sing",
    }));
  };

  return (
    <ActionIcon
      icon={gameMode === "sing" ? FiMusic : FiTarget}
      onClick={handleClick}
      // text={gameMode === "sing" ? "Sing" : "Train"}
    />
  );
};

export default ModeSwitch; 