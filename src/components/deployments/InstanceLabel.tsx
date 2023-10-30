import Typography from "@mui/material/Typography";

import type { Instance } from "@/common/types/deployments";

function InstanceLabel({ instance }: { instance: Instance }) {
  return (
    <>
      {instance.instance_type}{" "}
      <Typography
        component="span"
        variant="body2"
        sx={{ opacity: 0.6 }}
      >
        (cost ${instance.cost}/h, {instance.vcpus}vcpus, {instance.num_gpus}gpus, {instance.memory}memory)
      </Typography>
    </>
  );
}

export default InstanceLabel;
