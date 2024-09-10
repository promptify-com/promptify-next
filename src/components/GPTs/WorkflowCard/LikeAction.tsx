// Mui
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { FavoriteBorderOutlined } from "@mui/icons-material";
// Store
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { useDislikeWorkflowMutation, useLikeWorkflowMutation } from "@/core/api/workflows";
//
import type { ITemplateWorkflow } from "../../Automation/types";
// Components

interface Props {
  workflow: ITemplateWorkflow;
}

function WorkflowCardLike({ workflow }: Props) {
  const dispatch = useAppDispatch();
  // Destuctions
  const _id = workflow.id;
  const is_liked = workflow.is_liked;
  const name = workflow.name;
  //
  const [likeWorklow, { isLoading: likeLoad }] = useLikeWorkflowMutation();
  const [dislikeWorkflow, { isLoading: dislikeLoad }] = useDislikeWorkflowMutation();

  //
  const handleLikeDislike = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (is_liked) {
        await dislikeWorkflow(_id);
        dispatch(setToast({ message: `You unlike ${name}`, severity: "success" }));
        return;
      }
      await likeWorklow(_id);
      dispatch(setToast({ message: `You liked ${name}`, severity: "success" }));
    } catch (error) {
      dispatch(setToast({ message: "Something went wrong, please try again later!", severity: "error" }));
    }
  };

  if (likeLoad || dislikeLoad)
    return (
      <Stack
        onClick={handleLikeDislike}
        direction={"row"}
        alignItems={"center"}
        gap={0.5}
        sx={{
          ...iconTextStyle,
          bgcolor: workflow?.is_liked ? "red" : "rgba(0, 0, 0, 0.8)",
          transition: "background-color 0.3s ease",
          "&:hover": {
            bgcolor: workflow?.is_liked ? "rgba(0, 0, 0, 0.8)" : "red",
          },
        }}
        className="icon-text-style"
      >
        <CircularProgress
          size={16}
          sx={{ color: "white" }}
        />
      </Stack>
    );

  return (
    <Stack
      onClick={handleLikeDislike}
      direction={"row"}
      alignItems={"center"}
      gap={0.5}
      sx={{
        ...iconTextStyle,
        bgcolor: workflow?.is_liked ? "red" : "rgba(0, 0, 0, 0.8)",
        transition: "background-color 0.3s ease",
        "&:hover": {
          bgcolor: workflow?.is_liked ? "rgba(0, 0, 0, 0.8)" : "red",
        },
      }}
      className="icon-text-style"
    >
      <FavoriteBorderOutlined sx={{ fontSize: 12 }} />
      {workflow?.likes ?? 0}
    </Stack>
  );
}

const iconTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "white",
  borderRadius: "100px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  padding: "0px 12px",
  height: "26px",
  svg: {
    fontSize: 12,
  },
};

export default WorkflowCardLike;
