import { BlogResponse, EventResponse,SectorResponse,WritableRecentJobResponse, DiscussionResponse } from "@/types/index";

import { hirelabApiSlice } from "@/rtk/base-query";
import { queries } from "./global.api";

const hirelabEnhancedSlice = hirelabApiSlice.enhanceEndpoints({
  addTagTypes: ["Blogs", "Events",'Sector','RecentJobs',"Discussions",],
});

const globalApi = hirelabEnhancedSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogsData: builder.query<BlogResponse, string>({
      query: queries.getBlogs.query,
      providesTags: ["Blogs"],
    }),
    getBlogsDataById: builder.query<BlogResponse, string>({
      query: (id) => queries.getBlogsById.query(id),
      providesTags: ["Blogs"],
    }),
    getEvents: builder.query<EventResponse, void>({
      query: queries.getEvents.query,
      providesTags: ["Events"],
    }),
    getSector : builder.query<SectorResponse, void>({
      query:queries.getSector.query,
      providesTags: ["Sector"],
    }),
    getRecentJobs :builder.query<WritableRecentJobResponse,void>({
      query: queries.getRecentJobs.query,
      providesTags: ["RecentJobs"],
    }),
    getDiscussions: builder.query<DiscussionResponse, void>({
      query: queries.getDiscussions.query,
      providesTags: ["Discussions"],
    }),
 
  }),
  
  overrideExisting: true,
});

export const {
  useGetBlogsDataQuery,
  useGetBlogsDataByIdQuery,
  useGetEventsQuery,
  useGetSectorQuery,
  useGetRecentJobsQuery,
  useGetDiscussionsQuery
} = globalApi;
export default globalApi;
