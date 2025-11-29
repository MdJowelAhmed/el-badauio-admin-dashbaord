import { api } from "../api/baseApi";

const ourProjectsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOurProjects: builder.query({
      query: (args) => {
        const params: Record<string, string> = {};

        if (args) {
          args.forEach((arg: { name: string; value: string }) => {
            params[arg.name] = arg.value;
          });
        }

        const token = localStorage.getItem("token");

        return {
          url: `/previousproject`,
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
          params,
        };
      },
    }),

    createPreviousProject: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          url: `/previousproject`,
          method: "POST",
          body: data,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
    updatePreviousProject: builder.mutation({
      query: ({ id, ...data }) => {
        const token = localStorage.getItem("token");
        return {
          url: `/previousproject/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
    deletePreviousProject: builder.mutation({
      query: (id) => {
        const token = localStorage.getItem("token");
        return {
          url: `/previousproject/${id}`,
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllOurProjectsQuery,
  useCreatePreviousProjectMutation,
  useUpdatePreviousProjectMutation,
  useDeletePreviousProjectMutation,
} = ourProjectsSlice;
