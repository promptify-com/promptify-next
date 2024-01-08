import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { PageLoading } from "./PageLoading";
import { useRouter } from "next/router";
import { isValidUserFn } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import { useAppSelector } from "@/hooks/useStore";

interface IProps extends PropsWithChildren {
  showLoadingPage?: boolean;
}

const protectedRoutes = ["profile", "sparks", "deployments"];
const adminOnlyRoutes = ["deployments"];

const Protected: React.FC<IProps> = ({ children, showLoadingPage }) => {
  const router = useRouter();
  const [_, currentPathName] = router.pathname.split("/");
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useAppSelector(state => state.user.currentUser);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isValidUser && protectedRoutes.includes(currentPathName)) {
      timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        redirectToPath("/");
      }, 800);
    }

    if (!currentUser?.is_admin && adminOnlyRoutes.includes(currentPathName)) {
      redirectToPath("/");
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isValidUser, currentPathName]);

  return <>{showLoadingPage || !isValidUser ? <PageLoading /> : children}</>;
};

export default Protected;
