// client/components/modals/BookingModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: string;
  tutorName: string;
}

export default function BookingModal({ isOpen, onClose, tutorId, tutorName }: BookingModalProps) {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get current date and time in a format suitable for the datetime-local input's `min` attribute
  const getMinDateTime = () => {
    const now = new Date();
    // Adjust for local timezone offset
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // Format to YYYY-MM-DDTHH:mm
    return now.toISOString().slice(0, 16);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in as a student to book a session.');
      return;
    }

    // --- FUTURE DATE VALIDATION ---
    if (new Date(scheduledAt) < new Date()) {
        setError('Please select a date and time in the future.');
        return;
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:8000/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tutorId,
          subject,
          scheduledAt,
          duration,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to book session.');
      }
      
      setIsSuccess(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setIsSuccess(false);
        setError('');
        setSubject('');
        setScheduledAt('');
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isSuccess ? (
            <div className="p-6 text-center">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-green-600">Request Sent!</DialogTitle>
                    <DialogDescription className="pt-2">
                        Your session request has been sent to {tutorName}. You will be notified once they respond.
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={handleClose} className="mt-4">Close</Button>
            </div>
        ) : (
            <>
                <DialogHeader>
                <DialogTitle>Book a Session with {tutorName}</DialogTitle>
                <DialogDescription>
                    Fill out the details below to request a new tutoring session.
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">Subject</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="scheduledAt" className="text-right">Date & Time</Label>
                            <Input 
                                id="scheduledAt" 
                                type="datetime-local" 
                                value={scheduledAt} 
                                onChange={(e) => setScheduledAt(e.target.value)} 
                                className="col-span-3"
                                min={getMinDateTime()} // Prevent selecting past dates in the browser's UI
                                required 
                            />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">Duration (min)</Label>
                            <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="col-span-3" required />
                        </div>
                         {error && <p className="col-span-4 text-center text-red-500 text-sm">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isSubmitting ? 'Sending Request...' : 'Send Request'}
                        </Button>
                    </DialogFooter>
                </form>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
