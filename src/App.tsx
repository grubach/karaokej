import style from "./App.module.css";
import { CURSOR_TAIL, HISTORY_SIZE } from "./constants";
import Controls from "./Controls";
import Cursor from "./Cursor";
import Program from "./Program";
import Track from "./Track";
import { song } from "./utils/song";

function App() {
  return (
    <div className={style.App}>
      <Controls />
      <Track>
        <Program song={song} />
        {Array.from({ length: CURSOR_TAIL }, (_, index) => (
          <Cursor key={index} historyIndex={index} />
        ))}
      </Track>
    </div>
  );
}

export default App;
