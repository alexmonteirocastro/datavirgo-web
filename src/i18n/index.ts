import en from "./en.json";

export const defaultLocale = "en";

type Flatten<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : Flatten<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

/** Every key in en.json, as a dotted path. A wrong key is a type error in `pnpm check`. */
export type MessageKey = Flatten<typeof en>;

// Every <locale>.json in this folder is a catalogue, so adding a language needs no code change.
const modules = import.meta.glob<Record<string, unknown>>("./*.json", {
  eager: true,
  import: "default",
});

const catalogs: Record<string, Record<string, unknown>> = {};
for (const [path, messages] of Object.entries(modules)) {
  const locale = path.replace("./", "").replace(".json", "");
  catalogs[locale] = messages;
}

/** The locales that have a catalogue. */
export const locales = Object.keys(catalogs);

/** Look up a string. A missing key throws, so `astro build` fails: there is no silent fallback. */
export function t(key: MessageKey, locale: string = defaultLocale): string {
  let value: unknown = catalogs[locale];
  for (const part of key.split(".")) {
    value = (value as Record<string, unknown> | undefined)?.[part];
  }
  if (typeof value !== "string") {
    throw new Error(`Missing i18n key "${key}" for locale "${locale}"`);
  }
  return value;
}
