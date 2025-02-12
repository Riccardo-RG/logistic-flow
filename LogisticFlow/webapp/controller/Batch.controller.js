sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("logistic-flow.controller.Batch", {
      /**
       * Metodo di inizializzazione
       */
      onInit: function () {
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      },

      onNavBack: function () {
        this.oRouter.navTo("PrepareProduit", {}, true);
      },
    });
  }
);
