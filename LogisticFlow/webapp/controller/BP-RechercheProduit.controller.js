sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  function (Controller, UIComponent, History, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-RechercheProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // Caricare il file data.json
        var oModel = new JSONModel();
        oModel.loadData("model/data.json");

        // Attendere il caricamento del JSON
        oModel.attachRequestCompleted(
          function (oEvent) {
            if (!oEvent.getParameter("success")) {
              console.error("❌ Errore nel caricamento di data.json!");
              MessageToast.show("Errore nel caricamento dei dati.");
              return;
            }

            console.log(
              "✅ Dati JSON caricati con successo:",
              oModel.getData()
            );

            // Imposta il modello sulla View
            this.getView().setModel(oModel, "BPData");

            // Applicare le classi di stile alle righe della tabella
            this._applyRowStyles();
          }.bind(this)
        );
      },
      onTestScan: function () {
        this.oRouter.navTo("PrepareProduit");
      },

      _applyRowStyles: function () {
        var oTable = this.byId("bpTable");
        if (!oTable) {
          console.warn("⚠️ Tabella non trovata!");
          return;
        }

        var aItems = oTable.getItems();
        if (aItems.length === 0) {
          console.warn("⚠️ Nessun dato disponibile nella tabella.");
        }

        aItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext("BPData");
          if (!oBindingContext) return;

          var bAvailable = oBindingContext.getProperty("avaiable");
          var sClass = bAvailable ? "greenRow" : "redRow";
          oItem.addStyleClass(sClass);
        });

        console.log("📊 Numero di righe nella tabella:", aItems.length);
      },
    });
  }
);
