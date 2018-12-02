import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

const DEBUG = true;
const CENTER = {
  x: 150,
  y: 150
}

const debug = (msg) => {
  if (DEBUG) {
    try {
      console.log(JSON.stringify(msg, undefined, 2));
    } catch (err) {
      console.log(msg);
    }
  }
};

const getCircleCoors = (angle, radius, center) => ({
  x: center.x + radius * Math.sin(angle),
  y: center.y - radius * Math.cos(angle)
});

const dom = (() => {
  const elements = {};

  return elementId => {
    if (!(elementId in elements)) {
      debug(`Need to load ${elementId}`);

      const newElement = document.getElementById(elementId);
      elements[elementId] = newElement;

      return newElement;
    }

    return elements[elementId];
  };
})();

const initClock = () => {
  clock.granularity = "seconds";

  clock.ontick = (evt) => {
    const now = evt.date;
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Second hand
    const secondHandAngle = ((2 * Math.PI) / 60.0) * seconds;
    const secondHandInnerCoors = getCircleCoors(
      secondHandAngle + Math.PI,
      20,
      CENTER
    );
    const secondHandCoors = getCircleCoors(secondHandAngle, 145, CENTER);
    dom("second-hand").x1 = secondHandInnerCoors.x;
    dom("second-hand").y1 = secondHandInnerCoors.y;
    dom("second-hand").x2 = secondHandCoors.x;
    dom("second-hand").y2 = secondHandCoors.y;

    // Minute hand
    const minuteHandAngle = ((2 * Math.PI) / 60.0) * (minutes + seconds / 60.0);
    const minuteHandInnerCoors = {
      from: { x: 150, y: 150 },
      to: getCircleCoors(minuteHandAngle, 20, CENTER)
    };
    const minuteHandOuterCoors = {
      from: getCircleCoors(minuteHandAngle, 20, CENTER),
      to: getCircleCoors(minuteHandAngle, 145, CENTER)
    };
    dom("minute-hand-inner").x2 = minuteHandInnerCoors.to.x;
    dom("minute-hand-inner").y2 = minuteHandInnerCoors.to.y;
    dom("minute-hand-outer").x1 = minuteHandOuterCoors.from.x;
    dom("minute-hand-outer").y1 = minuteHandOuterCoors.from.y;
    dom("minute-hand-outer").x2 = minuteHandOuterCoors.to.x;
    dom("minute-hand-outer").y2 = minuteHandOuterCoors.to.y;

    // Hour hand
    const hourHandAngle =
      ((2 * Math.PI) / 12.0) *
      (hours + minutes / 60.0 + seconds / (60.0 * 60.0));
    const hourHandInnerCoors = {
      from: { x: 150, y: 150 },
      to: getCircleCoors(hourHandAngle, 20, CENTER)
    };
    const hourHandOuterCoors = {
      from: getCircleCoors(hourHandAngle, 20, CENTER),
      to: getCircleCoors(hourHandAngle, 90, CENTER)
    };
    const hourHandFillCoors = {
      from: getCircleCoors(hourHandAngle, 25, CENTER),
      to: getCircleCoors(hourHandAngle, 60, CENTER)
    };
    dom("hour-hand-inner").x2 = hourHandInnerCoors.to.x;
    dom("hour-hand-inner").y2 = hourHandInnerCoors.to.y;
    dom("hour-hand-outer").x1 = hourHandOuterCoors.from.x;
    dom("hour-hand-outer").y1 = hourHandOuterCoors.from.y;
    dom("hour-hand-outer").x2 = hourHandOuterCoors.to.x;
    dom("hour-hand-outer").y2 = hourHandOuterCoors.to.y;
    dom("hour-hand-fill").x1 = hourHandFillCoors.from.x;
    dom("hour-hand-fill").y1 = hourHandFillCoors.from.y;
    dom("hour-hand-fill").x2 = hourHandFillCoors.to.x;
    dom("hour-hand-fill").y2 = hourHandFillCoors.to.y;
  }
}

setTimeout(initClock, 100);