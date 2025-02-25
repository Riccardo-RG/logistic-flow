sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, UIComponent, History, JSONModel) {
    "use strict";
    return Controller.extend("logistic-flow.controller.BP-RechercheProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
        var oModel = this.getOwnerComponent().getModel();
        if (!oModel) {
          console.warn(
            "Modello non trovato! Controlla che sia stato assegnato correttamente."
          );
        } else {
          console.log(
            "Dati nel modello:",
            oModel.getProperty("/BPRechercheData")
          );
        }
        this.getView().setModel(oModel);
      },

      onAfterRendering: function () {
        var oTable = this.byId("bpTable");
        if (!oTable) return;
        var aItems = oTable.getItems();
        aItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          if (!oBindingContext) return;
          var bAvailable = oBindingContext.getProperty("avaiable");
          var sClass = bAvailable ? "greenRow" : "redRow";
          oItem.addStyleClass(sClass);
        });
        console.log("Numero di righe nella tabella:", aItems.length);
      },

      formatHighlight: function (bAvailable) {
        return bAvailable ? "Success" : "Error";
      },

      formatCheck: function (bCheck) {
        console.log("Valore di 'pr' ricevuto nel formatter:", bCheck);
        return bCheck === true ? "✓" : "";
      },

      refreshModel: function () {
        var oModel = this.getView().getModel();
        if (oModel) {
          oModel.refresh(true);
          console.log("Modello aggiornato forzatamente.");
        } else {
          console.warn("Impossibile aggiornare il modello: non trovato.");
        }
      },

      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.oRouter.navTo("MainView", {}, true);
        }
      },

      onCancel: function () {
        sap.m.MessageToast.show("Azione annullata.");
      },

      // Modifica: Naviga verso la rotta "manage" quando si clicca Valider
      onValidate: function () {
        this.oRouter.navTo("Manage");
      },

      onRowSelect: function (oEvent) {
        var oSelectedItem = oEvent.getSource();
        var oTable = this.byId("bpTable");
        oTable.getItems().forEach(function (item) {
          item.removeStyleClass("selectedRow");
        });
        oSelectedItem.addStyleClass("selectedRow");
      },

      onTestScan: function () {
        this.oRouter.navTo("PrepareProduit");
      },
    });
  }
);
