import style from "./App.module.css";
import Controls from "./controls/Controls";
import Cursor from "./Cursor";
import Player from "./Player";
import Program from "./Program";
import Track from "./Track";
import { song2 } from "../utils/song";
import { useState } from "react";
import SongList from "./song-list/SongList";

function App() {
  const [currentSong, setCurrentSong] = useState(song2);

  return (
    <div className={style.App}>
      <SongList currentSong={currentSong} setCurrentSong={setCurrentSong} />
      <Controls />
      <Track>
        <Program song={currentSong} />
        <Cursor historyIndex={0} song={currentSong} />
      </Track>
      <Player song={currentSong} />
    </div>
  );
}

export default App;
