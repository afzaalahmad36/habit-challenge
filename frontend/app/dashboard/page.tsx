'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { taskAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';
import { Check, Info } from 'lucide-react';
import { HABITS } from '@/lib/constants';

export default function DashboardPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Get challenge ID from localStorage or route params
  // For now using a placeholder - you'll need to implement challenge selection
  const challengeId =
    typeof window !== 'undefined'
      ? localStorage.getItem('currentChallengeId')
      : null;

  useEffect(() => {
    fetchDailyTasks();
  }, []);

  const fetchDailyTasks = async () => {
    try {
      const response = await taskAPI.getDailyTasks(challengeId || undefined);
      setTasks(response.data.tasks || []);
      setCompletedCount(response.data.completedTasks || 0);
      setTotalPoints(response.data.totalPoints || 0);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load daily tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      await taskAPI.markTaskComplete(taskId);

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
        title: 'Great job! 🎉',
        description: 'Task completed! +1 point',
      });
    } catch (error: any) {
      console.error('Error marking task complete:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark task as complete',
        variant: 'destructive',
      });
    }
  };

  const getHabitInfo = (habitType: string) => {
    return HABITS.find((h) => h.type === habitType);
  };

  const formatRequirement = (requirement: any) => {
    if (!requirement) return '';

    const { type, value } = requirement;

    switch (type) {
      case 'hours':
        return `${value} hours`;
      case 'glasses':
        return `${value} glasses`;
      case 'meals':
        return `${value} meal${value > 1 ? 's' : ''}`;
      case 'minutes':
        return `${value} minutes`;
      default:
        return `${value}`;
    }
  };

  const getHabitColor = (habitType: string) => {
    const colors: Record<string, string> = {
      sleep: 'bg-pink-100 border-pink-300',
      hydrate: 'bg-orange-100 border-orange-300',
      eat: 'bg-blue-100 border-blue-300',
      breath: 'bg-green-100 border-green-300',
      read: 'bg-cyan-100 border-cyan-300',
      exercise: 'bg-yellow-100 border-yellow-300',
      write: 'bg-purple-100 border-purple-300',
    };
    return colors[habitType] || 'bg-gray-100 border-gray-300';
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background pb-20'>
      {/* Header Section */}
      <div className='bg-gradient-to-b from-primary/10 to-background pt-8 pb-6'>
        <div className='container max-w-2xl mx-auto px-4'>
          {/* Challenge Info */}
          <div className='bg-white rounded-2xl p-6 shadow-sm mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h1 className='text-xl font-bold'>Morning Warriors</h1>
                <p className='text-sm text-muted-foreground'>
                  🔥 Day 3 of 7, Jane is leading the pack!
                </p>
              </div>
              <div className='flex -space-x-2'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white flex items-center justify-center text-white text-xs font-bold'
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Bar */}
            <div className='relative h-32 flex items-end justify-between gap-2'>
              <div
                className='flex-1 bg-yellow-400 rounded-t-lg relative'
                style={{ height: '60%' }}
              >
                <div className='absolute -top-12 left-1/2 transform -translate-x-1/2 text-center'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-white mb-1'></div>
                  <div className='bg-white px-2 py-1 rounded-full text-xs font-bold'>
                    👑 208
                  </div>
                </div>
                <p className='text-center text-xs font-medium mt-2'>
                  Jane Cooper is leading
                </p>
              </div>
              <div
                className='flex-1 bg-orange-500 rounded-t-lg'
                style={{ height: '50%' }}
              >
                <div className='text-center'>
                  <div className='bg-white px-2 py-1 rounded-full text-xs font-bold inline-block mt-2'>
                    ⚡ 215
                  </div>
                </div>
              </div>
              <div
                className='flex-1 bg-teal-500 rounded-t-lg'
                style={{ height: '45%' }}
              >
                <div className='text-center'>
                  <div className='bg-white px-2 py-1 rounded-full text-xs font-bold inline-block mt-2'>
                    💪 200
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className='container max-w-2xl mx-auto px-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold'>Today's Habits</h2>
          <span className='text-sm text-muted-foreground'>
            {completedCount}/{tasks.length} done
          </span>
        </div>

        <div className='space-y-3'>
          {tasks.map((task) => {
            const habitInfo = getHabitInfo(task.habitType);
            const colorClass = getHabitColor(task.habitType);

            return (
              <Card
                key={task.id}
                className={`border-2 transition-all ${
                  task.completed ? 'opacity-75 bg-gray-50' : colorClass
                }`}
              >
                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3 flex-1'>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        task.completed ? 'bg-green-100' : 'bg-white'
                      }`}
                    >
                      {task.completed ? (
                        <Check className='text-green-600' />
                      ) : (
                        habitInfo?.icon
                      )}
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold capitalize'>
                        {task.habitType}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {formatRequirement(task.requirement)}
                      </p>
                    </div>
                    <Button variant='ghost' size='icon' className='shrink-0'>
                      <Info className='h-4 w-4' />
                    </Button>
                  </div>
                  {!task.completed && (
                    <Button
                      size='icon'
                      className='ml-3 rounded-full bg-white border-2 border-current'
                      variant='ghost'
                      onClick={() => handleMarkComplete(task.id)}
                    >
                      <div className='w-6 h-6 rounded-full border-2 border-gray-300'></div>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <Button className='w-full mt-6 h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full'>
          Challenge Summary
        </Button>
      </div>
    </div>
  );
}
