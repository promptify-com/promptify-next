import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { PageLoading } from "./PageLoading";
import { useRouter } from "next/router";
import { isAdminFn, isValidUserFn } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
interface IProps extends PropsWithChildren {
  showLoadingPage?: boolean;
}

const protectedRoutes = ["profile", "sparks", "deployments"];
const adminOnlyRoutes = ["deployments"];

const Protected: React.FC<IProps> = ({ children, showLoadingPage }) => {
  const router = useRouter();
  const [_, currentPathName] = router.pathname.split("/");
  const isValidUser = useSelector(isValidUserFn);
  const isAdmin = useSelector(isAdminFn);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let timeoutIdAdmin: NodeJS.Timeout;

    if (!isValidUser && protectedRoutes.includes(currentPathName)) {
      timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        redirectToPath("/");
      }, 800);
    }

    if (!isAdmin && adminOnlyRoutes.includes(currentPathName)) {
      timeoutIdAdmin = setTimeout(() => {
        clearTimeout(timeoutIdAdmin);
        redirectToPath("/");
      }, 800);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutIdAdmin);
    };
  }, [isValidUser, isAdmin, currentPathName]);

  return <>{showLoadingPage || !isValidUser || !isAdmin ? <PageLoading /> : children}</>;
};

export default Protected;
