import style from "./App.module.css";
import Controls from "./controls/Controls";
import Cursor from "./Cursor";
import Program from "./program/Program";
import Track from "./Track";
import SongList from "./song-list/SongList";
import Wait from "./Wait";
import ScoreScreen from "./ScoreScreen";
import WelcomeScreen from "./WelcomeScreen";

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
      <WelcomeScreen />
      <ScoreScreen />
    </div>
  );
}

export default App;
