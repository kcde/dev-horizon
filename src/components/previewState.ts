/**
 * Lets the dev-only /design-system page show hover and focus states statically.
 * Components put this on their root as `data-preview-state`, and their CSS matches
 * it alongside :hover / :focus-visible. Never set it outside /design-system.
 */
export type PreviewState = "hover" | "focus";

export type PreviewStateProps = {
  previewState?: PreviewState;
};
