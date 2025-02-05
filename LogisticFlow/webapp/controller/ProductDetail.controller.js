sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("logistic-flow.controller.ProductDetail", {
        
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ProductDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            // Ottieni l'ID del prodotto dalla route
            var productId = oEvent.getParameter("arguments").productId;

            // Recupera i dati dal modello principale
            var oModel = this.getView().getModel();
            var productData = oModel.getData().Products.find(function (product) {
                return product.ProductID === parseInt(productId, 10);
            });

            // Se il prodotto viene trovato, setta il modello per la vista di dettaglio
            if (productData) {
                this.getView().setModel(new JSONModel(productData));
            }
        }
    });
});