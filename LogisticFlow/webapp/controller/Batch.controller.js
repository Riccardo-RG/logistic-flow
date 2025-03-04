sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/m/MessageBox"],
  function (Controller, UIComponent, MessageBox) {
    "use strict";

    return Controller.extend("logistic-flow.controller.Batch", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
      },

      onNavBack: function () {
        var oView = this.getView();
        var aInputIds = [
          "inputQuantite",
          "inputLotPropose",
          "inputQteDuLot",
          "inputLot",
          "inputNbCollis",
          "inputNbBP",
        ];

        var bFieldFilled = aInputIds.some(function (sId) {
          var oInput = oView.byId(sId);
          return oInput && oInput.getValue && oInput.getValue().trim() !== "";
        });

        if (bFieldFilled) {
          // ✅ Boîte de dialogue de confirmation en français avec boutons personnalisés
          MessageBox.show(
            "Des données ont été saisies dans les champs. Êtes-vous sûr de vouloir quitter cette page ?",
            {
              icon: MessageBox.Icon.WARNING,
              title: "Attention",
              actions: ["Oui", "Non"], // 🔹 Boutons personnalisés en français
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
