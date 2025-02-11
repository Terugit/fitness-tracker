export default function ExerciseList({ exercise }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
        {exercise.sets.map((set, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <p className="text-sm">
              Set {index + 1}: {set.weight} kg x {set.reps} reps
              {set.note && <span className="ml-2 text-gray-600">Note: {set.note}</span>}
            </p>
            <p className="text-xs text-gray-500">Timestamp: {new Date(set.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

