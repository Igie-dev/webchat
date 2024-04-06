import { useRef } from "react";
import ChatboxAside from "./aside/ChatboxAside";
import ChatBox from "./chatbox/ChatBox";
export default function ChatBoxContainer() {
  const asideRef = useRef<HTMLDivElement | null>(null);
  const handleAside = () => {
    if (asideRef?.current?.classList.contains("translate-x-full")) {
      asideRef?.current?.classList.remove("translate-x-full");
    } else {
      asideRef?.current?.classList.add("translate-x-full");
    }
  };
  return (
    <section className="flex items-center w-full h-full gap-2 p-2 md:p-5">
      <div className="relative flex items-center w-full h-full gap-2 overflow-hidden border rounded-lg">
        <ChatBox handleAside={handleAside} />
        <ChatboxAside asideRef={asideRef} handleAside={handleAside} />
      </div>
    </section>
  );
}