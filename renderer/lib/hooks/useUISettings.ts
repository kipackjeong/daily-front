import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

const pixelPerHour = 100;

const initSetting = {
  pixelPerHour,
  incrementPixelPerHour: () => {},
  decrementPixelPerHour: () => {},
};

export const useUISetting = singletonHook(initSetting, () => {
  console.log("useUISetting");
  const [pixelPerHour, setPixelPerHour] = useState(initSetting.pixelPerHour);

  const incrementPixelPerHour = () => {
    setPixelPerHour(pixelPerHour + 5);
  };

  const decrementPixelPerHour = () => {
    setPixelPerHour(pixelPerHour - 5);
  };
  return { pixelPerHour, incrementPixelPerHour, decrementPixelPerHour };
});
