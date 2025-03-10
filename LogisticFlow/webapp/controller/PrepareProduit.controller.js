sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/m/MessageBox", // ✅ Importation de MessageBox pour l'alerte
  ],
  function (Controller, UIComponent, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("logistic-flow.controller.PrepareProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // Récupération de l'IdDelivery depuis l'URL si présent
        this.oRouter
          .getRoute("PrepareProduit")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        this.sIdDelivery = oArgs.IdDelivery || "";
      },

      onInputChange: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oButton = this.byId("nextButton");
        oButton.setEnabled(sValue && sValue.trim().length > 0);
      },

      onSuivantPress: function () {
        // Navigation vers la route "Batch" avec l'IdDelivery
        if (this.sIdDelivery) {
          this.oRouter.navTo("Batch", {
            IdDelivery: this.sIdDelivery,
          });
        } else {
          this.oRouter.navTo("Batch");
        }
      },

      onNavBack: function () {
        var oInput = this.byId("productInput");
        var sValue = oInput.getValue();

        if (sValue && sValue.trim().length > 0) {
          // ✅ Personalizzazione dei pulsanti
          MessageBox.show(
            "Des données ont été saisies dans le champ produit. Êtes-vous sûr de vouloir revenir en arrière ?",
            {
              icon: MessageBox.Icon.WARNING,
              title: "Attention",
              actions: ["Oui", "Non"],
              emphasizedAction: "Oui",
              onClose: function (sAction) {
                if (sAction === "Oui") {
                  if (this.sIdDelivery) {
                    this.oRouter.navTo("BP-RechercheProduit", {
                      IdDelivery: this.sIdDelivery,
                    });
                  } else {
                    MessageToast.show("⚠️ Aucun IdDelivery trouvé.");
                  }
                }
              }.bind(this),
            }
          );
        } else {
          if (this.sIdDelivery) {
            this.oRouter.navTo("BP-RechercheProduit", {
              IdDelivery: this.sIdDelivery,
            });
          } else {
            MessageToast.show("⚠️ Aucun IdDelivery trouvé.");
          }
        }
      },
    });
  }
);
