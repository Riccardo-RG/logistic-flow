sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/IconPool",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    ODataModel,
    IconPool,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-Preparation", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // 🔹 Creazione del modello OData
        this.oODataModel = new ODataModel("/sap/opu/odata/sap/ZPP_WSM_SRV/", {
          defaultBindingMode: "TwoWay",
          useBatch: false,
          defaultCountMode: "Inline",
        });

        this.getView().setModel(this.oODataModel, "ODataModel");

        // 🔹 Attendere il caricamento dei metadati prima di fare la richiesta
        this.oODataModel.metadataLoaded().then(
          function () {
            console.log("✅ Metadati OData caricati correttamente!");

            // Eseguire la chiamata OData
            this.oODataModel.read("/ZET_BP_HEADERSet", {
              success: function (oData) {
                console.log("✅ Dati ricevuti:", oData);

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

      onBPSelected: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("listItem");
        var oContext = oSelectedItem.getBindingContext("BPData");

        if (!oContext) {
          MessageToast.show(
            "⚠️ Errore: Nessun dato trovato nella riga selezionata."
          );
          return;
        }

        // 🔹 Salviamo l'IdDelivery selezionato
        this.sSelectedIdDelivery = oContext.getProperty("IdDelivery");
        console.log(
          "📡 BP selezionato con IdDelivery:",
          this.sSelectedIdDelivery
        );

        // Abilita il pulsante "SUIVANT"
        var oSuivantButton = this.getView().byId("idSUIVANTButton");
        if (oSuivantButton) {
          oSuivantButton.setEnabled(true);
        }
      },

      onNextBP: function () {
        if (!this.sSelectedIdDelivery) {
          MessageToast.show("⚠️ Seleziona prima un BP.");
          return;
        }

        // 🔹 Formatta l'IdDelivery con gli zeri iniziali
        var sFormattedId = this._formatIdDelivery(this.sSelectedIdDelivery);
        console.log(
          "🔹 Navigazione a BP-RechercheProduit con IdDelivery:",
          sFormattedId
        );

        // 🔹 Naviga alla rotta con l'IdDelivery selezionato
        this.oRouter.navTo("BP-RechercheProduit", {
          IdDelivery: sFormattedId,
        });
      },

      /**
       * 🔹 Funzione per formattare l'ID con zeri iniziali (es. '5113107' → '0005113107')
       */
      _formatIdDelivery: function (sId) {
        if (!sId) return "0000000000"; // Default se non presente
        return sId.padStart(10, "0"); // Assicura sempre 10 caratteri
      },
    });
  }
);
