import ChatPanel from '@/components/Chat/ChatPanel';
import ContactInfoPanel from '@/components/Chat/ContactInfoPanel';
import PreviewPanel from '@/components/Chat/PreviewPanel';
import React from 'react'

function ChatPage() {
    return (
        <>
            <div className='h-[calc(100vh-90px)] overflow-hidden'>
                <ChatPanel />
                {/* <ContactInfoPanel />
            <PreviewPanel /> */}
            </div>

        </>
    )
}

export default ChatPage;