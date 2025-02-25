sap.ui.define([], function () {
  "use strict";

  return {
    // Mostra il testo solo se il valore, dopo trim, NON è vuoto
    isValueVisible: function (sValue) {
      var sClean = (sValue || "").trim();
      console.log(
        "isValueVisible -> [",
        sValue,
        "] dopo trim -> [",
        sClean,
        "]"
      );
      return sClean !== "";
    },

    isButtonVisible: function (sValue) {
      var sClean = (sValue || "").trim();
      console.log(
        "isButtonVisible -> [",
        sValue,
        "] dopo trim -> [",
        sClean,
        "]"
      );
      return sClean === "";
    },
    // Se isReturnable è true, ritorna ReturnNo, altrimenti OrderNo
    getReturnOrderNumber: function (bIsReturnable, sReturnNo, sOrderNo) {
      return bIsReturnable ? sReturnNo : sOrderNo;
    },
  };
});
