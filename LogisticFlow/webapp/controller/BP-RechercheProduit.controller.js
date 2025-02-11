sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, UIComponent, History, JSONModel) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-RechercheProduit", {
      /**
       * Metodo di inizializzazione del controller
       */
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // Recupera il modello globale
        var oModel = this.getOwnerComponent().getModel();

        if (!oModel) {
          console.warn(
            "Modello non trovato! Controlla che sia stato assegnato correttamente."
          );
        } else {
          console.log(
            "Dati nel modello:",
            oModel.getProperty("/BPRechercheData")
          );
        }

        // Assegna il modello alla vista
        this.getView().setModel(oModel);
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

        // Debug: verifica se la tabella ha gli elementi attesi
        console.log("Numero di righe nella tabella:", aItems.length);
      },

      /**
       * Formatter per evidenziare le righe della tabella
       */
      formatHighlight: function (bAvailable) {
        return bAvailable ? "Success" : "Error";
      },

      /**
       * Formatter per il campo "pr"
       * Restituisce "✓" se il valore è true, altrimenti una stringa vuota
       */
      formatCheck: function (bCheck) {
        console.log("Valore di 'pr' ricevuto nel formatter:", bCheck);
        return bCheck === true ? "✓" : "";
      },

      /**
       * Metodo per aggiornare forzatamente il binding (se necessario)
       */
      refreshModel: function () {
        var oModel = this.getView().getModel();
        if (oModel) {
          oModel.refresh(true);
          console.log("Modello aggiornato forzatamente.");
        } else {
          console.warn("Impossibile aggiornare il modello: non trovato.");
        }
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
        oTable.getItems().forEach(function (item) {
          item.removeStyleClass("selectedRow");
        });

        // Aggiunge la classe CSS alla riga selezionata
        oSelectedItem.addStyleClass("selectedRow");
      },
    });
  }
);
