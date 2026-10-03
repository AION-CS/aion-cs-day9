import type { MaterialId } from "@/data/materialIndex";
import type { Video } from "@/components/materi/kit";

/**
 * Embedded videos (CLAUDE.md #33): a card gets one only where a credible video with a named channel or speaker really explains the
 * same idea, checked for uploader, length, embeddability and captions. A card without a video is never a defect. The video supplements
 * the card; the card's own text and rules stay sufficient without it.
 */
export const VIDEOS: Partial<Record<MaterialId, Video>> = {};
