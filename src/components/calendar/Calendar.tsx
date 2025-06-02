import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTimetable } from '../../store/TimetableContext';
import { EventDropArg, EventInput } from '@fullcalendar/core';
import {EventModal} from './EventModal';
import toast from 'react-hot-toast';
import { useRole } from '../../utils/useRole';
import inClassPlanService from '../../services/inClassPlanService';
import selfStudyPlanService from '../../services/selfstudyplanService';
import { useAuth } from '../../store/AuthContext';

export const Calendar = () => {
  const {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    setCurrentEvent,
    currentEvent,
    fetchEvents,
  } = useTimetable();
  
  const {isStudent} = useRole();
  const { user } = useAuth();
  const calendarRef = useRef<FullCalendar>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDateForMySQL = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleDateClick = (arg: any) => {
    if(!isStudent) return;
    const localDate = new Date(arg.date);
    setCurrentEvent({
      title: '',
      start: localDate,
      end: new Date(localDate.getTime() + 60 * 60 * 1000),
      allDay: arg.allDay,
      module_id: 0,
      type: 'in_class',
      semester: 1,
      user_id: user?.id || 0
    });
    modalRef.current?.showModal();
  };

  const handleEventClick = (arg: any) => {
    const event = {
      id: arg.event.id,
      title: arg.event.title,
      description: arg.event.extendedProps.description,
      start: arg.event.start ? new Date(arg.event.start) : new Date(),
      end: arg.event.end ? new Date(arg.event.end) : new Date(arg.event.start ? new Date(arg.event.start).getTime() + 60 * 60 * 1000 : Date.now() + 60 * 60 * 1000),
      allDay: arg.event.allDay,
      color: arg.event.backgroundColor,
      module_id: arg.event.extendedProps.module_id,
      type: arg.event.extendedProps.type,
      semester: arg.event.extendedProps.semester,
      user_id: user?.id || 0,
      plan_id: arg.event.extendedProps.plan_id
    };
    setCurrentEvent(event);
    modalRef.current?.showModal();
  };

  const handleEventDrop = async (arg: EventDropArg) => {
    try {
      setIsLoading(true);
      const event = {
        title: arg.event.title,
        start: arg.event.start || new Date(),
        end: arg.event.end || arg.event.start || new Date(),
        allDay: arg.event.allDay,
        module_id: arg.event.extendedProps.module_id,
        type: arg.event.extendedProps.type,
        semester: arg.event.extendedProps.semester,
        user_id: user?.id || 0,
        plan_id: arg.event.extendedProps.plan_id
      };
      await updateEvent(Number(arg.event.id), event);
      await fetchEvents();
    } catch (error) {
      arg.revert();
      toast.error('Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventResize = async (arg: any) => {
    try {
      setIsLoading(true);
      const event = {
        title: arg.event.title,
        start: arg.event.start || new Date(),
        end: arg.event.end || arg.event.start || new Date(),
        allDay: arg.event.allDay,
        module_id: arg.event.extendedProps.module_id,
        type: arg.event.extendedProps.type,
        semester: arg.event.extendedProps.semester,
        user_id: user?.id || 0,
        plan_id: arg.event.extendedProps.plan_id
      };
      await updateEvent(Number(arg.event.id), event);
      await fetchEvents();
    } catch (error) {
      arg.revert();
      toast.error('Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  const formatEvents = (events: any[]): EventInput[] => {
    return events.map((event) => ({
      id: event.id?.toString(),
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      backgroundColor: event.color,
      extendedProps: {
        description: event.description,
        module_id: event.module_id,
        type: event.type,
        semester: event.semester,
        plan_id: event.plan_id
      }
    }));
  };

  const handleSaveEvent = async (eventData: any) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      let calendarEvent;
      if (eventData.id) {
        calendarEvent = await updateEvent(eventData.id, eventData);
      } else {
        calendarEvent = await createEvent(eventData);
      }

      const planData = {
        module_id: eventData.module_id,
        date: formatDateForMySQL(eventData.end),
        lesson_learned: eventData.title,
        student_id: user.id,
        semester: eventData.semester
      };

      let planResponse;
      if (eventData.type === 'in_class') {
        if (eventData.plan_id) {
          planResponse = await inClassPlanService.update(Number(eventData.plan_id), {
            ...planData,
            self_assessment: 0,
            difficulties: '',
            plan_to_improve: '',
            problem_solved: false
          });
        } else {
          planResponse = await inClassPlanService.add(user.id, {
            ...planData,
            self_assessment: 0,
            difficulties: '',
            plan_to_improve: '',
            problem_solved: false
          });
        }
      } else if (eventData.type === 'self_study') {
        if (eventData.plan_id) {
          planResponse = await selfStudyPlanService.update(Number(eventData.plan_id), {
            ...planData,
            time_allocation: 0,
            learning_resources: '',
            learning_activities: '',
            concentration: 0,
            follow_plan_reflection: '',
            evaluation: '',
            reinforcing_techniques: '',
            note: ''
          });
        } else {
          planResponse = await selfStudyPlanService.add(user.id, {
            ...planData,
            time_allocation: 0,
            learning_resources: '',
            learning_activities: '',
            concentration: 0,
            follow_plan_reflection: '',
            evaluation: '',
            reinforcing_techniques: '',
            note: ''
          });
        }
      }

      
      if (planResponse?.id && !eventData.plan_id && calendarEvent.id) {
        await updateEvent(calendarEvent.id, {
          ...eventData,
          plan_id: planResponse.id
        });
      }

      await fetchEvents();
      modalRef.current?.close();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      
      await deleteEvent(id);
      await fetchEvents();
      modalRef.current?.close();
    } catch (error) {
      toast.error('Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 h-[calc(100vh-170px)]">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-[calc(100vh-200px)] overflow-auto">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            editable={isStudent}
            selectable={isStudent}
            selectMirror={isStudent}
            dayMaxEvents={true}
            weekends={true}
            events={formatEvents(events)}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            height="auto"
            stickyHeaderDates={true}
            stickyFooterScrollbar={true}
          />
        </div>
      </div>

      <EventModal
        ref={modalRef}
        event={currentEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        onClose={() => modalRef.current?.close()}
        isEditing={!!currentEvent?.id}
        isLoading={isLoading}
      />
    </div>
  );
};