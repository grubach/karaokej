import style from "./App.module.css";
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
        <Cursor historyIndex={0} />
      </Track>
    </div>
  );
}

export default App;
