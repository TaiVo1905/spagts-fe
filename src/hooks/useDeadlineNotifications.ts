import { useEffect, useCallback, useRef } from 'react';
import { ref, push, get, set } from 'firebase/database';
import { database } from '../services/firebaseService';
import { useAuth } from '../store/AuthContext';
import dayjs from 'dayjs';
import axiosClient from '../services/axiosClient';

export const useDeadlineNotifications = () => {
  const { user } = useAuth();
  const isCheckingRef = useRef(false);
  const notifiedPlanIds = useRef<Set<string>>(new Set());
  const missedDeadlines = useRef<Set<string>>(new Set());
  const cleanupRef = useRef<(() => void) | null>(null);

  

  const notifyTeachers = useCallback(async (moduleId: string, module: any, studentId: string, deadline: string, planType: string) => {
    try {
      const moduleTeachersRef = ref(database, `module_teachers/${moduleId}`);
      const moduleTeachersSnapshot = await get(moduleTeachersRef);
      const student = (await axiosClient.get(`/users/${studentId}`)).data.data
      
      if (!moduleTeachersSnapshot.exists()) {
        console.warn(`No teachers found for module ${moduleId}`);
        return;
      }

      const moduleTeachers = moduleTeachersSnapshot.val() || {};
      const notificationPromises = Object.keys(moduleTeachers).map(async (teacherId) => {
        const teacherNotificationRef = ref(database, `notifications/${teacherId}`);
        const newNotificationRef = push(teacherNotificationRef);
        
        await set(newNotificationRef, {
          title: 'Student Missed Deadline',
          message: `Student ${student.name} has missed the deadline (${dayjs(deadline).format('MMM D, YYYY HH:mm')}) for ${planType} in module ${module}.`,
          type: 'missed_deadline',
          module_id: moduleId,
          student_id: studentId,
          plan_type: planType,
          due_date: deadline,
          created_at: new Date().toISOString(),
          read: false
        });
      });

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Error notifying teachers:', error);
    }
  }, []);

  const checkExistingNotification = useCallback(async (
    userId: string, 
    moduleId: string | undefined, 
    planType: string, 
    type: 'deadline_reminder' | 'missed_deadline'
  ) => {
    try {
      const notificationsRef = ref(database, `notifications/${userId}`);
      const snapshot = await get(notificationsRef);
      
      if (!snapshot.exists()) return false;

      const notifications = snapshot.val();
      return Object.values(notifications).some((notification: any) => 
        notification.type === type &&
        notification.plan_type === planType &&
        notification.module_id === moduleId
      );
    } catch (error) {
      console.error('Error checking existing notification:', error);
      return false;
    }
  }, []);

  const checkPlanDeadline = useCallback(async (planId: string, plan: any) => {
    // Handle non-semester goal plans
    if (plan.type !== 'semester_goal') {

        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        let dueDate: Date;
        let isEmpty = false;
        let planType = '';

        // Determine plan type and due date
        switch (plan.type) {
          case 'weekly_goal':
            dueDate = new Date(plan.end_date);
            isEmpty = !plan.is_completed;
            planType = 'Weekly Goal';
            break;

          case 'self_study_plan':
            dueDate = new Date(plan.date);
            dueDate.setHours(dueDate.getHours() + 26); // 26 hours from creation
            isEmpty = !plan.time_allocation || !plan.learning_resources ||
                     !plan.learning_activities || !plan.concentration ||
                     !plan.plan_reflection || !plan.evaluation ||
                     !plan.reinforcing_techniques;
            planType = 'Self Study Plan';
            break;

          case 'in_class_plan':
            dueDate = new Date(plan.date);
            dueDate.setHours(dueDate.getHours() + 26); // 26 hours from creation
            isEmpty = !plan.self_assessment || !plan.difficulties ||
                     !plan.plan_to_improve || plan.problem_solved;
            planType = 'In-Class Plan';
            break;

          default:
            return;
        }

        if(plan.type === "weekly_goal") {
            plan.module_id = plan.id
          }

        // Check for reminder notification
        if (dueDate > now && dueDate <= oneHourFromNow && isEmpty) {
          const hasExistingReminder = await checkExistingNotification(
            plan.user_id,
            plan?.module_id,
            plan.type,
            'deadline_reminder'
          );

          if (!hasExistingReminder) {
            const notification: any = {
              title: 'Upcoming Deadline',
              message: `Your ${planType} in module ${plan.module} is due in 1 hour. Please complete it before the deadline.`,
              type: 'deadline_reminder',
              plan_type: plan.type,
              due_date: plan.end_date || plan.date,
              created_at: new Date().toISOString(),
              read: false
            };

            if (plan.module_id) {
              notification.module_id = plan.module_id;
            }

            const notificationsRef = ref(database, `notifications/${plan.user_id}`);
            const newNotificationRef = push(notificationsRef);
            await set(newNotificationRef, notification);
          }
        }

        // Check for missed deadline notification

        if (now > dueDate && isEmpty) {
          const hasExistingMissed = await checkExistingNotification(
            plan.user_id,
            plan.module_id,
            plan.type,
            'missed_deadline'
          );
          
          
          if (!hasExistingMissed) {

            const studentNotification: any = {
              title: 'Deadline Missed',
              message: `You have missed the deadline for your ${planType} in module ${plan.module || plan.goal_content}. Please complete it as soon as possible.`,
              type: 'missed_deadline',
              plan_type: plan.type,
              due_date: plan.end_date || plan.date,
              created_at: new Date().toISOString(),
              read: false
            };

            if (plan.module_id) {
              studentNotification.module_id = plan.module_id;
            }

            const studentNotificationsRef = ref(database, `notifications/${plan.user_id}`);
            const newStudentNotificationRef = push(studentNotificationsRef);
            await set(newStudentNotificationRef, studentNotification);

            // Notify teachers if plan has a module
            if (plan.module_id && plan.module) {
                await notifyTeachers(plan.module_id, plan.module, plan.user_id, plan.end_date || plan.date, planType);
            }
          }
        }

    }


      // Fetch the deadline from user_module_deadlines
      const userDeadlineRef = ref(database, `user_module_deadlines`);
      const userDeadlineSnapshot = await get(userDeadlineRef);

      if (userDeadlineSnapshot.exists()) {
          const deadlineData = userDeadlineSnapshot.val();
          
          // Iterate through each user
          for (const [user_id, modules] of Object.entries(deadlineData)) {
              
              // Check if modules is an object (not array)
              if (modules && typeof modules === 'object') {
                  // Iterate through each module
                  for (const [module_id, module] of Object.entries(modules)) {
                      
                      if (!module || typeof module !== 'object' || !module.deadline) continue;
                      
                      const now = new Date();
                      const dueDate = new Date(module.deadline);
                      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

                      // Check for reminder notification (1 hour before deadline)
                      if (dueDate > now && dueDate <= oneHourFromNow) {
                          const hasExistingReminder = await checkExistingNotification(
                              user_id,
                              module_id,
                              'semester_goal',
                              'deadline_reminder'
                          );

                          if (!hasExistingReminder) {
                              const notification: any = {
                                  title: 'Upcoming Deadline',
                                  message: `You need to complete your Semester Goal in module ${module.module_name} before ${dayjs(dueDate).format('MMMM D, YYYY HH:mm')}. It is due in 1 hour.`,
                                  type: 'deadline_reminder',
                                  plan_type: 'semester_goal', // Fixed: was using undefined 'plan.type'
                                  module_id: module_id, // Fixed: was using undefined 'plan.module_id'
                                  due_date: dueDate.toISOString(),
                                  created_at: new Date().toISOString(),
                                  read: false
                              };

                              const notificationsRef = ref(database, `notifications/${user_id}`);
                              const newNotificationRef = push(notificationsRef);
                              await set(newNotificationRef, notification);
                          }
                      }
                      if (now > dueDate) {
                          const hasExistingMissed = await checkExistingNotification(
                              user_id,
                              module_id,
                              'semester_goal',
                              'missed_deadline'
                          );

                          if (!hasExistingMissed) {
                              const studentNotification: any = {
                                  title: 'Deadline Missed',
                                  message: `You have missed the deadline for setting your Semester Goal in module ${module.module_name}. Please complete it as soon as possible.`,
                                  type: 'missed_deadline',
                                  plan_type: 'semester_goal',
                                  module_id: module_id,
                                  due_date: dueDate.toISOString(),
                                  created_at: new Date().toISOString(),
                                  read: false
                              };

                              const studentNotificationsRef = ref(database, `notifications/${user_id}`);
                              const newStudentNotificationRef = push(studentNotificationsRef);
                              await set(newStudentNotificationRef, studentNotification);

                              // Notify teachers if plan has a module
                              await notifyTeachers(module_id, module.module_name, user_id, dueDate.toISOString(), 'Semester Goal');

                          }
                      }
                  }
              }
          }
      }
  }, [notifyTeachers, checkExistingNotification]);

  const checkAndNotifyDeadlines = useCallback(async () => {
    if (!user?.id || isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      // Get all plans
      const plansRef = ref(database, 'plans');
      const snapshot = await get(plansRef);

      if (!snapshot.exists()) {
        console.log('No plans found');
        return;
      }

      const plans = snapshot.val();
      
      // Process all plans in parallel
      await Promise.all(
        Object.entries(plans).map(([planId, plan]: [string, any]) => 
          checkPlanDeadline(planId, plan)
        )
      );
    } catch (error) {
      console.error('Error checking deadlines:', error);
    } finally {
      isCheckingRef.current = false;
    }
  }, [user?.id, checkPlanDeadline]);

  useEffect(() => {
    if (!user?.id) return;

    // Initial check
    checkAndNotifyDeadlines();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkAndNotifyDeadlines, 5 * 60 * 1000); // 5 minutes

    // Cleanup function
    cleanupRef.current = () => {
      clearInterval(intervalId);
      notifiedPlanIds.current.clear();
      missedDeadlines.current.clear();
    };

    return cleanupRef.current;
  }, [user?.id, checkAndNotifyDeadlines]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
};