import { FiSquare } from "react-icons/fi";
import { stopGame } from "../../store/game";
import ActionIcon from "../parts/ActionIcon";

const StopGame = () => {
  return <ActionIcon onClick={stopGame} icon={FiSquare} />;
};
export default StopGame;
