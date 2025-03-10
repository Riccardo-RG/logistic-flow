sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/m/MessageBox"],
  function (Controller, UIComponent, MessageBox) {
    "use strict";

    return Controller.extend("logistic-flow.controller.InformationsProduit", {
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
          MessageBox.show(
            "Des données ont été saisies dans les champs. Êtes-vous sûr de vouloir quitter cette page ?",
            {
              icon: MessageBox.Icon.WARNING,
              title: "Attention",
              actions: ["Oui", "Non"],
              emphasizedAction: "Oui",
              onClose: function (sAction) {
                if (sAction === "Oui") {
                  this.oRouter.navTo("MainView", {}, true);
                }
              }.bind(this),
            }
          );
        } else {
          this.oRouter.navTo("MainView", {}, true);
        }
      },
    });
  }
);
