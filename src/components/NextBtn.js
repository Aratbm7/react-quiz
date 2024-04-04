import { useQuize } from "../contexts/QuizContext";

function NextBtn() {
  const { answer, dispatch, index, numQuestions } = useQuize();
  if (answer === null) return;

  if (index < numQuestions - 1) {
    return (
      <div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "nextQuestion" })}
        >
          Next
        </button>
      </div>
    );
  }

  if (index === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
  }
}

export default NextBtn;
