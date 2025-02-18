sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, UIComponent, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-Preparation", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // Event delegate per il click globale
        this.getView().addEventDelegate({
          onclick: function (oEvent) {
            var oTable = this.getView().byId("bpTable");
            var oTableDom = oTable.getDomRef();
            var oClickedDom = oEvent.target;

            // Recupera il riferimento del bottone BP AUTO
            var oBpAutoButton = this.getView().byId("idBpAutoButton");
            var oBpAutoDom = oBpAutoButton && oBpAutoButton.getDomRef();

            // Recupera il riferimento del bottone detail du client
            var oCustomerDetailButton = this.getView().byId("idCustomerDetail");
            var oCustomerDetailDom =
              oCustomerDetailButton && oCustomerDetailButton.getDomRef();

            // Se il click avviene sul BP AUTO oppure sul detail du client (o all'interno di essi), non eseguire il reset
            if (
              (oBpAutoDom && oBpAutoDom.contains(oClickedDom)) ||
              (oCustomerDetailDom && oCustomerDetailDom.contains(oClickedDom))
            ) {
              return;
            }

            // Se il click avviene fuori dalla tabella...
            if (oTableDom && !oTableDom.contains(oClickedDom)) {
              var aItems = oTable.getItems();
              aItems.forEach(function (item) {
                item.setSelected(false);
              });
              if (typeof oTable.clearSelection === "function") {
                oTable.clearSelection();
              } else if (typeof oTable.setSelectedItem === "function") {
                oTable.setSelectedItem(null, true);
              }

              // Nasconde il bottone "detail du client"
              if (oCustomerDetailButton) {
                oCustomerDetailButton.setVisible(false);
              }

              // Se il BP AUTO è attivo, rimuove la classe "active" e cancella il filtro
              if (oBpAutoButton && oBpAutoButton.hasStyleClass("active")) {
                oBpAutoButton.removeStyleClass("active");
                oTable.getBinding("items").filter([]);
              }
            }
          }.bind(this),
        });
      },

      onNavBack: function () {
        this.oRouter.navTo("MainView", {}, true);
      },

      onToggleFilter: function (oEvent) {
        var oButton = oEvent.getSource(); // Bottone BP AUTO
        var bActive = oButton.hasStyleClass("active");
        var oTable = this.getView().byId("bpTable");
        var oCustomerDetailButton = this.getView().byId("idCustomerDetail");
        var oSuivantButton = this.getView().byId("idSUIVANTButton");

        if (bActive) {
          oTable.getBinding("items").filter([]);
          oButton.removeStyleClass("active");
          oCustomerDetailButton.setVisible(false);
          oSuivantButton.setEnabled(false);
        } else {
          oTable.getBinding("items").filter([]);
          oButton.addStyleClass("active");
          // Assicurati che il bottone "detail du client" resti nascosto
          oCustomerDetailButton.setVisible(false);
          // Impediamo che il bottone Suivant diventi abilitato
          oSuivantButton.setEnabled(false);
        }
      },

      onBPSelected: function (oEvent) {
        var oCustomerDetailButton = this.getView().byId("idCustomerDetail");
        oCustomerDetailButton.setVisible(true);
        var oSuivantButton = this.getView().byId("idSUIVANTButton");
        oSuivantButton.setEnabled(true);
      },

      onTestF4Press: function () {
        this.oRouter.navTo("BP-DoJour");
      },

      onNextBP: function () {
        this.oRouter.navTo("BP-RechercheProduit");
      },

      // Metodo per navigare alla view DetailDuClient
      onDetailDuClient: function () {
        this.oRouter.navTo("DetailDuClient", {}, true);
      },
    });
  }
);
