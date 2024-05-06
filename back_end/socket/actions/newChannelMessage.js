import prisma from "../../utils/prisma.js";
import { v4 as uuid } from "uuid";
const newChannelMessage = ({ channel_id, sender_id, message, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!channel_id || !message || !sender_id || !type) {
        return reject({ error: "All field are required!" });
      }
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id },
      });

      if (!foundChannel?.id) {
        return reject({ error: "Channel not found" });
      }

      const saveMessage = await prisma.message.create({
        data: {
          message_id: uuid(),
          channel_id,
          message,
          type,
          sender_id,
        },
      });
      if (!saveMessage?.id) {
        return reject({ error: "Failed to save message!" });
      }

      const foundChannelMember = await prisma.userChannelMember.findMany({
        where: {
          channel_id,
        },
      });

      if (foundChannelMember?.length >= 1) {
        for await (const member of foundChannelMember) {
          await prisma.userChannelMember.update({
            where: {
              id: member.id,
            },
            data: {
              is_seen: member.user_id === sender_id,
            },
          });
        }
      }

      const channel = await prisma.channel.findUnique({
        where: { channel_id: saveMessage.channel_id },
        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            include: {
              channel: {
                include: {
                  members: {
                    where: {
                      is_deleted: false,
                    },
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          members: {
            where: {
              is_deleted: false,
            },
            include: {
              user: true,
            },
          },
        },
      });

      if (!channel?.id) {
        throw new Error("Something went wrong!");
      }
      return resolve({ data: channel });
    } catch (error) {
      return reject({ error: "Something went wrong!" });
    }
  });
};

export default newChannelMessage;
