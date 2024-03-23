import { useEffect } from "react";

// In this case when Timer component re-rendered actually app componnent is
// re-rendered and all children component re-renderd too, This issue
// in large application can be make performance isuue
function Timer({ dispatch, sec }) {
  const min = Math.floor(sec / 60);
  const secend = sec % 60;
  useEffect(function () {
    const id = setInterval(() => {
      dispatch({ type: "tick-tack" });
    }, 1000);

    return () => clearInterval(id);
  });

  return (
    <div className="timer">
      {min < 10 ? "0" : ""}
      {min} : {secend < 10 ? "0" : ""}
      {secend}
    </div>
  );
}

export default Timer;
