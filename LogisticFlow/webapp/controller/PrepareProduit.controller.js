sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
  ],
  function (Controller, UIComponent, MessageToast) {
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
        // Naviga alla route "Batch"
        this.oRouter.navTo("Batch");
      },

      onNavBack: function () {
        // Navigazione a "BP-RechercheProduit"
        this.oRouter.navTo("BP-Preparation");
      },
    });
  }
);
