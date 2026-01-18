"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Trophy,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { challengeAPI, getCurrentUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  duration: number;
  startDate: string;
  mode: string;
  habits: any[];
  participantIds: string[];
}

export default function ChallengesListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserId(user._id || user.id);
    }
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await challengeAPI.getChallenges();
      console.log("Challenges API Response:", response);

      let rawData: any[] = [];
      const rData = response.data;

      if (!rData) {
        rawData = [];
      } else if (Array.isArray(rData)) {
        rawData = rData;
      } else if (rData.challenges && Array.isArray(rData.challenges)) {
        rawData = rData.challenges;
      } else if (typeof rData === "object" && (rData.id || rData._id)) {
        rawData = [rData];
      }

      const data = rawData
        .filter((item) => item && typeof item === "object")
        .map((challenge: any) => ({
          ...challenge,
          id: challenge.id || challenge._id,
          startDate: challenge.startDate || new Date().toISOString(),
          habits: Array.isArray(challenge.habits) ? challenge.habits : [],
          participantIds: (
            challenge.participantIds ||
            challenge.participants ||
            []
          ).map((p: any) => (typeof p === "string" ? p : p._id || p.id)),
        }));

      setChallenges(data);
    } catch (error: any) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load challenges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChallenge = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge) {
      const startDate = new Date(challenge.startDate);
      if (startDate > new Date()) {
        toast({
          title: "Challenge Not Started",
          description: `This challenge starts on ${startDate.toLocaleDateString()}. You cannot track tasks yet.`,
          variant: "destructive",
        });
        return;
      }
    }

    localStorage.setItem("currentChallengeId", challengeId);
    toast({
      title: "Challenge Selected",
      description: "Redirecting to dashboard...",
    });
    router.push("/task-summary");
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await challengeAPI.joinChallenge(challengeId);
      toast({
        title: "Success!",
        description: "You have joined the challenge.",
      });

      if (userId) {
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === challengeId
              ? { ...c, participantIds: [...(c.participantIds || []), userId] }
              : c,
          ),
        );
      }
      await fetchChallenges();
    } catch (error: any) {
      console.error("Error joining challenge:", error);

      const backendMessage =
        error?.response?.data?.message || "Failed to join challenge";

      toast({
        title: "Cannot Join Challenge",
        description: backendMessage,
        variant: "destructive",
      });

      // Optional: refresh to sync UI
      await fetchChallenges();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Your Challenges</h1>
            </div>
            <Button
              onClick={() => router.push("/challenge/create")}
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Challenge
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Challenges Found</h3>
            <p className="text-muted-foreground mb-6">
              You haven't joined any challenges yet.
            </p>
            <Button
              onClick={() => router.push("/challenge/create")}
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full"
            >
              Create Your First Challenge
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {challenges.map((challenge) => {
              const startDate = new Date(challenge.startDate);
              const isUpcoming = startDate > new Date();
              const isJoined =
                userId && challenge.participantIds?.includes(userId);

              return (
                <Card
                  key={challenge.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSelectChallenge(challenge.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="capitalize mb-1">
                          {challenge.mode} Challenge
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {startDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isUpcoming
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isUpcoming ? "Upcoming" : "Active"}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{challenge.duration} Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span>{challenge.habits?.length || 0} Habits</span>
                        </div>
                      </div>

                      <Button
                        className={`w-full rounded-full ${
                          isJoined
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : ""
                        }`}
                        variant={isJoined ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isJoined) {
                            handleSelectChallenge(challenge.id);
                          } else {
                            handleJoinChallenge(challenge.id);
                          }
                        }}
                      >
                        {isJoined
                          ? isUpcoming
                            ? "Starts Soon"
                            : "Go to Tasks"
                          : "Join Challenge"}
                        {isJoined ? (
                          <Check className="h-4 w-4 ml-2" />
                        ) : (
                          <ArrowRight className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
