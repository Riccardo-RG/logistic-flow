sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  function (Controller, History) {
    "use strict";

    return Controller.extend("nome.della.tua.app.controller.DetailDuClient", {
      onInit: function () {
        // Inizializzazioni eventuali
      },

      onNavBack: function () {
        // Recuperiamo l’istanza dell’History
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          // Se esiste una history precedente, torna indietro di una pagina
          window.history.go(-1);
        } else {
          // Se non c'è history precedente, navighiamo a una route di default
          // (es. la 'home' del tuo progetto).
          // Sostituisci "RouteHome" col nome di una route che hai definito nel tuo manifest
          this.getOwnerComponent()
            .getRouter()
            .navTo("BP-Preparation", {}, true);
        }
      },

      // Esempio di metodo di salvataggio (custom)
      onSave: function () {
        // Recupero dei valori da Input/TextArea
        var sLinerValue = this.getView().byId("inputLiner").getValue();
        var sSansDluValue = this.getView().byId("inputSansDlu").getValue();
        var sListeDeColisageValue = this.getView()
          .byId("inputListeDeColisage")
          .getValue();
        var sCommentValue = this.getView()
          .byId("textareaCommentaires")
          .getValue();

        // Fai qualcosa con questi dati, come richiamare un servizio OData
        // o inviarli a un back-end, ecc.
      },
    });
  }
);
