sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
  ],
  function (UIComponent, JSONModel, Fragment) {
    "use strict";

    return UIComponent.extend("logistic-flow.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        // Chiamare la funzione init della classe padre
        UIComponent.prototype.init.apply(this, arguments);

        // Inizializzare il router
        this.getRouter().initialize();

        // Creare e impostare il modello JSON con i dati di data.json
        var oModel = new JSONModel("model/data.json");
        this.setModel(oModel);

        // Includere il CSS
        sap.ui.getCore().attachInit(function () {
          sap.ui.require(
            ["sap/ui/dom/includeStylesheet"],
            function (includeStylesheet) {
              includeStylesheet("css/style.css");
            }
          );
        });

        // Recupera il NavContainer dalla rootControl e aggiungi l'handler afterNavigate
        var oRootControl = this.getRootControl();
        var oNavContainer = oRootControl.byId("navContainer");
        if (oNavContainer) {
          oNavContainer.attachAfterNavigate(function (oEvent) {
            var oPage = oEvent.getParameter("to");
            // Se la pagina non ha già un subHeader o non contiene il GlobalTabBar, iniettiamo il frammento
            if (
              oPage &&
              (!oPage.getSubHeader() ||
                !oPage.getSubHeader().getId().includes("GlobalTabBar"))
            ) {
              var that = this;
              Fragment.load({
                name: "logistic-flow.fragment.GlobalTabBar",
                controller: that,
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
