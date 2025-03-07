sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  function (Controller, UIComponent, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("logistic-flow.controller.Batch", {
      onInit: function () {
        // Recupera il router per la navigazione
        this.oRouter = UIComponent.getRouterFor(this);
      },

      // Eseguito alla pressione del pulsante "Continuer"
      onValidate: function () {
        console.log("Continuer button pressed.");
        this._createMaterialDet();
      },

      // Eseguito alla pressione del pulsante "Fin traitement"
      onSubmit: function () {
        console.log("Fin traitement button pressed.");
        this._createMaterialDet();
      },

      // Funzione per effettuare la chiamata POST al servizio OData
      _createMaterialDet: function () {
        var oView = this.getView();
        var sConditionnement = oView.byId("conditionnement")
          ? oView.byId("conditionnement").getValue()
          : "";
        var sQuantite = oView.byId("inputQuantite")
          ? oView.byId("inputQuantite").getValue()
          : "";
        var sLotPropose = oView.byId("inputLotPropose")
          ? oView.byId("inputLotPropose").getValue()
          : "";

        // Controlla che tutti i campi obbligatori siano compilati
        if (!sConditionnement || !sQuantite || !sLotPropose) {
          MessageBox.warning(
            "Veuillez remplir tous les champs obligatoires avant de soumettre."
          );
          return;
        }

        // Creazione del payload da inviare
        var oPayload = {
          IdDelivery: "12345", // Valore fittizio, da sostituire con il reale
          Item: "001", // Valore fittizio, da adattare
          IdCollo: sLotPropose,
          QPick: parseFloat(sQuantite) || 0,
          UMQPick: "KG", // Da verificare in base ai metadata
          Conditionnement: sConditionnement,
          TipoImbalo: "Standard", // Da adattare in base alle necessità
        };

        console.log("📡 Invio richiesta OData con payload:", oPayload);

        // Recupera il modello OData configurato in manifest.json
        var oModel = this.getView().getModel();
        if (!oModel) {
          MessageBox.error("❌ Errore: Modello OData non trovato.");
          return;
        }

        // Chiamata POST al servizio OData, utilizzando l'EntitySet corretto
        oModel.create("/ZET_MATERIAL_DET_CREATE_ENTITY", oPayload, {
          success: function (oData, response) {
            MessageToast.show("✅ Dati inviati con successo!");
            console.log("✅ Risposta OData:", response);
          },
          error: function (oError) {
            MessageBox.error(
              "❌ Errore nell'invio dei dati: " + JSON.stringify(oError)
            );
            console.error("❌ Dettagli errore:", oError);
          },
        });
      },

      // Gestisce la navigazione all'indietro, richiedendo conferma se sono stati inseriti dati
      onNavBack: function () {
        var oView = this.getView();
        var aInputIds = ["conditionnement", "inputQuantite", "inputLotPropose"];

        var bFieldFilled = aInputIds.some(function (sId) {
          var oInput = oView.byId(sId);
          return oInput && oInput.getValue && oInput.getValue().trim() !== "";
        });

        if (bFieldFilled) {
          MessageBox.show(
            "Des données ont été saisies dans les champs. Êtes-vous sûr de vouloir quitter cette page ?",
            {
              icon: MessageBox.Icon.WARNING,
              title: "Attention",
              actions: ["Oui", "Non"],
              emphasizedAction: "Oui",
              onClose: function (sAction) {
                if (sAction === "Oui") {
                  this.oRouter.navTo("PrepareProduit", {}, true);
                }
              }.bind(this),
            }
          );
        } else {
          this.oRouter.navTo("PrepareProduit", {}, true);
        }
      },
    });
  }
);
