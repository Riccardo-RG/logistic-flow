sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/IconPool",
  ],
  function (Controller, UIComponent, JSONModel, ODataModel, IconPool) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-Preparation", {
      onInit: function () {
        // Inizializzo il router
        this.oRouter = UIComponent.getRouterFor(this);

        // 🔹 Creazione del modello OData
        this.oODataModel = new ODataModel("/sap/opu/odata/sap/ZPP_WSM_SRV/", {
          defaultBindingMode: "TwoWay",
          useBatch: false,
          defaultCountMode: "Inline",
        });

        // 🔹 Impostare il modello OData alla View
        this.getView().setModel(this.oODataModel, "ODataModel");

        // 🔹 Attendere il caricamento dei metadati prima di fare la richiesta
        this.oODataModel.metadataLoaded().then(
          function () {
            console.log("✅ Metadati OData caricati correttamente!");

            // Eseguire la chiamata OData
            this.oODataModel.read("/ZET_BP_HEADERSet", {
              success: function (oData) {
                console.log("✅ Dati ricevuti:", oData);

                // 🔹 CORREZIONE: Accedere ai dati correttamente
                if (!oData || !Array.isArray(oData.results)) {
                  console.error(
                    "❌ Errore: i dati OData non sono nel formato previsto."
                  );
                  return;
                }

                // Creiamo il modello JSON con i dati ricevuti
                var oBPJsonModel = new JSONModel({ results: oData.results });

                // Impostiamo il modello alla View
                this.getView().setModel(oBPJsonModel, "BPData");
                console.log(
                  "✅ Modello BPData impostato:",
                  oBPJsonModel.getData()
                );

                // 🔹 Forziamo l'aggiornamento della tabella
                var oTable = this.getView().byId("bpTable");
                if (oTable) {
                  oTable.setModel(oBPJsonModel, "BPData"); // Assicura che la tabella usi il modello corretto
                  oTable.getBinding("items").refresh(true);
                }
              }.bind(this),
              error: function (oError) {
                console.error("❌ Errore nella chiamata OData:", oError);
              },
            });
          }.bind(this)
        );
      },

      onNavBack: function () {
        this.oRouter.navTo("MainView", {}, true);
      },

      onBPSelected: function () {
        var oCustomerDetailButton = this.getView().byId("idCustomerDetail");
        if (oCustomerDetailButton) oCustomerDetailButton.setVisible(true);

        var oSuivantButton = this.getView().byId("idSUIVANTButton");
        if (oSuivantButton) oSuivantButton.setEnabled(true);
      },

      onTestF4Press: function () {
        this.oRouter.navTo("BP-DoJour");
      },

      onNextBP: function () {
        this.oRouter.navTo("BP-RechercheProduit");
      },

      onDetailDuClient: function () {
        this.oRouter.navTo("DetailDuClient", {}, true);
      },
    });
  }
);
