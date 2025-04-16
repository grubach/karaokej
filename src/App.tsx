import style from "./App.module.css";
import Controls from "./Controls";
import Cursor from "./Cursor";
import Track from "./Track";

function App() {
  return (
    <div className={style.container}>
      <Controls />
      <Track>
      <Cursor 
      transpose={-12} 
      />
        <Cursor 
        transpose={0} 
        />
        <Cursor 
        transpose={12} 
        />
      </Track>
    </div>
  );
}

export default App;
