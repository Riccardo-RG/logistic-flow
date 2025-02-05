sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-Preparation", {
        onInit: function() {
            this.oRouter = UIComponent.getRouterFor(this);
        },
        
        onNavBack: function() {
            this.oRouter.navTo("MainView", {}, true);
        },

        onToggleFilter: function(oEvent) {
            var oButton = oEvent.getSource(); // Ottiene il riferimento al bottone cliccato
            var bActive = oButton.hasStyleClass("active"); // Controlla se ha già la classe "active"

            if (bActive) {
                oButton.removeStyleClass("active"); // Se è già attivo, rimuove lo stato attivo
            } else {
                oButton.addStyleClass("active"); // Se non è attivo, lo imposta attivo
            }
        }
    });
});
