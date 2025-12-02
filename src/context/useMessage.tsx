import { createContext, useContext, useState, ReactNode } from 'react';
import Alerts from "@/Components/Ui/Alert";

interface MessageContextProps {
    message: string;
    typeMessage: 'success' | 'error' | 'warning' | 'info';
    open: boolean;
    handleOpenMessage: (message: string, typeMessage: 'success' | 'error' | 'warning' | 'info') => void;
    handleClose: () => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<string>('');
    const [typeMessage, setTypeMessage] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [open, setOpen] = useState<boolean>(false);

    const handleOpenMessage = (newMessage: string, newTypeMessage: 'success' | 'error' | 'warning' | 'info') => {
        setMessage(newMessage);
        setTypeMessage(newTypeMessage);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MessageContext.Provider value={{ message, typeMessage, open, handleOpenMessage, handleClose }}>
            <Alerts/>
    {children}
    </MessageContext.Provider>
);
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};