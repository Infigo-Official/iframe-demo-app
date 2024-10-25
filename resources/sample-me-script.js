function getConnector(callback) {
    return Editor.Invent.GetConnector(function (connector) {
        if (connector == null) {
            console.error('Failed to get connector');
            alert('Failed to get connector');
            return;
        }

        callback(connector);
    });
}

function getVariableValues(connector, name) {
    var variable = connector.variables.variableController.variables.find(it => it.name == name);
    if (variable) {
        return variable.values;
    }
    return null;
}

function setVariable(connector, name, value) {
    //we will set to attribute just in case too
    Document.SetProductAttribute(name, value);

    //in case if is a dropdown, in Infigo the value for variable will be the id of the value and not the value itself, so in this case we will try to find the id of the value
    var variableValues = getVariableValues(connector, name);

    var inventValue = value;

    if (variableValues) {
        for (var i = 0; i < variableValues.length; i++) {
            var varValue = variableValues[i];
            if (varValue.value == value) {
                inventValue = varValue.id;
            }
        }
    }

    connector.variables.set(name, inventValue);
}

//Register for any updates from the external editor, in this case Iframe will send the data to the editor new attribute values
Editor.Events.Register('Editor.ExternalDataUpdate', function (fields, data, event, eventObject) {
    let attributes = data.attributes;
    if (attributes) {
        getConnector(function (connector) {
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];

                setVariable(connector, attribute.name, attribute.value);
            }
        });
    }
});

//Register for any updates from the editor, in this case editor will send the data to the Iframe new attribute values
getConnector(function (connector) {

    //This will be called when the variable is updated in the editor in the Invent
    connector.events.registerForVariableUpdates(function (variableName, value) {

        //Broadcast the variable change to the iframe
        Editor.Events.BroadcastIframe('Variable.Change', {
            name: variableName,
            value: value
        });
    });
});
