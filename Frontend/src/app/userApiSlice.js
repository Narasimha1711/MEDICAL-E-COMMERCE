import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userDetails: builder.query({
        query: () => '/user-info'
      
    }),
    userLogout: builder.query({
      query: () => '/logout'
    }),
    userUpdate: builder.mutation({
      query: (item) => ({
          method: 'PUT',
          url: '/userUpdatedetails',
          body: item
      })
    }),

  }),
});

export const { useUserDetailsQuery, useLazyUserLogoutQuery, useUserUpdateMutation } = userApiSlice;
