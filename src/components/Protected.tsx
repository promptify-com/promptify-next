import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from 'react-redux';
import { PageLoading } from "./PageLoading";
import { useRouter } from "next/router";
import { isValidUserFn } from '@/core/store/userSlice';

interface IProps extends PropsWithChildren {
  showLoadingPage?: boolean;
}

const protectedRoutes = ["profile", "sparks"]

const Protected: React.FC<IProps> = ({ children, showLoadingPage }) => {
  const router = useRouter();
  const [_, currentPathName] = router.pathname.split("/");
  const isValidUser = useSelector(isValidUserFn);

  useEffect(() => {
    if (!isValidUser && protectedRoutes.includes(currentPathName)) {
      router.push("/");
    }
  }, [isValidUser, currentPathName]);

  return <>{showLoadingPage ? <PageLoading /> : children}</>;
};

export default Protected;
