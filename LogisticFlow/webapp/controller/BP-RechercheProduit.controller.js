sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-RechercheProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
        // Attacca il patternMatched per entrambe le rotte
        this.oRouter
          .getRoute("BP-RechercheProduit")
          .attachPatternMatched(this._onRouteMatched, this);
        this.oRouter
          .getRoute("PrepareProduit")
          .attachPatternMatched(this._onRouteMatched, this);

        // Imposta il modello di view per la ricerca
        var oViewModel = new JSONModel({
          searchPlaceholder: "Rechercher par Code...",
          inputType: "Text",
          BPRechercheData: [],
          selectedFilter: "MaterialCode",
        });
        this.getView().setModel(oViewModel, "BPData");
      },

      _onRouteMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name");
        var oArgs = oEvent.getParameter("arguments");
        // Recupera e formatta l'ID Delivery
        this.sIdDelivery = this._formatIdDelivery(oArgs.IdDelivery);
        console.log("ID récupéré (formaté):", this.sIdDelivery);

        // Imposta il modello OData se non già presente
        if (!this.getView().getModel("ODataModel")) {
          this.oODataModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZPP_WSM_SRV/",
            {
              defaultBindingMode: "TwoWay",
              useBatch: false,
              defaultCountMode: "Inline",
            }
          );
          this.getView().setModel(this.oODataModel, "ODataModel");
        }

        if (this.sIdDelivery) {
          this._loadBPData();
        } else {
          console.warn(
            "⚠️ Aucun ID valide trouvé, impossible de charger les données."
          );
        }

        // Gestisce la selezione del tab in base alla rotta corrente:
        // Se siamo sulla rotta "PrepareProduit", seleziona il tab2.
        var oIconTabBar = sap.ui.core.Fragment.byId(
          "iconTabBarFragment",
          "globalIconTabBar"
        );
        if (oIconTabBar) {
          if (sRouteName === "PrepareProduit") {
            oIconTabBar.setSelectedKey("tab2");
          } else {
            // Per la rotta "BP-RechercheProduit" (o altre), assicurati che il tab1 sia selezionato
            oIconTabBar.setSelectedKey("tab1");
          }
        } else {
          console.warn("IconTabBar non trouvé dans le fragment.");
        }
      },

      _loadBPData: function () {
        var oModel = this.getView().getModel("ODataModel");
        if (!oModel) {
          console.error("❌ ODataModel non trouvé dans la vue.");
          MessageToast.show("❌ Erreur: ODataModel non initialisé.");
          return;
        }

        var sFilter = "IdDelivery eq '" + this.sIdDelivery + "'";
        console.log("Lancement de la requête OData avec filtre:", sFilter);

        oModel.read("/ZET_BP_POSITIONSet", {
          urlParameters: { $filter: sFilter },
          success: function (oData) {
            console.log("Données reçues:", oData);
            if (!oData || !oData.results || oData.results.length === 0) {
              MessageToast.show(
                "⚠️ Aucune donnée trouvée pour l'ID: " + this.sIdDelivery
              );
              return;
            }
            var oBPJsonModel = this.getView().getModel("BPData");
            oBPJsonModel.setProperty("/BPRechercheData", oData.results);
          }.bind(this),
          error: function (oError) {
            console.error("❌ Erreur lors de la requête OData:", oError);
            MessageToast.show("❌ Erreur lors de la récupération des données.");
          },
        });
      },

      onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("newValue").trim();
        var oTable = this.getView().byId("bpTable");
        var oBinding = oTable.getBinding("items");
        var oViewModel = this.getView().getModel("BPData");
        var sFilterField = oViewModel.getProperty("/selectedFilter");
        var aFilters = sQuery
          ? [new Filter(sFilterField, FilterOperator.Contains, sQuery)]
          : [];
        oBinding.filter(aFilters);
      },

      onSelectionChange: function (oEvent) {
        var iSelectedIndex = oEvent.getParameter("selectedIndex");
        var oViewModel = this.getView().getModel("BPData");
        var sPlaceholder =
          iSelectedIndex === 0
            ? "Rechercher par Code..."
            : "Rechercher par Libellé...";
        var sFilterField =
          iSelectedIndex === 0 ? "MaterialCode" : "MaterialDescription";
        oViewModel.setProperty("/searchPlaceholder", sPlaceholder);
        oViewModel.setProperty("/selectedFilter", sFilterField);
        var oSearchField = this.getView().byId("bpSearchField");
        oSearchField.setValue("");
        this.onSearch({
          getParameter: function () {
            return "";
          },
        });
      },

      _formatIdDelivery: function (sId) {
        return sId ? sId.padStart(10, "0") : "0000000000";
      },

      onTestScan: function () {
        this.oRouter.navTo("PrepareProduit", { IdDelivery: this.sIdDelivery });
      },

      onNavBack: function () {
        this.oRouter.navTo("BP-Preparation");
      },

      /**
       * Gestisce la selezione del tab nell'IconTabBar.
       * Se l'utente clicca sul tab1, naviga verso /BP-Preparation.
       */
      onGlobalTabSelect: function (oEvent) {
        var sSelectedKey = oEvent.getParameter("selectedKey");
        if (sSelectedKey === "tab1") {
          this.oRouter.navTo("BP-Preparation");
        }
      },

      /**
       * Metodo chiamato quando viene premuto il bottone "Suivant".
       * Naviga alla rotta "PrepareProduit" passando il parametro "IdDelivery".
       */
      onAdvance: function () {
        if (this.sIdDelivery) {
          this.oRouter.navTo("PrepareProduit", {
            IdDelivery: this.sIdDelivery,
          });
        } else {
          MessageToast.show("⚠️ Aucun ID Delivery disponible.");
        }
      },

      onNavigateToBatch: function () {
        if (this.sIdDelivery) {
          this.oRouter.navTo("Batch", { IdDelivery: this.sIdDelivery });
        } else {
          MessageToast.show("⚠️ Aucun ID Delivery disponible.");
        }
      },
    });
  }
);
