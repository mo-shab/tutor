// client/components/modals/ReviewModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Star } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: string;
    tutorName: string;
}

// A simple star rating component
const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
    return (
        <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                />
            ))}
        </div>
    );
};

export default function ReviewModal({ isOpen, onClose, sessionId, tutorName }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating.');
            return;
        }
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch('http://localhost:8000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ sessionId, rating, comment }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to submit review.');
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
            setRating(0);
            setComment('');
        }, 300);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                {isSuccess ? (
                    <div className="p-6 text-center">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-green-600">Thank You!</DialogTitle>
                            <DialogDescription className="pt-2">
                                Your review has been submitted successfully.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={handleClose} className="mt-4">Close</Button>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <DialogTitle>Leave a Review for {tutorName}</DialogTitle>
                            <DialogDescription>
                                Share your experience to help other students.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6 py-4">
                                <StarRating rating={rating} setRating={setRating} />
                                <Textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us more about your session (optional)"
                                    rows={4}
                                />
                                {error && <p className="text-center text-red-500 text-sm">{error}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
