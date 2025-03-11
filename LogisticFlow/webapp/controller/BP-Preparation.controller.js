sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    ODataModel,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-Preparation", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // Creazione del modello OData
        this.oODataModel = new ODataModel("/sap/opu/odata/sap/ZPP_WSM_SRV/", {
          defaultBindingMode: "TwoWay",
          useBatch: false,
          defaultCountMode: "Inline",
        });
        this.getView().setModel(this.oODataModel, "ODataModel");

        // Attendere il caricamento dei metadati prima di fare la richiesta
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
                var oBPJsonModel = new JSONModel({
                  results: oData.results,
                  filteredResults: oData.results, // Inizialmente mostra tutti
                });

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

        // Attacca l'evento per aggiornare la selezione della IconTabBar in base alla rotta
        this.oRouter.attachRoutePatternMatched(
          this._onRoutePatternMatched,
          this
        );
      },

      _onRoutePatternMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name");
        if (sRouteName === "BP-Preparation") {
          // Imposta il primo tab (chiave "tab1") come selezionato
          var oIconTabBar = this.byId("globalIconTabBar");
          if (oIconTabBar) {
            oIconTabBar.setSelectedKey("tab1");
          }
        }
      },

      onGlobalTabSelect: function (oEvent) {
        var sSelectedKey = oEvent.getParameter("selectedKey");
        console.log("Tab selezionato: " + sSelectedKey);

        if (sSelectedKey === "tab1") {
          this.oRouter.navTo("BP-Preparation");
        } else if (sSelectedKey === "tab2") {
          // Verifica che sia stato selezionato un BP
          if (!this.sSelectedIdDelivery) {
            MessageToast.show("⚠️ Sélectionnez d’abord un BP.");
            // Ritorna al tab1 se nessun BP è selezionato
            this.byId("globalIconTabBar").setSelectedKey("tab1");
            return;
          }
          // Formatta l'idDelivery e naviga alla rotta BP-RechercheProduit passando il parametro IdDelivery
          var sFormattedId = this._formatIdDelivery(this.sSelectedIdDelivery);
          console.log(
            "Navigazione a BP-RechercheProduit con IdDelivery: " + sFormattedId
          );
          this.oRouter.navTo("BP-RechercheProduit", {
            IdDelivery: sFormattedId,
          });
        } else if (sSelectedKey === "tab3") {
          this.oRouter.navTo("InformationsProduit");
        }
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

        // Salva l'idDelivery selezionato per la navigazione
        this.sSelectedIdDelivery = oContext.getProperty("IdDelivery");
        console.log("BP selezionato: " + this.sSelectedIdDelivery);

        var oSuivantButton = this.getView().byId("idSUIVANTButton");
        if (oSuivantButton) {
          oSuivantButton.setEnabled(true);
        }

        var oCustomerDetailButton = this.getView().byId("idCustomerDetail");
        if (oCustomerDetailButton) {
          oCustomerDetailButton.setVisible(true);
        }
      },

      onNextBP: function () {
        if (!this.sSelectedIdDelivery) {
          MessageToast.show("⚠️ Sélectionnez d’abord un BP.");
          return;
        }

        var sFormattedId = this._formatIdDelivery(this.sSelectedIdDelivery);
        console.log(
          "Navigazione a BP-RechercheProduit con IdDelivery: " + sFormattedId
        );
        this.oRouter.navTo("BP-RechercheProduit", { IdDelivery: sFormattedId });
      },

      onDetailDuClient: function () {
        this.oRouter.navTo("DetailDuClient");
      },

      onTestF4Press: function () {
        this.oRouter.navTo("BP-DoJour");
      },

      onSearchBP: function (oEvent) {
        var sQuery =
          oEvent.getParameter("value") || oEvent.getSource().getValue();
        var oModel = this.getView().getModel("BPData");

        if (!oModel) return;

        var aResults = oModel.getProperty("/results") || [];
        var aFiltered = aResults.filter(function (oItem) {
          return oItem.IdDelivery.includes(sQuery);
        });

        oModel.setProperty("/filteredResults", aFiltered);
        console.log("Filtrati:", aFiltered);
      },

      /**
       * Funzione per formattare l'ID con zeri iniziali (es. '5113107' → '0005113107')
       */
      _formatIdDelivery: function (sId) {
        if (!sId) return "0000000000";
        return sId.padStart(10, "0");
      },
    });
  }
);
