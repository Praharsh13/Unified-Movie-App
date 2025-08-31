import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constant.js";

export const userApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/signin`,
                method:'POST',
                body:data
            })
        }),
        register:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/`,
                method:'POST',
                body:data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
              url: `${USERS_URL}/signout`,
              method: "POST",
             
            }),
          }),

          profile: builder.mutation({
            query: (data) => ({
              url: "https://unified-movie-app.onrender.com/movieapp/users/userprofile",
              method: "POST",
              body: data,
              credentials: 'include'
            }),
          }),

          getUsers: builder.query({
            query: () => ({
              url: USERS_URL,
            }),
          }),  
    })    
})


export const {useLoginMutation,useRegisterMutation,useLogoutMutation,useProfileMutation,useGetUsersQuery}=userApiSlice;