/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

const channelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserChannels: builder.query({
      query: (user_id: string) => ({
        url: `/channel/userchannel/${user_id}`,
        method: "GET",
      }),
    }),
    verifyUserInChannel: builder.query({
      query: ({
        channel_id,
        user_id,
      }: {
        channel_id: string;
        user_id: string;
      }) => ({
        url: `/channel/verifyuser/${channel_id}/${user_id}`,
        method: "GET",
      }),
    }),
    getChannelMessages: builder.mutation({
      query: ({
        channelId,
        cursor,
      }: {
        channelId: string;
        cursor?: number | null;
      }) => ({
        url: `/channel/messages/${channelId}?take=100${
          cursor ? `&cursor=${cursor}` : ""
        }`,
        method: "GET",
      }),
    }),
    getChannel: builder.query({
      query: (channelId: string) => ({
        url: `/channel/${channelId}`,
        method: "GET",
      }),
    }),
    getUserGroups: builder.query({
      query: (user_id: string) => ({
        url: `/channel/usergroup/${user_id}`,
        method: "GET",
      }),
    }),

    getMembersChannel: builder.mutation({
      query: (members: { user_id: string }[]) => ({
        url: `/channel/memberschannel`,
        method: "POST",
        body: { members },
      }),
    }),
  }),
});

export const {
  useGetUserChannelsQuery,
  useVerifyUserInChannelQuery,
  useGetChannelMessagesMutation,
  useGetChannelQuery,
  useGetUserGroupsQuery,
  useGetMembersChannelMutation,
} = channelApiSlice;
