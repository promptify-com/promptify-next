// TemplatesData.tsx

import React from "react";
import { useGetTemplatesByFilterQuery, useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/executions";
import { TemplatesExecutionsByMePaginationResponse } from "@/core/api/dto/templates";
import { useSelector } from "react-redux";
import { isValidUserFn } from "@/core/store/userSlice";
import useToken from "@/hooks/useToken";
import { TemplatesSection } from "../explorer/TemplatesSection";

export const TemplatesData: React.FC = () => {
  const token = useToken();
  const isValidUser = useSelector(isValidUserFn);
  const MY_EXECUTIONS_LIMIT = 4;

  const { data: myLatestExecutions, isLoading: isMyLatestExecutionsLoading } = useGetTemplatesExecutionsByMeQuery(
    MY_EXECUTIONS_LIMIT,
    {
      skip: !isValidUser,
    },
  );

  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } = useGetTemplatesSuggestedQuery(undefined, {
    skip: !isValidUser,
  });

  const { data: popularTemplates, isLoading: isPopularTemplatesLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 7,
    },
    {
      skip: token,
    },
  );

  const { data: latestTemplates, isLoading: isLatestTemplatesLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-created_at",
      limit: 7,
    },
    {
      skip: token,
    },
  );

  return isValidUser ? (
    <>
      <TemplatesSection
        isLatestTemplates
        isLoading={isMyLatestExecutionsLoading}
        templates={(myLatestExecutions as TemplatesExecutionsByMePaginationResponse)?.results || []}
        title="Your Latest Templates:"
        type="myLatestExecutions"
      />
      <TemplatesSection
        isLoading={isSuggestedTemplateLoading}
        templates={suggestedTemplates}
        title=" You may like these prompt templates:"
        type="suggestedTemplates"
      />
    </>
  ) : (
    <>
      <TemplatesSection
        isLoading={isPopularTemplatesLoading}
        templates={popularTemplates?.results}
        title="Most Popular Prompt Templates"
        type="popularTemplates"
      />
      <TemplatesSection
        isLoading={isLatestTemplatesLoading}
        templates={latestTemplates?.results}
        title="Latest Prompt Templates"
        type="latestTemplates"
      />
    </>
  );
};
