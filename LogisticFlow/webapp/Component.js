sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/Fragment",
    "logistic-flow/utils/ProduitFormatter",
  ],
  function (UIComponent, JSONModel, ODataModel, Fragment, ProduitFormatter) {
    "use strict";

    return UIComponent.extend("logistic-flow.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        // 1. Chiamare la funzione init della classe padre
        UIComponent.prototype.init.apply(this, arguments);

        // 2. Inizializzare il router
        this.getRouter().initialize();

        // 3. Creare (eventualmente) un modello JSON di dati di esempio
        var oJsonModel = new JSONModel("model/data.json");
        this.setModel(oJsonModel, "jsonModel");

        // 4. Creazione del modello OData

        // 8. Includere il CSS personalizzato
        sap.ui.getCore().attachInit(function () {
          sap.ui.require(
            ["sap/ui/dom/includeStylesheet"],
            function (includeStylesheet) {
              includeStylesheet("css/style.css");
            }
          );
        });

        console.log("ProduitFormatter caricato:", ProduitFormatter);

        // 9. Gestione NavContainer e iniezione del frammento GlobalTabBar (se necessario)
        var oRootControl = this.getRootControl();
        var oNavContainer = oRootControl && oRootControl.byId("navContainer");
        if (oNavContainer) {
          oNavContainer.attachAfterNavigate(function (oEvent) {
            var oPage = oEvent.getParameter("to");
            if (
              oPage &&
              (!oPage.getSubHeader() ||
                !oPage.getSubHeader().getId().includes("GlobalTabBar"))
            ) {
              Fragment.load({
                name: "logistic-flow.fragment.GlobalTabBar",
                controller: this,
              }).then(function (oGlobalTabBar) {
                oPage.setSubHeader(oGlobalTabBar);
              });
            }
          }, this);
        }
      },
    });
  }
);
