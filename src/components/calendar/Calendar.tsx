// src/components/calendar/Calendar.tsx
import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTimetable } from '../../store/TimetableContext';
import { EventDropArg, EventInput } from '@fullcalendar/core';
import {EventModal} from './EventModal';
import toast from 'react-hot-toast';

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
  
  const calendarRef = useRef<FullCalendar>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  }, [events]);

  const handleDateClick = (arg: any) => {
    const localDate = new Date(arg.date);
    setCurrentEvent({
      title: '',
      start: localDate,
      end: new Date(localDate.getTime() + 60 * 60 * 1000),
      allDay: arg.allDay,
    });
    modalRef.current?.showModal();
  };

  const handleEventClick = (arg: any) => {
    setCurrentEvent({
      id: arg.event.id,
      title: arg.event.title,
      description: arg.event.extendedProps.description,
      start: arg.event.start ? new Date(arg.event.start) : new Date(),
      end: arg.event.end ? new Date(arg.event.end) : new Date(arg.event.start ? new Date(arg.event.start).getTime() + 60 * 60 * 1000 : Date.now() + 60 * 60 * 1000),
      allDay: arg.event.allDay,
      color: arg.event.backgroundColor,
    });
    modalRef.current?.showModal();
  };

  const handleEventDrop = async (arg: EventDropArg) => {
    try {
      const event = {
        title: arg.event.title,
        start: arg.event.start || new Date(),
        end: arg.event.end || arg.event.start || new Date(),
        allDay: arg.event.allDay,
      };
      await updateEvent(Number(arg.event.id), event);
      await fetchEvents();
    } catch (error) {
      arg.revert();
      toast.error('Failed to update event');
    }
  };

  const handleEventResize = async (arg: any) => {
    try {
      const event = {
        title: arg.event.title,
        start: arg.event.start || new Date(),
        end: arg.event.end || arg.event.start || new Date(),
        allDay: arg.event.allDay,
      };
      await updateEvent(Number(arg.event.id), event);
      await fetchEvents();
    } catch (error) {
      arg.revert();
      toast.error('Failed to update event');
    }
  };

  const formatEvents = (events: any[]): EventInput[] => {
    return events.map((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      
      if (event.allDay) {
        end.setHours(23, 59, 59, 999);
      }

      return {
        id: event.id?.toString(),
        title: event.title,
        description: event.description,
        start: start,
        end: end,
        allDay: event.allDay,
        backgroundColor: event.color,
        extendedProps: {
          description: event.description,
        },
      };
    });
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={formatEvents(events)}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          height="auto"
          allDaySlot={true}
          allDayText="All Day"
        />
      </div>

      <EventModal
        ref={modalRef}
        event={currentEvent}
        onSave={async (eventData) => {
          if (eventData.id) {
            await updateEvent(eventData.id, eventData);
          } else {
            await createEvent(eventData);
          }
          await fetchEvents();
          modalRef.current?.close();
        }}
        onDelete={async (id) => {
          if (id) {
            await deleteEvent(id);
            await fetchEvents();
            modalRef.current?.close();
          }
        }}
        onClose={() => modalRef.current?.close()}
      />
    </div>
  );
};