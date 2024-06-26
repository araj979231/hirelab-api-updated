// src/modules/register/store/register.query.ts
import { hirelabApiSlice } from '@/rtk/base-query';
import { queries } from './register.api';
import { RegisterArgs, RegisterResponse } from '../types';

const hirelabEnhancedSlice = hirelabApiSlice.enhanceEndpoints({
  addTagTypes: ['Register'],
});

const registerApiSlice = hirelabEnhancedSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterArgs>({
      query: (credentials) => queries.register.query(credentials),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('register', data);
        } catch (error) {
          console.error('register failed:', error);
        }
      },
      invalidatesTags: ['Register'],
    }),
  }),
});

export const { useRegisterMutation } = registerApiSlice;
export default registerApiSlice;
