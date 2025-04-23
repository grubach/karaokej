import { stopGame } from "../../utils/game";
import ActionIcon from "../parts/ActionIcon";

const StopGame = () => {
  return <ActionIcon onClick={stopGame} icon="■" />;
};
export default StopGame;
