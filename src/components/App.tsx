import style from "./App.module.css";
import Controls from "./controls/Controls";
import Cursor from "./Cursor";
import Program from "./Program";
import Track from "./Track";
import SongList from "./song-list/SongList";
import Wait from "./Wait";
import Score from "./Score";

const cursors = Array.from({ length: 10 }, (_, index) => index);

function App() {
  return (
    <div className={style.App}>
      <SongList />
      <Track>
        <Program />
        <Wait />
        {cursors.map((index) => (
          <Cursor key={index} tailIndex={index} historyIndex={index * 2} />
        ))}
      </Track>
      <Controls />
      <Score />
    </div>
  );
}

export default App;
