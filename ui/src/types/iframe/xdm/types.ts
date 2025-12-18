export interface MessageConstants {
    InfigoItemAddedToBasket: string;
    InfigoItemAddedToSavedProjects: string;
    InfigoJobChanged: string;
    InfigoAddToBasket: string;
    EditorLoaded: string;
    VariableChanged: string;
    ExternalDataUpdate: string;
    Cancel: string;
    EditorNextStep: string;
    Unkown: string;
}

export interface CatfishEditorCommunication {
    MessageConstants: MessageConstants;
    RegisterForCatfishEditorEvent: (
        callback: (messageType: string, data: any) => void,
        source_origin: string
    ) => void;
    PostMessage: (
        messageId: string,
        data: any,
        target_url: string,
        target: Window
    ) => void;
    RegisterForKeyboardInteraction: (iframeId: string, targetUrl: string) => void;
}
