/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (cursor: number) => ({
        url: `/user?take=40&cursor=${cursor}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUserById: builder.query({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    deleteUserById: builder.mutation({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),
    updateUser: builder.mutation({
      query: (user: TUpdateUser) => ({
        url: `/user`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["user"],
    }),
    getUserByIdMut: builder.mutation({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
    getUserFriends: builder.query({
      query: (id: string) => ({
        url: `/user/friends/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByIdMutMutation,
  useDeleteUserByIdMutation,
  useUpdateUserMutation,
  useGetUserFriendsQuery,
} = userApiSlice;
