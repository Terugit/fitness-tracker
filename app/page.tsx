"use client"

import { useState } from "react"
import ExerciseForm from "./components/ExerciseForm"
import ExerciseList from "./components/ExerciseList"
import Timer from "./components/Timer"
import TrainingRecords from "./components/TrainingRecords"

export default function Home() {
  const [exercises, setExercises] = useState([])
  const [currentExercise, setCurrentExercise] = useState(null)
  const [isTraining, setIsTraining] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [showRecords, setShowRecords] = useState(false)

  const startTraining = () => {
    setIsTraining(true)
    setStartTime(new Date())
  }

  const endTraining = () => {
    setIsTraining(false)
    setStartTime(null)
    setCurrentExercise(null)
  }

  const addExercise = (exercise) => {
    setExercises([...exercises, exercise])
    setCurrentExercise(exercise)
  }

  const addSet = (newSet) => {
    if (currentExercise) {
      const updatedExercise = {
        ...currentExercise,
        sets: [...currentExercise.sets, newSet],
      }
      setCurrentExercise(updatedExercise)
      setExercises(exercises.map((ex) => (ex.id === currentExercise.id ? updatedExercise : ex)))
    }
  }

  const finishExercise = () => {
    setCurrentExercise(null)
  }

  const toggleView = () => {
    setShowRecords(!showRecords)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 relative">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">Fitness Training Record</h1>
            {showRecords ? (
              <TrainingRecords exercises={exercises} onBackToRecording={toggleView} />
            ) : (
              <>
                <Timer isTraining={isTraining} startTime={startTime} />
                {!isTraining ? (
                  <button
                    onClick={startTraining}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Start Training
                  </button>
                ) : (
                  <>
                    <ExerciseForm addExercise={addExercise} addSet={addSet} currentExercise={currentExercise} />
                    {currentExercise && (
                      <>
                        <ExerciseList exercise={currentExercise} />
                        <button
                          onClick={finishExercise}
                          className="w-full mt-4 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                          Finish Exercise
                        </button>
                      </>
                    )}
                    <button
                      onClick={endTraining}
                      className="w-full mt-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      End Training
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={toggleView}
        className="fixed bottom-4 right-4 z-10 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {showRecords ? "Record" : "History"}
      </button>
    </div>
  )
}

