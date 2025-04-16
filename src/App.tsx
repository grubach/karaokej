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
        <Cursor transpose={-12} />
        <Cursor transpose={0} />
        <Cursor transpose={12} />
        <Program song={song} />
      </Track>
    </div>
  );
}

export default App;
