import type { StructureResolver } from "sanity/structure";

export const SITE_SETTINGS_ID = "siteSettings";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id(SITE_SETTINGS_ID)
        .child(
          S.document().schemaType("siteSettings").documentId(SITE_SETTINGS_ID),
        ),
      S.divider(),
      S.documentTypeListItem("speaker").title("Speakers"),
      S.documentTypeListItem("talk").title("Talks"),
      S.documentTypeListItem("day").title("Days"),
    ]);
