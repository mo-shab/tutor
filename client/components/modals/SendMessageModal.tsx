// client/components/modals/SendMessageModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader2 } from 'lucide-react';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: string;
  tutorName: string;
}

export default function SendMessageModal({ isOpen, onClose, tutorId, tutorName }: SendMessageModalProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
        setError('Message cannot be empty.');
        return;
    }
    setError('');
    setIsSending(true);

    try {
      const res = await fetch('http://localhost:8000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: tutorId,
          content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send message.');
      }
      
      const newMessage = await res.json();
      onClose(); // Close the modal
      // Redirect to the new conversation
      router.push(`/messages/${newMessage.conversationId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSending(false);
    }
  };
  
  const handleClose = () => {
    onClose();
    // Reset state after a short delay
    setTimeout(() => {
        setError('');
        setContent('');
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Send a message to {tutorName}</DialogTitle>
          <DialogDescription>
            Start a conversation to discuss your learning needs or schedule a session.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <Textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder={`Hi ${tutorName}, I'd like to inquire about...`}
                    rows={5}
                    required
                />
                {error && <p className="text-center text-red-500 text-sm">{error}</p>}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSending ? 'Sending...' : 'Send Message'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
