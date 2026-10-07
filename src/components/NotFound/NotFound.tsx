import { Button } from "@/components/Button/Button";
import { PhotoParticles } from "@/components/PhotoParticles/PhotoParticles";
import { sanityFetch } from "@/sanity/fetch";
import { urlFor } from "@/sanity/image";
import { SPEAKER_PHOTOS_QUERY } from "@/sanity/queries";

import styles from "./NotFound.module.css";

/** 404 content: a "404" made of speaker photos that scatter from the pointer. */
export async function NotFound() {
  const speakers = await sanityFetch({
    query: SPEAKER_PHOTOS_QUERY,
    tags: ["speaker"],
  });
  const photoUrls = speakers.map((speaker) =>
    urlFor(speaker.photo!)
      .width(96)
      .height(96)
      .fit("crop")
      .auto("format")
      .url(),
  );

  return (
    <div className={styles.page}>
      <PhotoParticles text="404" photoUrls={photoUrls} />
      <h1 className={`text-preset-2 ${styles.title}`}>
        <span className="visually-hidden">404: </span>
        Seems you&apos;ve wandered off.
      </h1>
      <div className={styles.actions}>
        <Button href="/" arrow>
          Back to Home
        </Button>
        <Button href="/schedule" arrow>
          View the schedule
        </Button>
      </div>
    </div>
  );
}
