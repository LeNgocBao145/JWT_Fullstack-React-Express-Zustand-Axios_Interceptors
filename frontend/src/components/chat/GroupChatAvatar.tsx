import type { Participant } from "@/types/Chat.js";
import UserAvatar from "./UserAvatar.js";
import { Ellipsis } from "lucide-react";

interface GroupChatAvatarProps {
  participants: Participant[];
  type: "sidebar" | "chat";
}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
  const avatars = [];
  const limit = Math.min(participants.length, 4);

  for (let i = 0; i < limit; i++) {
    const member = participants[i];
    avatars.push(
      <UserAvatar
        key={member._id}
        type={type}
        name={member.displayName}
        avatarUrl={member.avatarUrl ?? undefined}
      />
    );
  }

  return (
    // *:data-[slot=avatar]:ring-2 explanation:
    // - Selects any element (*) that has the attribute data-slot="avatar"
    // - Applies the Tailwind utility ring-2
    // - The attribute data-slot="avatar" comes from UI component avatar in shadcn/ui,
    //   where internal component parts (slots) are tagged with data-slot attributes.

    <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background">
      {avatars}

      {/* If avatars > 4 then render ... */}
      {participants.length > limit && (
        <div
          className="flex z-10 items-center justify-center bg-muted size-8 rounded-full
        ring-2 ring-background text-muted-foreground"
        >
          <Ellipsis className="size-4" />
        </div>
      )}
    </div>
  );
};

export default GroupChatAvatar;
