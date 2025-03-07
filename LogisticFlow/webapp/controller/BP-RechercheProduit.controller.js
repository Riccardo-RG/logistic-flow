sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    UIComponent,
    History,
    ODataModel,
    JSONModel,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-RechercheProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // 🔹 Recupera l'ID dall'URL quando la vista viene caricata
        this.oRouter
          .getRoute("BP-RechercheProduit")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");

        // 🔹 Formatta l'ID per SAP (con zeri iniziali)
        this.sIdDelivery = this._formatIdDelivery(
          oArgs.IdDelivery || "5113107"
        );

        console.log(
          "📡 ID recuperato dall'URL (formattato):",
          this.sIdDelivery
        );

        // 🔹 Inizializza il modello OData solo se non esiste già
        if (!this.getView().getModel("ODataModel")) {
          this.oODataModel = new ODataModel("/sap/opu/odata/sap/ZPP_WSM_SRV/", {
            defaultBindingMode: "TwoWay",
            useBatch: false,
            defaultCountMode: "Inline",
          });

          console.log(
            "📡 ODataModel creato e assegnato alla View:",
            this.oODataModel
          );
          this.getView().setModel(this.oODataModel, "ODataModel");
        }

        // 🔹 Avvia il caricamento dei dati solo se l'ID è valido
        if (this.sIdDelivery) {
          this._loadBPData();
        } else {
          console.warn(
            "⚠️ Nessun ID valido trovato, impossibile caricare i dati."
          );
        }
      },

      _loadBPData: function () {
        var oModel = this.getView().getModel("ODataModel");

        if (!oModel) {
          console.error("❌ ODataModel non trovato nella View.");
          MessageToast.show("❌ Errore: ODataModel non inizializzato.");
          return;
        }

        // 🔹 Creazione del filtro esattamente come richiesto
        var sFilter = "IdDelivery eq '" + this.sIdDelivery + "'";

        console.log("📡 Avvio richiesta OData con filtro:", sFilter);

        oModel.read("/ZET_BP_POSITIONSet", {
          urlParameters: {
            $filter: sFilter, // 🔹 Imposta il filtro nella chiamata OData
          },
          success: function (oData) {
            console.log("✅ Dati ricevuti:", oData);

            if (!oData || !oData.results || oData.results.length === 0) {
              console.warn("⚠️ Nessun dato ricevuto dall'OData.");
              MessageToast.show(
                "⚠️ Nessun dato trovato per l'ID: " + this.sIdDelivery
              );
              return;
            }

            // 🔹 Crea e assegna il modello JSON
            var oBPJsonModel = new JSONModel({
              BPRechercheData: oData.results,
            });

            this.getView().setModel(oBPJsonModel, "BPData");
            console.log(
              "📡 Modello BPData impostato con i risultati:",
              oBPJsonModel.getData()
            );
          }.bind(this),
          error: function (oError) {
            console.error("❌ Errore nella richiesta OData:", oError);
            MessageToast.show("❌ Errore nel recupero dei dati.");
          },
        });
      },

      /**
       * 🔹 Funzione per formattare l'ID con zeri iniziali (es. '5113107' → '0005113107')
       */
      _formatIdDelivery: function (sId) {
        if (!sId) return "0000000000"; // Default se non presente
        return sId.padStart(10, "0"); // Assicura sempre 10 caratteri
      },

      onTestScan: function () {
        this.oRouter.navTo("PrepareProduit");
      },

      onNavBack: function () {
        this.oRouter.navTo("BP-Preparation");
      },
    });
  }
);
