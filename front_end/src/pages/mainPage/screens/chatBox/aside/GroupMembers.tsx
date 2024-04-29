import MemberCard from "./MemberCard";
import AddMember from "./AddMember";
import LeaveGroup from "./LeaveGroup";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
type Props = {
  channel: TChannelData;
};
export default function GroupMembers({ channel }: Props) {
  const [members, setMembers] = useState<TChannelMemberData[]>([]);
  const [adminId, setAdminId] = useState("");
  const { user_id } = useAppSelector(getCurrentUser);

  useEffect(() => {
    if (members[0].channel_id === channel?.channel_id) return;
    setMembers(channel?.members);
    const getAdmin = channel.members.filter((m) => !m.is_deleted && m.is_admin);
    if (getAdmin.length >= 1) {
      setAdminId(getAdmin[0].user_id);
    }
  }, [channel, members]);

  useEffect(() => {
    socket.on("add_member", (res: { data: TChannelData }) => {
      if (res?.data) {
        if (res?.data?.channel_id !== channel?.channel_id) return;
        const newMembers = res.data?.members;
        const filterMembers = newMembers.filter((member) => !member.is_deleted);
        setMembers(filterMembers);
      }
    });

    socket.on("remove_member", (res: { data: TChannelData }) => {
      if (res?.data) {
        if (res?.data?.channel_id !== channel?.channel_id) return;
        // remove member
        const newNembers = res.data?.members;
        const membersNotRemoved = newNembers.filter((m) => !m.is_deleted);
        setMembers(membersNotRemoved);
      }
    });

    return () => {
      socket.off("add_member");
      socket.off("remove_member");
    };
  }, [channel?.channel_id]);

  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full gap-2 p-2 bg-background">
      {!channel?.is_private ? (
        <div className="flex items-center justify-between pt-2 pb-4 border-b">
          {adminId === user_id ? (
            <AddMember
              channelId={channel?.channel_id}
              groupName={channel?.group_name as string}
            />
          ) : (
            <span />
          )}
          <LeaveGroup
            channelId={channel?.channel_id}
            groupName={channel?.group_name as string}
          />
        </div>
      ) : null}
      <div className="w-full h-[95%] overflow-auto">
        <ul className="flex flex-col w-full pb-5 h-fit">
          {members?.length >= 1
            ? members.map((member) => {
                return (
                  <MemberCard
                    key={member.user_id}
                    channelId={channel?.channel_id}
                    groupName={channel?.group_name as string}
                    isPrivate={channel?.is_private}
                    userId={member.user_id}
                    adminId={adminId}
                  />
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
}
