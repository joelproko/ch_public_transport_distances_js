(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.de = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Rumantsch = {
      weekdays: {
          shorthand: ["du", "gli", "ma", "me", "gie", "ve", "so"],
          longhand: [
              "dumengia",
              "glindesdi",
              "mardi",
              "mesemna",
              "gievgia",
              "venderdi",
              "sonda",
          ],
      },
      months: {
          shorthand: [
              "schan.",
              "favr.",
              "mars",
              "avr.",
              "matg",
              "zercl.",
              "fan.",
              "avust",
              "sett.",
              "oct.",
              "nov.",
              "dec.",
          ],
          longhand: [
              "schaner",
              "favrer",
              "mars",
              "avrigl",
              "matg",
              "zercladur",
              "fanadur",
              "avust",
              "settember",
              "october",
              "november",
              "december",
          ],
      },
      firstDayOfWeek: 1,
      weekAbbreviation: "emna",
      rangeSeparator: " fin ",
      scrollTitle: "scrollar per variar",
      toggleTitle: "cliccar per midar",
      time_24hr: true,
  };
  fp.l10ns.rm = Rumantsch;
  var rm = fp.l10ns;

  exports.Rumantsch = Rumantsch;
  exports.default = rm;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
