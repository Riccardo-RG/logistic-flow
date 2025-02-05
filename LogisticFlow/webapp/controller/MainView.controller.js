sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("logistic-flow.controller.MainView", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        /**
         * Naviga alla vista BP-Preparation quando viene selezionata
         * @param {sap.ui.base.Event} oEvent - Evento di pressione sulla lista
         */
        onSelectOption: function (oEvent) {
            var sSelectedTitle = oEvent.getSource().getTitle();

            if (sSelectedTitle.includes("Préparation BP")) {
                this.oRouter.navTo("BP-Preparation");
            }
        }
    });
});