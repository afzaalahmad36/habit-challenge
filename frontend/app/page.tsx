"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
    } else {
      router.push("/login");
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        {/* Header with Login */}
        <div className="flex justify-end mb-8">
          <Button
            onClick={handleAuth}
            variant="outline"
            className="rounded-full"
          >
            {isLoggedIn ? "Log Out" : "Sign In"}
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl leading-[60px] font-bold mb-4 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Habit Challenge
          </h1>
          <p className="text-xl text-muted-foreground">
            Build better habits, compete with friends, and transform your life
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-2">Create Challenge</h2>
              <p className="text-muted-foreground mb-6">
                Choose your habits, set your duration, and start your journey
              </p>
              <Button
                onClick={() => router.push("/challenge/create")}
                className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full text-lg"
              >
                Start New Challenge
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold mb-2">
                Participate in Challenge
              </h2>
              <p className="text-muted-foreground mb-6">
                Participate in existing challenges
              </p>
              <Button
                onClick={() => router.push("/challenge/challenge-list")}
                variant="outline"
                className="w-full h-12 rounded-full text-lg"
              >
                Go to Challenges
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-3xl mb-2">😴</div>
            <p className="text-sm font-medium">Sleep</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">💧</div>
            <p className="text-sm font-medium">Hydrate</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🍎</div>
            <p className="text-sm font-medium">Eat</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🧘</div>
            <p className="text-sm font-medium">Breath</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-sm font-medium">Read</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">💪</div>
            <p className="text-sm font-medium">Exercise</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-2xl">
          <h3 className="font-bold text-lg mb-2">7 Powerful Habits</h3>
          <p className="text-sm text-muted-foreground">
            Track sleep, hydration, nutrition, breathing, reading, exercise, and
            writing. Build lasting habits that transform your daily routine.
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowLogoutModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-6">
                Are you sure to log out?
              </h3>
              <Button
                onClick={confirmLogout}
                className="w-full"
                variant="destructive"
              >
                Log Out
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
