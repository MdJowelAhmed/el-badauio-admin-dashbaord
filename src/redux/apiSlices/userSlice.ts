import { api } from "../api/baseApi";

const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if(args) {
           args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: "/admin/users",
          params,
        };
      },
    }),
    userStatusUpdate: builder.mutation({
      query: ({id, status}) => {
        return {
          method: "PATCH",
          url: "/user",
          body: {id, status},
        };
      },
    }),
    createArtisans: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/admin/artisan",
          body: data,
        };
      },
    }),
    userById: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/user/profile/${id}`,
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUserStatusUpdateMutation,
  useCreateArtisansMutation,
  useUserByIdQuery,
} = userSlice;