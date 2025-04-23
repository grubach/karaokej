import { FiSquare } from "react-icons/fi";
import { stopGame } from "../../utils/game";
import ActionIcon from "../parts/ActionIcon";
import { NOTE_HEIGHT } from "../../constants";

const StopGame = () => {
  return (
    <ActionIcon
      onClick={stopGame}
      icon={
        <FiSquare
          size={1.5 * NOTE_HEIGHT}
          strokeWidth={2}
          stroke="currentColor"
          fill="currentColor"
        />
      }
    />
  );
};
export default StopGame;
