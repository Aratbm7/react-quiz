import Options from "./Options"


function Question({question, dispatch, answer}) {
    return (
        <h4 className="question">
           {question.question}
           {console.log(question)}
           <Options question={question} dispatch={dispatch} answer={answer} />
        </h4>
    )
}

export default Question
