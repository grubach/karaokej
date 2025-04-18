import style from "./App.module.css";
import Controls from "./Controls";
import Cursor from "./Cursor";
import Player from "./Player";
import Program from "./Program";
import Track from "./Track";
import { song2 } from "./utils/song";

function App() {
  return (
    <div className={style.App}>
      <Controls />
      <Track>
        <Program song={song2} />
        <Cursor historyIndex={0} song={song2} />
      </Track>
      <Player />
    </div>
  );
}

export default App;
