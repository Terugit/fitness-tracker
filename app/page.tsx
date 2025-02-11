"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";
import ExerciseForm from "./components/ExerciseForm"
import ExerciseList from "./components/ExerciseList"
import Timer from "./components/Timer"
import TrainingRecords from "./components/TrainingRecords"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Exercise = {
  id: string;
  name: string;
  sets: Set[];
};

type Set = {
  weight: number;
  reps: number;
};

export default function Home() {
  // State for exercise tracking
  const [exercises, setExercises] = useState([])
  const [currentExercise, setCurrentExercise] = useState(null)
  const [isTraining, setIsTraining] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [showRecords, setShowRecords] = useState(false)

  // Auth related state
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Check for existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (!isLogin) {
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        setShowAuth(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const startTraining = () => {
    if (!session) {
      setShowAuth(true);
      return;
    }
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

  // Auth Modal
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Welcome back! Please login to continue."
              : "Create an account to start tracking your workouts."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowAuth(false)}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 relative">
      {showAuth && <AuthModal />}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold mb-6 text-center">Fitness Training Record</h1>
            {session && (
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              )}
            </div>
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

