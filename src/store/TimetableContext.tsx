import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../services/timetableService';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';

export interface Event {
  id?: number;
  title: string;
  description?: string;
  start: Date | string;
  end: Date | string;
  allDay: boolean;
  color?: string;
  user_id: number;
  module_id: number;
  type: 'in_class' | 'self_study';
  semester: number;
  created_at?: string;
  updated_at?: string;
  plan_id?: number;
}

interface TimetableContextType {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: Event) => Promise<Event>;
  updateEvent: (id: number, eventData: Event) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id: studentId } = useParams<{ id: string }>();

  const fetchEvents = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEvents(Number(studentId) || user.id);
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: Event) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    try {
      const event = await createEvent(eventData, user.id);
      setEvents((prev) => [...prev, event]);
      toast.success('Event created successfully');
      return event;
    } catch (err: any) {
      toast.error('Failed to create event');
      throw err;
    }
  };

  const editEvent = async (id: number, eventData: Event) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    try {
      const event = await updateEvent(id, eventData, user.id);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? event : e))
      );
      toast.success('Event updated successfully');
      return event;
    } catch (err: any) {
      toast.error('Failed to update event');
      throw err;
    }
  };

  const removeEvent = async (id: number) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    try {
      await deleteEvent(id, user.id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Event deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete event');
      throw err;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
  }, [user?.id]);

  return (
    <TimetableContext.Provider
      value={{
        events,
        currentEvent,
        isLoading,
        error,
        fetchEvents,
        createEvent: addEvent,
        updateEvent: editEvent,
        deleteEvent: removeEvent,
        setCurrentEvent,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};