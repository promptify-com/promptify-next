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

  const pathname = router.pathname;
  const splittedPath = pathname.split("/");

  console.log(splittedPath);

  useEffect(() => {
    if (!isLoading && user) {
      setUser(user);
    }

    if (!user && !isLoading) {
      if (splittedPath[1] === "profile" || splittedPath[1] === "sparks") {
        router.push("/");
      }
    }
  }, [user, isLoading, error, router]);

  return <>{showLoadingPage && isLoading ? <PageLoading /> : children}</>;
};

export default Protected;
