import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "../Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextBtn from "./NextBtn";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],

  // loading ,ready, error, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  remainSec: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "receiveData":
      return { ...state, questions: action.payload, status: "ready" };

    case "errorReceiveData":
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        status: "active",
        remainSec: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index++,
        answer: null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
      };
    // return {
    //   ...state,
    //   index: 0,
    //   points: 0,
    //   answer: null,
    //   status: "active",
    // };

    case "tick-tack":
      return {
        ...state,
        remainSec: state.remainSec--,
        status: state.remainSec === -1 ? "finished" : state.status,
      };

    default:
      throw new Error("unknown Action");
  }
}

export default function App() {
  const [
    { status, questions, index, answer, points, highScore, remainSec },
    dispatch,
  ] = useReducer(reducer, initialState);

  console.log(questions);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((perv, curr) => perv + curr.points, 0);

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
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}

        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <NextBtn
                answer={answer}
                dispatch={dispatch}
                index={index}
                numQuestion={numQuestions}
              />

              <Timer sec={remainSec} dispatch={dispatch} />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
