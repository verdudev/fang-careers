import styled from "@emotion/styled";
import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import { Job } from "../../../models/job";
import { JobsContext } from "../jobs-context";
import JobCard from "./job-card";

const StyledJobList = styled.div`
  width: 100%;
	display: flex;
	flex-direction: column;
`;

export default function JobList() {
  const { jobs, filteredJobs, setFilteredJobs, tagsFilter, title } = useContext(JobsContext);
  const [infiniteJobs, setInfiniteJobs] = useState([] as Job[]);

  useEffect(() => {
    let newJobs: Job[] = jobs;

    if (tagsFilter.length) {
      newJobs = newJobs.filter(job => {
        for (const tag of tagsFilter) {
          if (!job.tags.find(jobTag => jobTag.value === tag.value)) {
            return false;
          }
        }

        return true;
      });
    }

    if (title) {
      newJobs = newJobs.filter(job => {
        return job.title.toLowerCase().includes(title.toLowerCase());
      });
    }

    setFilteredJobs(newJobs);
    setInfiniteJobs(newJobs.slice(0, 20));
  }, [tagsFilter, title]);

  function nextJobs() {
    setInfiniteJobs(filteredJobs.slice(0, infiniteJobs.length + 20));
  }

  return (
    <StyledJobList>
      <InfiniteScroll
        pageStart={0}
        loadMore={nextJobs}
        hasMore={infiniteJobs.length < filteredJobs.length}
      >
        {infiniteJobs.map(job => <JobCard key={job.hash} job={job} />)}
      </InfiniteScroll>
    </StyledJobList>
  );
}