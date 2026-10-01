import type { SchemaTypeDefinition } from "sanity";

import { dayType } from "./day";
import { siteSettingsType } from "./siteSettings";
import { speakerType } from "./speaker";
import { talkType } from "./talk";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettingsType,
  speakerType,
  talkType,
  dayType,
];

export const SINGLETON_TYPES = new Set<string>([siteSettingsType.name]);
