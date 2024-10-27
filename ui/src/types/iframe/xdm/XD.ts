interface PackageObj {
    action: string;
    payload: {
        width: number;
        height: number;
    };
}

type MessageCallback = (event: MessageEvent) => void;

interface XD {
    documentEvents: {
        onKeyboardToggle: (iframeId: string, targetUrl: string, defaultKeyboardSize?: number | null) => void;
    };
    postMessage: (message: string, targetUrl: string, target?: Window) => void;
    receiveMessage: (callback: MessageCallback, sourceOrigin?: string | ((origin: string) => boolean)) => () => () => void;
}

declare const XD: XD;
