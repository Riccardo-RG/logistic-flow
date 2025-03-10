sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
  ],
  function (Controller, UIComponent, MessageBox, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("logistic-flow.controller.Batch", {
      onInit: function () {
        // Recupera il router per la navigazione
        this.oRouter = UIComponent.getRouterFor(this);

        // Recupera l'IdDelivery dalla rotta
        this.oRouter
          .getRoute("Batch")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        this.sIdDelivery = oArgs.IdDelivery || "";

        // Inizializza il modello OData SOLO se non già presente
        if (!this.getView().getModel("ODataModel")) {
          this.oODataModel = new ODataModel("/sap/opu/odata/sap/ZPP_WSM_SRV/", {
            defaultBindingMode: "TwoWay",
            useBatch: false,
            defaultCountMode: "Inline",
          });
          this.getView().setModel(this.oODataModel, "ODataModel");
        }
      },

      // Funzione chiamata quando si preme "Continuer"
      onValidate: function () {
        console.log("➡️ Continuer button pressed.");
        this._createMaterialDet();
      },

      // Funzione chiamata quando si preme "Fin traitement"
      onSubmit: function () {
        console.log("➡️ Fin traitement button pressed.");
        this._createMaterialDet();
      },

      // Funzione per effettuare la chiamata POST al servizio OData
      _createMaterialDet: function () {
        var oView = this.getView();

        var sConditionnement = oView.byId("conditionnement").getValue();
        var sQuantite = oView.byId("inputQuantite").getValue();
        var sLotPropose = oView.byId("inputLotPropose").getValue();

        // Controllo che tutti i campi obbligatori siano compilati
        if (!sConditionnement || !sQuantite || !sLotPropose) {
          MessageBox.warning(
            "⚠️ Veuillez remplir tous les champs obligatoires avant de soumettre."
          );
          return;
        }

        // Creazione del payload da inviare
        var oPayload = {
          IdDelivery: this.sIdDelivery || "0005113107", // Recuperato dinamicamente
          Item: "000001", // Da aggiornare se dinamico
          IdCollo: sLotPropose,
          QtPick: parseFloat(sQuantite) || 0, // ✅ Convertito in numero
          UmQtPick: "KG", // Da verificare nei metadata
          Batch: "B98765", // Valore fisso, aggiornare se dinamico
          TipoImballo: sConditionnement,
        };

        console.log("📡 Invio richiesta OData con payload:", oPayload);

        // Recupera il modello OData
        var oModel = this.getView().getModel("ODataModel");
        if (!oModel) {
          MessageBox.error("❌ Errore: Modello OData non trovato.");
          return;
        }

        // Chiamata POST al servizio OData
        oModel.create("/ZET_MATERIAL_DETSet", oPayload, {
          success: function (oData, response) {
            MessageToast.show("✅ Dati inviati con successo!");
            console.log("✅ Risposta OData:", response);
          },
          error: function (oError) {
            MessageBox.error(
              "❌ Errore nell'invio dei dati. Dettagli nella console."
            );
            console.error("❌ Dettagli errore:", oError);

            // Debugging avanzato
            if (oError.responseText) {
              try {
                var oErrorResponse = JSON.parse(oError.responseText);
                console.error("📌 Dettagli errore SAP:", oErrorResponse);
              } catch (e) {
                console.error(
                  "❌ Errore durante il parsing della risposta:",
                  e
                );
              }
            }
          },
        });
      },

      // Gestisce la navigazione all'indietro
      onNavBack: function () {
        if (this.sIdDelivery) {
          this.oRouter.navTo("PrepareProduit", {
            IdDelivery: this.sIdDelivery,
          });
        } else {
          this.oRouter.navTo("PrepareProduit");
        }
      },
    });
  }
);
