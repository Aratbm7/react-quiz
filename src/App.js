import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const initialState = {
  questions: [],

  // loading ,ready, error,
  status: "loading",
};

function reducer(state, action) {
  switch (action.type) {
    case "receiveData":
      return { ...state, questions: action.payload, status: "ready" };
    case "errorReceiveData":
      return { ...state, status: "error" };

    default:
      throw new Error("unknown Action")
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  console.log(state)

  useEffect(function () {
    fetch("http://localhost:9100/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "receiveData", payload: data }))
      .catch((err) => dispatch({ type: "errorReceiveData" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        <p>1/2</p>
        <p>question</p>
      </Main>
    </div>
  );
}
