sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (Controller, UIComponent, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("logistic-flow.controller.PrepareProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // Ascolta il "patternMatched" della rotta "PrepareProduit"
        this.oRouter
          .getRoute("PrepareProduit")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        this.sIdDelivery = oArgs.IdDelivery || "";

        // Quando entriamo nella rotta PrepareProduit, selezioniamo il tab2
        // (assumendo che l'IconTabBar abbia id="globalIconTabBar" nel fragment)
        var oIconTabBar = this.getView().byId("globalIconTabBar");
        if (oIconTabBar) {
          oIconTabBar.setSelectedKey("tab2");
        }
      },

      // Richiamato dal liveChange dell’Input "productInput"
      onInputChange: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oButton = this.byId("nextButton");
        oButton.setEnabled(sValue && sValue.trim().length > 0);
      },

      // Bottone "Suivant" → naviga alla rotta "Batch"
      onSuivantPress: function () {
        if (this.sIdDelivery) {
          this.oRouter.navTo("Batch", {
            IdDelivery: this.sIdDelivery,
          });
        } else {
          this.oRouter.navTo("Batch");
        }
      },

      // Gestione del pulsante Back con conferma se l’input non è vuoto
      onNavBack: function () {
        var oInput = this.byId("productInput");
        var sValue = oInput.getValue();

        if (sValue && sValue.trim().length > 0) {
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

      /**
       * Metodo richiamato dal select="onGlobalTabSelect" dell'IconTabBar (nel fragment).
       * Se l’utente seleziona il tab1, navighiamo a /BP-Preparation.
       */
      onGlobalTabSelect: function (oEvent) {
        var sSelectedKey = oEvent.getParameter("selectedKey");
        if (sSelectedKey === "tab1") {
          this.oRouter.navTo("BP-Preparation");
        }
      },
    });
  }
);
