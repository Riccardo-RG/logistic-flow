sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("logistic-flow.Component", {
        metadata: {
            manifest: "json"
        },

        init: function() {
            // Chiamare la funzione init della classe padre
            UIComponent.prototype.init.apply(this, arguments);

            // Inizializzare il router (fondamentale per il routing!)
            this.getRouter().initialize();

            // Creare e impostare il modello JSON con i dati di data.json
            var oModel = new JSONModel("model/data.json");
            this.setModel(oModel);

            // Inclusione del CSS in modo corretto
            sap.ui.getCore().attachInit(function() {
                sap.ui.require(["sap/ui/dom/includeStylesheet"], function(includeStylesheet) {
                    includeStylesheet("css/style.css");
                });
            });
        }
    });
});