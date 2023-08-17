import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { PageLoading } from "./PageLoading";
import { useRouter } from "next/router";
import { isValidUserFn } from "@/core/store/userSlice";

interface IProps extends PropsWithChildren {
  showLoadingPage?: boolean;
}

const protectedRoutes = ["profile", "sparks"];

const Protected: React.FC<IProps> = ({ children, showLoadingPage }) => {
  const router = useRouter();
  const [_, currentPathName] = router.pathname.split("/");
  const isValidUser = useSelector(isValidUserFn);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isValidUser && protectedRoutes.includes(currentPathName)) {
      timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        router.push("/");
      }, 800);
    }

    return () => {
      clearTimeout(timeoutId);
    }
  }, [isValidUser, currentPathName]);

  return <>{showLoadingPage || !isValidUser ? <PageLoading /> : children}</>;
};

export default Protected;
