import { useEffect } from 'react';

const ChatBox = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      if (window.voiceflow) {
        window.voiceflow.chat.load({
          verify: { projectID: '68e2037a17c0f1488fd5e049' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          }
        });
      }
    };
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default ChatBox;

declare global {
  interface Window {
    voiceflow: {
      chat: {
        load: (config: {
          verify: { projectID: string };
          url: string;
          versionID: string;
          voice: { url: string };
        }) => void;
      };
    };
  }
}
