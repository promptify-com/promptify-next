import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { PageLoading } from "./PageLoading";
import { useRouter } from "next/router";
import { isAdminFn, isValidUserFn, updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { userApi } from "@/core/api/user";
import { getToken } from "@/common/utils";

interface IProps extends PropsWithChildren {
  showLoadingPage?: boolean;
}

const protectedRoutes = ["profile", "sparks", "deployments"];
const adminOnlyRoutes = ["deployments"];

const Protected: React.FC<IProps> = ({ children, showLoadingPage }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [_, currentPathName] = router.pathname.split("/");
  const isValidUser = useAppSelector(isValidUserFn);
  const isAdmin = useAppSelector(isAdminFn);
  const currentUser = useAppSelector(state => state.user.currentUser);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let timeoutIdAdmin: NodeJS.Timeout;
    const _updateUser = async () => {
      if (currentUser?.preferences) {
        return;
      }

      const storedToken = getToken();
      const payload = await dispatch(userApi.endpoints.getCurrentUser.initiate(storedToken));

      if (!payload.data) {
        return;
      }

      dispatch(updateUser(payload.data));
    };

    _updateUser();

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

  const shouldShowLoading = showLoadingPage || !isValidUser || (!isAdmin && adminOnlyRoutes.includes(currentPathName));

  return <>{shouldShowLoading ? <PageLoading /> : children}</>;
};

export default Protected;
