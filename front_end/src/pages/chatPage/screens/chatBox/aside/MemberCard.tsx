import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
import { User, X } from "lucide-react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import LeaveGroup from "./LeaveGroup";
import { useNavigate } from "react-router-dom";
type Props = {
  userId: string;
  channelId: string;
  channelAvatarId: string;
  groupName: string;
  isPrivate: boolean;
  adminId: string;
};
export default function MemberCard({
  userId,
  channelId,
  groupName,
  isPrivate,
  adminId,
  channelAvatarId,
}: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserByIdQuery(userId);
  const navigate = useNavigate();

  if (isError) return null;
  return isFetching ? (
    <li className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit">
      <div className="overflow-hidden rounded-full w-11 h-11">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col w-[80%] h-full justify-center gap-2">
        <div className="w-full h-3">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </li>
  ) : (
    <li
      className={`group relative flex items-center w-full justify-between gap-1 p-2 bg-transparent  rounded-md cursor-pointer h-fit  hover:bg-secondary/50 ${
        isFetching ? "hover:cursor-wait" : "hover:cursor-pointer"
      }`}
    >
      <div className="flex items-center flex-1 h-full gap-2">
        <div className="w-8 h-8">
          <DisplayAvatar id={data?.avatar_id as string} />
        </div>
        <div className="items-start w-[75%]  flex flex-col">
          <p className="w-full max-w-full text-xs truncate max-h-6">
            {data?.first_name + " " + data?.last_name}
          </p>
          <p className="text-muted-foreground text-[10px]">
            {adminId === userId && !isPrivate ? "Admin" : ""}
          </p>
        </div>
      </div>
      {data?.user_id !== user_id ? (
        <Button
          size="icon"
          title="Profile"
          variant="ghost"
          onClick={() => navigate(`/profile/${data?.user_id}`)}
          className="opacity-50 hover:opacity-100"
        >
          <User size={20} />
        </Button>
      ) : null}
      {adminId === user_id && adminId !== userId ? (
        <LeaveGroup
          userId={userId}
          channelId={channelId}
          groupName={groupName}
          cardDescription=" Are you sure you want to remove this user?"
          cardTitle="Remove user"
          firstName={data?.first_name}
          lastName={data?.last_name}
          channelAvatarId={channelAvatarId}
          type="remove"
          userAvatarId={data?.avatar_id as string}
        >
          <Button
            size="icon"
            title="Remove"
            variant="ghost"
            className="opacity-50 hover:opacity-100"
          >
            <X size={20} />
          </Button>
        </LeaveGroup>
      ) : null}
    </li>
  );
}
