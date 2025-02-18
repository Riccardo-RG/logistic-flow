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
          MessageBox.confirm(
            "Ci sono modifiche non salvate. Confermi di voler uscire?",
            {
              title: "Conferma",
              onClose: function (oAction) {
                if (oAction === MessageBox.Action.OK) {
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
