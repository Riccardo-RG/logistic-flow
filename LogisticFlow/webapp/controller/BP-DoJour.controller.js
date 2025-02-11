sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
  ],
  function (Controller, UIComponent, History, MessageToast) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-DoJour", {
      /**
       * Metodo di inizializzazione del controller
       */
      onInit: function () {
        console.log("BP-DoJour.controller.js caricato correttamente!");

        // Recupera il router dell'app
        this.oRouter = UIComponent.getRouterFor(this);
      },

      /**
       * Gestisce il pulsante di navigazione indietro
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
       * Esempio di metodo per mostrare un messaggio Toast
       */
      onShowMessage: function () {
        MessageToast.show("Azione eseguita correttamente in BP-DoJour!");
      },
    });
  }
);
