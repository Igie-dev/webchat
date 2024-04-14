import { Input } from "@/components/ui/input";
import ChannelCard from "./channelCard/ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Library } from "lucide-react";
import { useGetUserChannelsQuery } from "@/service/slices/channel/channelApiSlice";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { socket } from "@/socket";
type Props = {
  handleAside: () => void;
};
export default function ChannelList({ handleAside }: Props) {
  const [channels, setChannels] = useState<TChannelData[]>([]);
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserChannelsQuery(user_id);

  useEffect(() => {
    if (data?.length >= 1) {
      setChannels(data);
    }
  }, [data]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("new_channel_message", (res) => {
      if (res?.data) {
        const updatedChannels = channels.map((c) => {
          if (c.channel_id === res.data?.channel_id) {
            // Create a new array with the updated message
            const updatedMessages = [res.data];
            // Update the channel with the new messages array
            return { ...c, messages: updatedMessages };
          }
          return c;
        });

        const channelLatestMessage = updatedChannels.filter(
          (c) => c.channel_id === res.data?.channel_id
        );
        const channelsOldMessage = updatedChannels.filter(
          (c) => c.channel_id !== res.data?.channel_id
        );

        setChannels([...channelLatestMessage, ...channelsOldMessage]);
      }
    });

    return () => {
      socket.off("new_channel_message");
    };
  }, [channels]);
  return (
    <div onClick={handleAside} className="flex flex-col h-[87%] w-full gap-2 ">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-sm font-semibold">Chat</h1>
        <Input
          type="text"
          placeholder="Search..."
          className="bg-primary-foreground h-11"
        />
      </header>
      <ul className="flex flex-col w-full h-[92%] overflow-y-auto py-2 px-0">
        {isFetching ? (
          <li className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit border-border/70">
            <div className="overflow-hidden rounded-full w-11 h-11">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex flex-col w-[80%] h-full justify-center gap-2">
              <div className="w-full h-6">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="flex-1 w-full">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          </li>
        ) : channels?.length >= 1 && !isError ? (
          channels.map((c: TChannelData) => {
            return <ChannelCard key={Math.random()} channel={c} />;
          })
        ) : (
          <div className="flex flex-col items-center w-full mt-5">
            <Library size={30} className="opacity-70" />
            <p className="text-sm font-semibold opacity-70">Empty</p>
          </div>
        )}
      </ul>
    </div>
  );
}
