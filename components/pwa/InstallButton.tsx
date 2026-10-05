"use client"
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const InstallButton = () => {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const onPrompt = (e: Event) => {
            e.preventDefault();
            setPromptEvent(e as BeforeInstallPromptEvent);
        };
        const onInstalled = () => setPromptEvent(null);
        window.addEventListener('beforeinstallprompt', onPrompt);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    if (!promptEvent) return null;

    const install = async () => {
        await promptEvent.prompt();
        await promptEvent.userChoice;
        setPromptEvent(null);
    };

    return <button onClick={install} aria-label="Install app" title="Install app"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--title-color)', display: 'flex', alignItems: 'center' }}>
        <Download size={22} />
    </button>
};

export default InstallButton;
