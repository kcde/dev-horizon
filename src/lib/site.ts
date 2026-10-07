export const SITE_NAME = "DevHorizon 26";

export const SITE_DESCRIPTION =
  "A three-day conference for engineers who build the interfaces humans use every day.";

// Vercel sets this on every deployment; it's the production domain even on previews,
// so shared links never point at a preview URL.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = new URL(
  productionHost ? `https://${productionHost}` : "http://localhost:3000",
);
