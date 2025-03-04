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
      },

      onInputChange: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oButton = this.byId("nextButton");
        oButton.setEnabled(sValue && sValue.trim().length > 0);
      },

      onSuivantPress: function () {
        // Navigation vers la route "Batch"
        this.oRouter.navTo("Batch");
      },

      onNavBack: function () {
        var oInput = this.byId("productInput");
        var sValue = oInput.getValue();

        if (sValue && sValue.trim().length > 0) {
          // ✅ Personalisation des boutons en français
          MessageBox.show(
            "Des données ont été saisies dans le champ produit. Êtes-vous sûr de vouloir revenir en arrière ?",
            {
              icon: MessageBox.Icon.WARNING,
              title: "Attention",
              actions: [
                "Oui", // 🔹 Bouton personnalisé pour "OUI"
                "Non", // 🔹 Bouton personnalisé pour "NON"
              ],
              emphasizedAction: "Oui",
              onClose: function (sAction) {
                if (sAction === "Oui") {
                  this.oRouter.navTo("BP-Preparation");
                }
              }.bind(this),
            }
          );
        } else {
          this.oRouter.navTo("BP-Preparation");
        }
      },
    });
  }
);
