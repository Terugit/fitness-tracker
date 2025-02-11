"use client"

import { useState, useEffect } from "react"

export default function ExerciseForm({ addExercise, addSet, currentExercise }) {
  const [exerciseName, setExerciseName] = useState("")
  const [weight, setWeight] = useState("")
  const [reps, setReps] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (currentExercise) {
      setExerciseName(currentExercise.name)
      // Autofill weight and reps from the last set if available
      if (currentExercise.sets.length > 0) {
        const lastSet = currentExercise.sets[currentExercise.sets.length - 1]
        setWeight(lastSet.weight.toString())
        setReps(lastSet.reps.toString())
      }
    } else {
      // Reset form when starting a new exercise
      setExerciseName("")
      setWeight("")
      setReps("")
      setNote("")
    }
  }, [currentExercise])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!exerciseName || !weight || !reps) return

    const newSet = {
      weight: Number.parseFloat(weight),
      reps: Number.parseInt(reps),
      note,
      timestamp: new Date().toISOString(),
    }

    if (!currentExercise) {
      const newExercise = {
        id: Date.now(),
        name: exerciseName,
        sets: [newSet], // Include the first set immediately
      }
      addExercise(newExercise)
    } else {
      addSet(newSet)
    }

    // Don't reset weight and reps to allow for easy input of multiple sets
    setNote("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {!currentExercise && (
        <div>
          <label htmlFor="exercise" className="block text-sm font-medium text-gray-700">
            Exercise
          </label>
          <input
            type="text"
            id="exercise"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
      )}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="reps" className="block text-sm font-medium text-gray-700">
            Reps
          </label>
          <input
            type="number"
            id="reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
          Note
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {currentExercise ? "Add Set" : "Start Exercise"}
      </button>
    </form>
  )
}

