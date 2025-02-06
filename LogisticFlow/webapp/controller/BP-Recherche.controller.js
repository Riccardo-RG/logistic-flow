sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], function (Controller, UIComponent, History) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-Recherche", {

        /** 
         * Metodo di inizializzazione del controller 
         */
        onInit: function () {
            this.oRouter = UIComponent.getRouterFor(this);
        },

        /**
         * Metodo chiamato dopo il rendering della vista
         * Aggiunge le classi di colore alle righe della tabella
         */
        onAfterRendering: function () {
            var oTable = this.byId("bpTable");
            if (!oTable) return;

            var aItems = oTable.getItems();
            aItems.forEach(function (oItem) {
                var oBindingContext = oItem.getBindingContext();
                if (!oBindingContext) return;

                var bAvailable = oBindingContext.getProperty("avaiable");
                var sClass = bAvailable ? "greenRow" : "redRow";

                oItem.addStyleClass(sClass);
            });
        },

        /**
         * Formatter per evidenziare le righe della tabella
         */
        formatHighlight: function (bAvailable) {
            return bAvailable ? "Success" : "Error";
        },

        /**
         * Gestione del pulsante di navigazione indietro
         */
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.oRouter.navTo("MainView", {}, true);
            }
        },

        /**
         * Logica per annullare l'azione
         */
        onCancel: function () {
            sap.m.MessageToast.show("Azione annullata.");
        },

        /**
         * Logica per validare l'azione
         */
        onValidate: function () {
            sap.m.MessageToast.show("Azione validata.");
        },

        /**
         * Gestisce la selezione delle righe cambiando il bordo
         */
        onRowSelect: function (oEvent) {
            var oSelectedItem = oEvent.getSource(); // Riga selezionata
            var oTable = this.byId("bpTable");

            // Rimuove la classe di selezione da tutte le righe
            oTable.getItems().forEach(item => item.removeStyleClass("selectedRow"));

            // Aggiunge la classe CSS alla riga selezionata
            oSelectedItem.addStyleClass("selectedRow");
        }

    });
});
