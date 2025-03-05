import { apiSlice } from './apiSlice';

export const addCartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
        query: (item) => ({
            method: 'POST',
            body: item,
            url: '/addToCart'
        })
      
    }),
    checkoutCart: builder.mutation({
        query: (item) => ({
            method: 'POST',
            url: '/bookAllCart',
            body: item
        })
      
    }),
    getCartItems: builder.query({
        query: () => '/addToCart'
    }),

    deleteCartItem: builder.mutation({
        query: (item) => ({
            method: 'POST',
            url: '/deleteCartItem',
            body: item
        })
      }),

    getUserCurrentOrders: builder.query({
        query: () => '/userCurrentOrders'
    }),
    getUserPastOrders: builder.query({
        query: () => '/userPastOrders'
    }),
    userHomeCurrentOrders: builder.query({
        query: () => '/userHomeCurrentOrders'
    }),

    userHomeTopDeals: builder.query({
        query: () => '/topDeals'
    }),

    // userUpdate: builder.mutation({
    //     query: (item) => ({
    //         method: 'PUT',
    //         url: '/userUpdatedetails',
    //         body: item
    //     })
    //   }),
    
   
  
  }),
});

export const { useAddToCartMutation, useCheckoutCartMutation, useGetCartItemsQuery, useDeleteCartItemMutation, useGetUserCurrentOrdersQuery, useGetUserPastOrdersQuery, useUserHomeCurrentOrdersQuery, useUserHomeTopDealsQuery } = addCartApiSlice;
