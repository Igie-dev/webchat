import { useGetChannelMessagesQuery } from "@/service/slices/channel/channelApiSlice";
// import { useState } from "react";
import { useParams } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import MessageCard from "./MessageCard";
import { MessageSquare } from "lucide-react";
export default function MessageList() {
  const { channelId } = useParams();
  // const [cursor, setCursor] = useState("");
  const { data, isFetching, isError } = useGetChannelMessagesQuery({
    channelId: channelId as string,
  });
  return (
    <div className="w-full h-[80%] overflow-auto ">
      <ul className="flex flex-col w-full gap-5 px-4 py-2 pb-20 h-fit">
        {isFetching ? (
          <LoaderSpinner />
        ) : data?.messages?.length >= 1 && !isError ? (
          data.messages.map((message: TMessageData) => {
            return <MessageCard key={message.message_id} message={message} />;
          })
        ) : (
          <div className="flex flex-col items-center w-full gap-2 pt-10">
            <MessageSquare size={40} className="opacity-70" />
            <p className="text-sm font-semibold opacity-70">Empty chat</p>
          </div>
        )}
      </ul>
    </div>
  );
}
