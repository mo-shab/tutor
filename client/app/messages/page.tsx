// client/app/messages/page.tsx
'use client';

import { MessageSquarePlus } from 'lucide-react';

export default function MessagesPlaceholderPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-50">
            <MessageSquarePlus className="h-24 w-24 text-gray-300" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-400">Select a conversation</h2>
            <p className="text-gray-400">Choose from your existing conversations or start a new one.</p>
        </div>
    );
}
