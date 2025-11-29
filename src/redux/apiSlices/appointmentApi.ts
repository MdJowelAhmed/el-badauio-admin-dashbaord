import { api } from "../api/baseApi";

const appointmentSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllAppointments: builder.query({
      query: (args) => {
        const params: Record<string, string> = {};
        
        if(args){
          args.forEach((arg: { name: string; value: string }) => {
            params[arg.name] = arg.value;
          });
        }

        const token = localStorage.getItem("token");
        
        return {
          url: `/admin/appointments`,
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
          params
        };
      },
  
    }),
  }),
});

export const { useGetAllAppointmentsQuery } = appointmentSlice;