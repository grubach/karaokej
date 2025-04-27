import style from "./Score.module.css";

const Score = () => {
  return (
    <div className={style.Score}>
      <div className={style.score}>
        <div className={style.scoreText}>Score</div>
        <div className={style.scoreValue}>0</div>
      </div>
      <div className={style.combo}>
        <div className={style.comboText}>Combo</div>
        <div className={style.comboValue}>0</div>
      </div>
    </div>
  );
};
export default Score;
