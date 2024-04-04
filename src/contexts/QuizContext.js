import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

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

function QuizProvider({ children }) {
  const [
    { status, questions, index, answer, points, highScore, remainSec },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((perv, curr) => perv + curr.points, 0);

  useEffect(function () {
    fetch("http://localhost:9100/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "receiveData", payload: data }))
      .catch((err) => dispatch({ type: "errorReceiveData" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        status,
        questions,
        index,
        answer,
        points,
        highScore,
        remainSec,
        numQuestions,
        maxPoints,
        
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuize() {
  const context = useContext(QuizContext);

  if (context === "undifined")
    throw new Error("QuizProvider is used out of box");

  return context;
}

export { QuizProvider, useQuize };
