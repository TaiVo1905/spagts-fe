import { useEffect } from 'react';
import { ref, onValue, off, update, push, remove } from 'firebase/database';
import { database } from '../services/firebaseService';
import { useAuth } from '../store/AuthContext';
import axiosClient from '../services/axiosClient';

export const usePlanSync = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Listen for plan changes from API
    const syncPlans = async () => {
      try {
        // Get self study plans
        const selfStudyResponse = await axiosClient.get('/self-study-plans');
        const selfStudyPlans = selfStudyResponse.data.data;
        
        // Get in-class plans
        const inClassResponse = await axiosClient.get('/in-class-plan');
        const inClassPlans = inClassResponse.data.data;

        // Get weekly goals
        const weeklyGoalsResponse = await axiosClient.get('/weekly-goals?perPage=100');
        const weeklyGoals = weeklyGoalsResponse.data.data;

        // Get semester goals
        const semesterGoalsResponse = await axiosClient.get('/semesterGoals?perPage=100');
        const semesterGoals = semesterGoalsResponse.data.data;
        console.log(semesterGoals)

        // Update Firebase with all plans
        const plansRef = ref(database, 'plans');
        
        // Clear existing plans
        await remove(plansRef);

        // Add self study plans
        selfStudyPlans.forEach((plan: any) => {
          const planRef = push(plansRef);
          update(planRef, {
            ...plan,
            type: 'self_study_plan',
            user_id: plan.student.id,
            module: plan.module.name,
            module_id: plan.module.id,
          });
        });

        // Add in-class plans
        inClassPlans.forEach((plan: any) => {
          const planRef = push(plansRef);
          update(planRef, {
            ...plan,
            type: 'in_class_plan',
            user_id: plan.student.id,
            module: plan.module.name,
            module_id: plan.module.id,
          });
        });

        // Add weekly goals
        weeklyGoals.forEach((goal: any) => {
          const planRef = push(plansRef);
          update(planRef, {
            ...goal,
            type: 'weekly_goal',
            user_id: goal.student_id,
          });
        });

        // Add semester goals
        semesterGoals.forEach(async (goal: any) => {
          const planRef = push(plansRef);
          update(planRef, {
            ...goal,
            type: 'semester_goal',
            user_id: goal.studentId,
            module_id: goal.moduleId,
            module: (await axiosClient.get(`/modules/${goal.moduleId}`)).data.data.name
          });
        });
      } catch (error) {
        console.error('Error syncing plans:', error);
      }
    };

    // Initial sync
    syncPlans();

    // Set up interval for periodic sync
    const interval = setInterval(syncPlans, 5 * 60 * 1000); // Sync every 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, [user]);
};