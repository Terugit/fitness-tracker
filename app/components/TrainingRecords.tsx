import ExerciseList from "./ExerciseList"

export default function TrainingRecords({ exercises }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Training Records</h2>
      {exercises.length === 0 ? (
        <p>No exercises recorded yet.</p>
      ) : (
        exercises.map((exercise, index) => <ExerciseList key={index} exercise={exercise} />)
      )}
    </div>
  )
}

