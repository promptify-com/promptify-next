import React, { PropsWithChildren, useEffect } from "react";
import { useGetCurrentUser } from "../hooks/api/user";
import useSetUser from "../hooks/useSetUser";
import { PageLoading } from "./PageLoading";
import { useRouter } from "next/router";

interface IProps extends PropsWithChildren {
  showLoadingPage?: boolean;
}

const Protected: React.FC<IProps> = ({ children, showLoadingPage }) => {
  const router = useRouter();
  const [user, error, isLoading] = useGetCurrentUser();
  const setUser = useSetUser();

  useEffect(() => {
    if (!isLoading && user) {
      setUser(user);
    }

    // if (!user && !isLoading) {
    //   navigate('/');
    // }
  }, [user, isLoading, error, router]);

  return <>{showLoadingPage && isLoading ? <PageLoading /> : children}</>;
};

export default Protected;
