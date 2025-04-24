import ActionIcon from "../parts/ActionIcon";
import { useEffect, useState } from "react";
import { setVideoSpeed } from "../../utils/player";
import { appStore } from "../../utils/app";

const speedValues = ["1", "0.5", "0.75"];

const Speed = () => {
  const [speed, setSpeed] = useState(0);

  const handleClick = () => {
    setSpeed((prevSpeed) => {
      const nextSpeed = (prevSpeed + 1) % speedValues.length;
      return nextSpeed;
    });
  };

  useEffect(() => {
    const newSpeed = parseFloat(speedValues[speed]);
    setVideoSpeed(newSpeed);
    appStore.updateValue((store) => ({
      ...store,
      speed: newSpeed,
    }));
  }, [speed]);

  const label = speedValues[speed];

  return <ActionIcon onClick={handleClick} text={label} />;
};
export default Speed;
