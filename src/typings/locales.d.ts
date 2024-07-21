/**
 * @file Locale types
 * @description Pulls strings from the default locale file and generates typings
 * @typedef locales
 */

import * as defaultLocaleFile from "../locales/en-GB.json";
const en = defaultLocaleFile.default;

type HibikiLocaleStrings =
  | "NAME"
  | `github.${keyof typeof en.github}`
  | `general.${keyof typeof en.general}`
  | `global.${keyof typeof en.global}`

// Type for getLocaleFunction()
type getString = {
  (string: HibikiLocaleStrings, args?: Record<string, any>): string;
};
