import style from "./App.module.css";
import Controls from "./controls/Controls";
import Cursor from "./Cursor";
import Player from "./Player";
import Program from "./Program";
import Track from "./Track";
import { Song } from "../utils/song";
import { useState } from "react";
import SongList from "./song-list/SongList";

function App() {
  const [currentSong, setCurrentSong] = useState<Song>();

  return (
    <div className={style.App}>
      <SongList currentSong={currentSong} setCurrentSong={setCurrentSong} />
      {currentSong && (
        <>
          <Controls />
          <Track>
            <Program song={currentSong} />
            {Array.from({ length: 1 }, (_, index) => (
              <Cursor key={index} historyIndex={index} song={currentSong} />
            ))}
          </Track>
          <Player song={currentSong} />
        </>
      )}
    </div>
  );
}

export default App;
