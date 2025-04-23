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

const cursors = Array.from({ length: 10 }, (_, index) => index);

function App() {
  const [currentSong, setCurrentSong] = useState<Song>();

  return (
    <div className={style.App}>
      <SongList currentSong={currentSong} setCurrentSong={setCurrentSong} />
      {currentSong && (
        <>
          <Track song={currentSong}>
            <Program song={currentSong} />
            <Wait song={currentSong} />
            {cursors.map((index) => (
              <Cursor
                key={index}
                tailIndex={index}
                historyIndex={index * 2}
                song={currentSong}
              />
            ))}
          </Track>
          <Player song={currentSong} />
          <Controls />
        </>
      )}
    </div>
  );
}

export default App;
