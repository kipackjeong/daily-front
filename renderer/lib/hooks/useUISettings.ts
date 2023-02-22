import { useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { toPrecision } from "@core//utils/helper";

const pixelPerHour = 100;
const pixelPerMinute = toPrecision((pixelPerHour * 1.0) / 60, 100);

const initSetting = {
  pixelPerHour,
  pixelPerMinute,
  incrementPixelPerHour: () => {},
  decrementPixelPerHour: () => {},
};

export const useUISetting = singletonHook(initSetting, () => {
  console.log("useUISetting");
  const [pixelPerHour, setPixelPerHour] = useState(initSetting.pixelPerHour);

  const [pixelPerMinute, setpixelPerMinute] = useState(
    initSetting.pixelPerMinute
  );

  const incrementPixelPerHour = () => {
    setPixelPerHour(pixelPerHour + 5);
    setpixelPerMinute(toPrecision(((pixelPerHour + 5) * 1.0) / 60, 100));
  };

  const decrementPixelPerHour = () => {
    setPixelPerHour(pixelPerHour - 5);
    setpixelPerMinute(toPrecision(((pixelPerHour - 5) * 1.0) / 60, 100));
  };
  return {
    pixelPerHour,
    pixelPerMinute,
    incrementPixelPerHour,
    decrementPixelPerHour,
  };
});
