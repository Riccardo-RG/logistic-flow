sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "logistic-flow/utils/ProduitFormatter",
  ],
  function (
    Controller,
    MessageToast,
    JSONModel,
    History,
    UIComponent,
    ProduitFormatter
  ) {
    "use strict";

    return Controller.extend(
      "logistic-flow.controller.HandlingUnitManagement",
      {
        onInit: function () {
          var oModel = new JSONModel();

          // Carica i dati in modo asincrono
          oModel.loadData("model/data.json");

          // Attendi il completamento della richiesta prima di assegnare i dati
          oModel.attachRequestCompleted(
            function (oEvent) {
              if (!oEvent.getParameter("errorObject")) {
                var oData = oModel.getData();

                // ✅ APPLICA IL FORMATTER AI DATI PRIMA DELLA VISUALIZZAZIONE
                oData.Produits.forEach(function (oItem) {
                  oItem.PaletteVisible = ProduitFormatter.isValueVisible(
                    oItem.Palette
                  );
                  oItem.PaletteButtonVisible = ProduitFormatter.isButtonVisible(
                    oItem.Palette
                  );
                  oItem.BoxVisible = ProduitFormatter.isValueVisible(oItem.Box);
                  oItem.BoxButtonVisible = ProduitFormatter.isButtonVisible(
                    oItem.Box
                  );
                  oItem.OrderReturn = ProduitFormatter.getReturnOrderNumber(
                    oItem.isReturnable,
                    oItem.ReturnNo,
                    oItem.OrderNo
                  );
                });

                // Aggiunta dei dati delle Palette e dei Box al modello
                oData.Palettes = [
                  { Name: "Pallette_1" },
                  { Name: "Pallette_2" },
                  { Name: "Pallette_3" },
                ];
                oData.Boxes = [
                  { Name: "Box_1" },
                  { Name: "Box_2" },
                  { Name: "Box_3" },
                  { Name: "Box_4" },
                ];

                // Assegna i dati trasformati al modello
                oModel.setData(oData);
                this.getView().setModel(oModel, "modelName");

                console.log(
                  "Modello 'modelName' assegnato con dati pre-elaborati:",
                  oModel.getData()
                );
              } else {
                console.error("Errore nel caricamento di model/data.json");
              }
            }.bind(this)
          );
        },

        onNavBack: function () {
          var oHistory = History.getInstance();
          var sPreviousHash = oHistory.getPreviousHash();
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("BP-RechercheProduit", {}, true);
          }
        },

        onRefresh: function () {
          MessageToast.show("Dati ricaricati!");
        },

        onOpenModal: function (oEvent) {
          var oView = this.getView();

          // Controlla se il Dialog esiste già
          if (!this.oDialog) {
            this.oDialog = oView.byId("idPaletteBoxDialog");
          }

          // Se il Dialog non esiste, lo crea dinamicamente
          if (!this.oDialog) {
            this.oDialog = sap.ui.xmlfragment(
              oView.getId(),
              "logistic-flow.view.PaletteBoxDialog",
              this
            );
            oView.addDependent(this.oDialog);
          }

          // Apri il Dialog
          this.oDialog.open();
        },

        onDialogConfirm: function () {
          MessageToast.show("Elemento selezionato!");
          this.oDialog.close();
        },

        onCloseDialog: function () {
          this.oDialog.close();
        },
      }
    );
  }
);
