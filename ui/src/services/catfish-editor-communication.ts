// Create the actual object in TypeScript
import {MessageConstants, CatfishEditorCommunication} from "@/types/iframe/xdm/types";

const CatfishEditorCommunication: CatfishEditorCommunication = (() => {
    return {
        MessageConstants: {
            InfigoItemAddedToBasket: "Infigo.ItemAddedToBasket",
            InfigoItemAddedToSavedProjects: "Infigo.ItemSavedProject",
            EditorLoaded: "EditorLoaded",
            VariableChanged: 'Variable.Change',
            ExternalDataUpdate: "ExternalDataUpdate",
            Cancel: "Cancel",
            EditorNextStep: "EditorNextStep",
            Unkown: "Unkown",
        },
        RegisterForCatfishEditorEvent: function (callback: any, source_origin: string) {
            return XD.receiveMessage(function (message: any) {
                if (typeof message.data !== "string") return;

                const data = message.data.split("|");
                const parsedData = JSON.parse ? JSON.parse(data[1]) : data[1];

                if (data.length === 2) {
                    switch (data[0]) {
                        case "Infigo.ItemAddedToBasket":
                            callback(CatfishEditorCommunication.MessageConstants.InfigoItemAddedToBasket, parsedData);
                            break;
                        case "Infigo.ItemSavedProject":
                            callback(CatfishEditorCommunication.MessageConstants.InfigoItemAddedToSavedProjects, parsedData);
                            break;
                        case "EditorLoaded":
                            callback(CatfishEditorCommunication.MessageConstants.EditorLoaded, data);
                            break;
                        case "ExternalDataUpdate":
                            callback(CatfishEditorCommunication.MessageConstants.ExternalDataUpdate, JSON.parse(data[1]));
                            break;
                        case "Variable.Change":
                            callback("Variable.Change", JSON.parse(data[1]));
                            break;
                        case "Cancel":
                            callback(CatfishEditorCommunication.MessageConstants.Cancel, JSON.parse(data[1]));
                            break;
                        default:
                            callback(data[0], parsedData);
                            break;
                    }
                }
            }, source_origin);
        },
        PostMessage: function (messageId: string, data: string, target_url: string, target: any) {
            XD.postMessage(`${messageId}|${data}`, target_url, target);
        },
        RegisterForKeyboardInteraction: function (iframeId: string, targetUrl: string, defaultKeyboardSize?: number | null) {
            XD.documentEvents.onKeyboardToggle(iframeId, targetUrl, defaultKeyboardSize);
        },
    };
})();

export default CatfishEditorCommunication;
