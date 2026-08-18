// Server component with ISR: the talent list is re-sanitized against
// Coconut Hub every hour. Hired VAs become blurred "recently hired"
// cards automatically; on-trial VAs drop off.
//
// Vanity URLs per podcast (candidates.coconutva.com/showname) are
// rewritten to /?src=showname by middleware.ts — no bracket folders,
// which survive Windows unzips and GitHub web uploads.

import { cookies } from "next/headers";
import { UNLOCK_VERSION } from "@/lib/unlockVersion";
import Showcase from "@/components/Showcase";
import { getAvailableTalents } from "@/lib/sanitize";
import { toPublicTalent } from "@/data/talents";

export const revalidate = 3600;

const FREE_PROFILES = 3;

export default async function Page({
  searchParams,
}: {
  searchParams: { src?: string };
}) {
  const { talents } = await getAvailableTalents();
  const publicTalents = talents.map(toPublicTalent);
  const source = (searchParams.src ?? "").slice(0, 60);
  const alreadyUnlocked = cookies().get("cva_tt_unlocked")?.value === UNLOCK_VERSION;

  return (
    <Showcase
      talents={publicTalents}
      freeCount={FREE_PROFILES}
      source={source}
      initiallyUnlocked={alreadyUnlocked}
    />
  );
}
