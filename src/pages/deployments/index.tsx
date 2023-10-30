import { useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { Layout } from "@/layout";
import { DeploymentStatuses } from "@/common/constants";
import { useGetDeploymentsQuery } from "@/core/api/deployments";
import type { DeploymentStatus } from "@/common/types/deployments";
import Protected from "@/components/Protected";
import DeploymentList from "@/components/deployments/DeploymentList";
import SparksTemplatePlaceholder from "@/components/placeholders/SparksTemplatePlaceholder";
import ActiveFilters from "@/components/deployments/ActiveFilters";
import CreateDeploymentButton from "@/components/deployments/CreateDeploymentButton";

function Deployments() {
  const [searchName, setSearchName] = useState("");
  const [status, setStatus] = useState<DeploymentStatus | string>("");

  const { data: deployments, isLoading } = useGetDeploymentsQuery();

  const trimmedSearchName = searchName.trim().toLowerCase();
  const filteredDeployments =
    deployments?.filter(deployment => {
      const matchesStatus = !status || deployment.status.toLowerCase() === status.toLowerCase();
      const matchesName = !trimmedSearchName || deployment.model?.name.toLowerCase().includes(trimmedSearchName);
      return matchesStatus && matchesName;
    }) ?? [];

  return (
    <Protected>
      <Layout>
        <Box
          mt={{ xs: 7, md: 0 }}
          padding={{ xs: "4px 0px", md: "0px 8px" }}
        >
          <Grid sx={{ padding: { xs: "16px", md: "32px" } }}>
            {isLoading ? (
              <Box>
                <Box bgcolor="surface.1">
                  <SparksTemplatePlaceholder count={3} />
                </Box>
              </Box>
            ) : (
              <Stack gap={2}>
                <Typography
                  fontSize="24px"
                  fontWeight={500}
                  color="onSurface"
                  lineHeight="34.32px"
                  letterSpacing="0.17"
                >
                  My Deployments
                </Typography>

                <Stack
                  direction={{ xs: "column-reverse", md: "row" }}
                  gap={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="start"
                    gap={"8px"}
                    width={"100%"}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      width="200px"
                      borderRadius="8px"
                    >
                      <TextField
                        id="filled-basic"
                        label="Find deployment..."
                        size="small"
                        variant="outlined"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                      />
                    </Box>
                    <FormControl
                      sx={{ minWidth: 120 }}
                      size="small"
                    >
                      <InputLabel id="selectStatus">Status</InputLabel>
                      <Select
                        labelId="selectStatus"
                        value={status}
                        label="Status"
                        autoWidth
                        onChange={e => setStatus(e.target.value as DeploymentStatus)}
                      >
                        {DeploymentStatuses.map((status, idx) => (
                          <MenuItem
                            key={idx}
                            value={status}
                          >
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack
                    direction={"row"}
                    width={"100%"}
                    justifyContent={"end"}
                  >
                    <CreateDeploymentButton />
                  </Stack>
                </Stack>
                <ActiveFilters
                  status={status}
                  onClearStatus={() => setStatus("")}
                  searchName={searchName}
                  onClearSearch={() => setSearchName("")}
                />

                {filteredDeployments.length === 0 ? (
                  <Typography sx={{ opacity: 0.4, textAlign: "center", py: 10 }}>No deployments found</Typography>
                ) : (
                  <DeploymentList items={filteredDeployments} />
                )}
              </Stack>
            )}
          </Grid>
        </Box>
      </Layout>
    </Protected>
  );
}

export default Deployments;
