import React, { useMemo, useState } from "react";
import { Add } from "@mui/icons-material";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { theme } from "@/theme";

import { useGetDeploymentsQuery } from "@/core/api/deployments";
import { Layout } from "@/layout";
import { DeploymentsStatusArray } from "@/common/constants";
import { DeploymentStatus } from "@/common/types/deployments";
import Protected from "@/components/Protected";
import BaseButton from "@/components/base/BaseButton";
import DeploymentList from "@/components/deployments/DeploymentList";
import SparksTemplatePlaceholder from "@/components/placeholders/SparksTemplatePlaceholder";
import CreateDeploymentPopup from "@/components/deployments/CreateDeploymentPopup";
import ActiveFilters from "@/components/deployments/ActiveFilters";

const MyDeploymentsPage = () => {
  const [searchName, setSearchName] = useState("");
  const [status, setStatus] = useState<DeploymentStatus | string>("");
  const [openpopup, setOpenpopup] = useState(false);
  const { data: deployments, isLoading } = useGetDeploymentsQuery();

  const filteredDeployments = useMemo(() => {
    if (!deployments) return [];

    return deployments
      .filter(deployment => {
        const matchesStatus = status ? deployment.status.toLowerCase() === status.toLowerCase() : true;
        const matchesName = deployment.model?.name.toLowerCase().includes(searchName.trim().toLowerCase()) ?? false;
        return matchesStatus && matchesName;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [searchName, status, deployments]);

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
                        {DeploymentsStatusArray.map((status, idx) => (
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
                    <BaseButton
                      variant="contained"
                      color="primary"
                      sx={btnStyle}
                      startIcon={<Add sx={{ fontSize: 20 }} />}
                      onClick={() => setOpenpopup(true)}
                    >
                      Create
                    </BaseButton>
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
          {openpopup && <CreateDeploymentPopup onClose={() => setOpenpopup(false)} />}
        </Box>
      </Layout>
    </Protected>
  );
};

export default MyDeploymentsPage;

const btnStyle = {
  color: "surface.1",
  fontSize: 14,
  p: "6px 16px",
  borderRadius: "8px",
  border: `1px solid ${alpha(theme.palette.onSurface, 0.2)}`,
  ":hover": {
    bgcolor: "action.hover",
  },
};
