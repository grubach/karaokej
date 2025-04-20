import style from "./App.module.css";
import Controls from "./controls/Controls";
import Cursor from "./Cursor";
import Player from "./Player";
import Program from "./Program";
import Track from "./Track";
import { Song } from "../utils/song";
import { useState } from "react";
import SongList from "./song-list/SongList";
import Wait from "./Wait";

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
            <Wait song={currentSong} />
            {Array.from({ length: 10 }, (_, index) => (
              <Cursor
                key={index}
                tailIndex={index}
                historyIndex={index * 2}
                song={currentSong}
              />
            ))}
          </Track>
          <Player song={currentSong} />
        </>
      )}
    </div>
  );
}

export default App;
