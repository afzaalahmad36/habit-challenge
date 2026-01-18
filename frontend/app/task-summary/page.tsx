"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { taskAPI, userAPI, challengeAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types";
import { Check, Info, X } from "lucide-react";
import { HABITS } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [historyTasks, setHistoryTasks] = useState<Task[]>([]);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [isChallengeActive, setIsChallengeActive] = useState(true);
  const [challengeStatusMessage, setChallengeStatusMessage] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("currentChallengeId");
    setChallengeId(id);
    fetchDailyTasks(id);
    if (id) {
      checkChallengeStatus(id);
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await userAPI.getProfile();
      setTotalPoints(response.data.points || 0);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const checkChallengeStatus = async (id: string) => {
    try {
      const response = await challengeAPI.getChallenge(id);
      const challenge = response.data;
      if (challenge && challenge.startDate) {
        const startDate = new Date(challenge.startDate);
        const now = new Date();

        if (now < startDate) {
          setIsChallengeActive(false);
          setChallengeStatusMessage("Challenge hasn't started yet");
          return;
        }

        if (challenge.duration) {
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + challenge.duration);
          endDate.setHours(23, 59, 59, 999); // Set to end of the last day

          if (now > endDate) {
            setIsChallengeActive(false);
            setChallengeStatusMessage("Challenge has ended");
            return;
          }
        }

        setIsChallengeActive(true);
        setChallengeStatusMessage("");
      }
    } catch (error) {
      console.error("Error checking challenge status:", error);
    }
  };

  const fetchDailyTasks = async (challengeId?: string | null) => {
    try {
      const response = await taskAPI.getDailyTasks(challengeId || undefined);
      const rawTasks = Array.isArray(response.data)
        ? response.data
        : response.data?.tasks || [];
      const tasksData = rawTasks.map((task: any) => ({
        ...task,
        id: task.id || task._id,
        habitType: task.habitType || task.habitId,
        completed: task.completed ?? task.isCompleted,
      }));
      setTasks(tasksData);
      setCompletedCount(tasksData.filter((t: Task) => t.completed).length);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load daily tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    if (!isChallengeActive) {
      toast({
        title: "Cannot Complete Task",
        description: challengeStatusMessage || "Challenge is not active",
        variant: "destructive",
      });
      return;
    }

    try {
      await taskAPI.markTaskComplete(taskId, challengeId || undefined);

      // Update local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: true, completedAt: new Date() }
            : task,
        ),
      );
      setCompletedCount(completedCount + 1);
      setTotalPoints(totalPoints + 1);

      toast({
        title: "Great job! 🎉",
        description: "Task completed! +1 point",
      });
    } catch (error: any) {
      console.error("Error marking task complete:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to mark task as complete",
        variant: "destructive",
      });
    }
  };

  // const handleShowSummary = async () => {
  //   if (!challengeId) return;

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/task/history/${challengeId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );

  //     if (!response.ok) throw new Error("Failed to fetch history");

  //     const data = await response.json();
  //     const rawTasks = Array.isArray(data) ? data : data?.tasks || [];
  //     const tasksData = rawTasks.map((task: any) => ({
  //       ...task,
  //       id: task.id || task._id,
  //       habitType: task.habitType || task.habitId,
  //       completed: task.completed ?? task.isCompleted,
  //     }));
  //     setHistoryTasks(tasksData);
  //     setShowSummary(true);
  //   } catch (error) {
  //     console.error("Error fetching history:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to load challenge summary",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleReturnToChallenges = () => {
    router.push("/");
  };

  const getHabitInfo = (habitType: string) => {
    return HABITS.find((h) => h.type === habitType);
  };

  const formatRequirement = (requirement: any) => {
    if (!requirement) return "";

    const { type, value } = requirement;

    switch (type) {
      case "hours":
        return `${value} hours`;
      case "glasses":
        return `${value} glasses`;
      case "meals":
        return `${value} meal${value > 1 ? "s" : ""}`;
      case "minutes":
        return `${value} minutes`;
      default:
        return `${value}`;
    }
  };

  const getHabitColor = (habitType: string) => {
    const colors: Record<string, string> = {
      sleep: "bg-pink-100 border-pink-300",
      hydrate: "bg-orange-100 border-orange-300",
      eat: "bg-blue-100 border-blue-300",
      breath: "bg-green-100 border-green-300",
      read: "bg-cyan-100 border-cyan-300",
      exercise: "bg-yellow-100 border-yellow-300",
      write: "bg-purple-100 border-purple-300",
    };
    return colors[habitType] || "bg-gray-100 border-gray-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[90vw] min-w-max  bg-background p-10 overflow-hidden">
      <div className="text-4xl font-bold text-center pb-10">
        Points Earned: {totalPoints}
      </div>

      {/* Tasks Section */}
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Today's Habits</h2>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{tasks.length} done
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const habitInfo = getHabitInfo(task.habitType);
            const colorClass = getHabitColor(task.habitType);

            return (
              <Card
                key={task.id}
                className={`border-2 transition-all ${
                  task.completed ? "opacity-75 bg-gray-50" : colorClass
                }`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        task.completed ? "bg-green-100" : "bg-white"
                      }`}
                    >
                      {task.completed ? (
                        <Check className="text-green-600" />
                      ) : (
                        habitInfo?.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold capitalize">
                        {task.habitType}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatRequirement(task.requirement)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    className="ml-3 rounded-full bg-white border-2 border-current"
                    variant="ghost"
                    onClick={() => {
                      if (!isChallengeActive) {
                        toast({
                          title: "Challenge Not Active",
                          description:
                            challengeStatusMessage ||
                            "You cannot complete tasks yet.",
                          variant: "destructive",
                        });
                        return;
                      }
                      if (task.completed) {
                        toast({
                          description: "Task already completed",
                        });
                      } else {
                        handleMarkComplete(task.id);
                      }
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-gray-300 ${
                        task.completed ? "bg-green-500 border-green-500" : ""
                      }`}
                    ></div>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleReturnToChallenges}
          className="w-full mt-6 h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full"
        >
          Home Page
        </Button>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md relative max-h-[80vh] flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowSummary(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Challenge Summary</h3>
              <div className="space-y-3">
                {historyTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-5 h-5 accent-[#FF6B35]"
                    />
                    <div>
                      <p className="font-medium capitalize">{task.habitType}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.date
                          ? new Date(task.date).toLocaleDateString()
                          : "Task"}
                      </p>
                    </div>
                  </div>
                ))}
                {historyTasks.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No history available
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
