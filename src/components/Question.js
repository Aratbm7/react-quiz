import { useQuize } from "../contexts/QuizContext";
import Options from "./Options";

function Question() {
  const { questions, index } = useQuize();
  const question = questions.at(index);
  console.log(question);
  return (
    <h4 className="question">
      {question.question}
      <Options question={question} />
    </h4>
  );
}

export default Question;
