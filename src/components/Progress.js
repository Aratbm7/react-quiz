function Progress({ index, numQuestions, points, maxPoints }) {
  return (
    <header className="progress">
      <progress value={index + 1} max={numQuestions} />
      <p>
        <strong>{index + 1}</strong> / <strong>{numQuestions}</strong>
      </p>
      <p>
        <strong>{points}</strong> / <strong>{maxPoints}</strong>
      </p>
    </header>
  );
}

export default Progress;
