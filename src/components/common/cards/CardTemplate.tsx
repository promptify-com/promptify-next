import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { WishHeart } from "@/assets/icons/WishHeart";
import { Templates } from "@/core/api/dto/templates";

type CardTemplateProps = {
  template: Templates;
  onFavoriteClick?: () => void;
  lengthTemplate?: number;
};

const CardTemplate: React.FC<CardTemplateProps> = ({
  template,
  onFavoriteClick,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        p: { sm: "6px" },
        width: "100%",
        "&:hover": {
          bgcolor: "white",
        },
        "&.MuiCard-root": {
          bgcolor: "white",
        },
      }}
      elevation={0}
    >
      <Grid
        display={"flex"}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "start", md: "center" }}
        justifyContent={"space-between"}
      >
        <Grid
          display={"flex"}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "start", sm: "center" }}
        >
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              width: { xs: "100%", sm: "100px" },
              height: { xs: "270px", sm: "70px" },
              objectFit: "cover",
            }}
            component="img"
            image={template.thumbnail}
            alt={template.title}
          />
          <Grid
            sx={{
              ml: { md: "20px" },
            }}
            display={"flex"}
            direction={"column"}
          >
            <Typography fontSize={14} fontWeight={500}>
              {template.title}
            </Typography>
            <Typography fontSize={12} color="text.secondary" variant="body2">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    template.description?.length > 70
                      ? `${template.description?.slice(0, 70 - 1)}...`
                      : template.description,
                }}
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid display={"flex"} alignItems={"center"} gap={1}>
          <Grid
            sx={{
              display: "flex",
              gap: "4px",
            }}
          >
            {template.tags.slice(0, 3).map((el, idx) => (
              <Chip clickable size="small" label={el.name} key={idx} />
            ))}
          </Grid>
          <Button variant="text" size="small">
            <Grid
              sx={{
                display: "flex",
                gap: "0.4em",
              }}
            >
              <Grid>
                <WishHeart />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  fontSize: "0.7em",
                  alignItems: "center",
                  color: "#8c8b8e",
                }}
              >
                {template.likes}
              </Grid>
            </Grid>
          </Button>
          <Avatar
            src={template.title}
            alt={template.title}
            sx={{ bgcolor: "indigo" }}
          />
        </Grid>
      </Grid>
    </Card>

    // <Grid
    //   item
    //   onClick={onFavoriteClick}
    //   sx={{
    //     width: "100%",
    //     gap: "4",
    //   }}
    // >
    //   <Grid
    //     sx={{
    //       display: "flex",
    //       flexDirection: "row",
    //       gap: "1em",
    //     }}
    //   >
    //     <Grid
    //       sx={{
    //         maxWidth: { xs: "106px", sm: "143px" },
    //         minWidth: { xs: "106px", sm: "143px" },
    //         height: { xs: "80px", sm: "107px" },
    //         display: "flex",
    //         justifyContent: "flex-start",
    //         alignItems: "flex-start",
    //       }}
    //     >
    //       <CardMedia
    //         sx={{
    //           zIndex: 1,
    //           borderRadius: "16px",
    //           height: { xs: "80px", sm: "107px" },
    //         }}
    //         component="img"
    //         image={template.thumbnail}
    //         alt="propmte image"
    //       />
    //     </Grid>
    //     <Grid
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column",
    //         gap: "8px",
    //         width: "100%",
    //         height: { xs: "80px", sm: "107px" },
    //       }}
    //     >
    //       <Grid
    //         sx={{
    //           fontFamily: "Poppins",
    //           fontStyle: "normal",
    //           fontWeight: 500,
    //           fontSize: "14px",
    //           lineHeight: "140%",
    //           letterSpacing: "0.15px",
    //           color: "#1D2028",
    //           height: "20px",
    //         }}
    //       >
    //         {template.title.length <= 30
    //           ? template.title
    //           : `${template.title.slice(0, 30)}...`}
    //       </Grid>
    //       <Grid
    //         sx={{
    //           fontFamily: "Poppins",
    //           fontStyle: "normal",
    //           fontWeight: 400,
    //           fontSize: "12px",
    //           lineHeight: "143%",
    //           letterSpacing: "0.17px",
    //           color: "#1B1B1E",
    //           width: "fit-content",
    //           display: { xs: "flex", sm: "none" },
    //         }}
    //       >
    //         <div
    //           dangerouslySetInnerHTML={{
    //             __html:
    //               template.description?.length > 70
    //                 ? `${template.description?.slice(0, 70 - 1)}...`
    //                 : template.description,
    //           }}
    //         />
    //       </Grid>
    //       <Grid
    //         sx={{
    //           fontFamily: "Poppins",
    //           fontStyle: "normal",
    //           fontWeight: 400,
    //           fontSize: "12px",
    //           lineHeight: "143%",
    //           letterSpacing: "0.17px",
    //           color: "#1B1B1E",
    //           width: "fit-content",
    //           display: { xs: "none", sm: "flex" },
    //           height: "41px",
    //         }}
    //       >
    //         <div
    //           dangerouslySetInnerHTML={{
    //             __html:
    //               template.description?.length > 80
    //                 ? `${template.description?.slice(0, 80 - 1)}...`
    //                 : template.description,
    //           }}
    //         />
    //       </Grid>
    //       <Grid
    //         sx={{
    //           display: { xs: "none", sm: "flex" },
    //           gap: "1em",
    //           justifyContent: "space-between",
    //           height: "26px",
    //         }}
    //       >
    //         {
    //           <Grid
    //             sx={{
    //               display: "flex",
    //               gap: "1em",
    //             }}
    //           >
    //             {template.tags.map((el, idx) => (
    //               <Grid
    //                 sx={{
    //                   display: "flex",
    //                   justifyContent: "center",
    //                   alignItems: "center",
    //                   padding: "4px 9px",
    //                   gap: "10px",
    //                   width: "fit-content",
    //                   background: "#E7E7F0",
    //                   borderRadius: "3em",
    //                   fontSize: "0.6em",
    //                 }}
    //                 key={idx}
    //               >
    //                 {el.name}
    //               </Grid>
    //             ))}
    //           </Grid>
    //         }
    //         <Grid
    //           sx={{
    //             display: "flex",
    //             gap: "0.4em",
    //           }}
    //         >
    //           <Grid>
    //             <WishHeart />
    //           </Grid>
    //           <Grid
    //             sx={{
    //               display: "flex",
    //               fontSize: "0.7em",
    //               alignItems: "center",
    //               color: "#8c8b8e",
    //             }}
    //           >
    //             {template.likes}
    //           </Grid>
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    //   <Grid
    //     sx={{
    //       display: { xs: "flex", sm: "none" },
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //     }}
    //   >
    //     <Grid
    //       sx={{
    //         display: "flex",
    //         flexDirection: "revert",
    //         gap: "10px",
    //       }}
    //     >
    //       <Typography
    //         sx={{
    //           bgcolor: "black",
    //           borderRadius: "25px",
    //           width: "17px",
    //           padding: "1px",
    //           height: "17px",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           cursor: "pointer",
    //           fontFamily: "Poppins",
    //           fontStyle: "normal",
    //           textAlign: "center",
    //           fontWeight: 400,
    //           fontSize: "12px",
    //           letterSpacing: "0.14px",
    //           color: "#FFFFFF",
    //         }}
    //       >
    //         {!!template?.created_by
    //           ? !!template?.created_by?.first_name &&
    //             !!template?.created_by?.last_name
    //             ? `${template?.created_by?.first_name[0]?.toUpperCase()}${template?.created_by?.last_name[0]?.toUpperCase()}`
    //             : template?.created_by?.username[0]?.toUpperCase()
    //           : ""}
    //       </Typography>
    //       <Typography
    //         sx={{
    //           fontFamily: "Poppins",
    //           fontStyle: "normal",
    //           fontWeight: 400,
    //           fontSize: "12px",
    //           lineHeight: "166%",
    //           display: "flex",
    //           alignItems: "center",
    //           color: "#1B1B1E",
    //         }}
    //       >
    //         {!!template?.created_by
    //           ? !!template?.created_by?.first_name &&
    //             !!template?.created_by?.last_name
    //             ? `${template?.created_by?.first_name} ${template?.created_by?.last_name}`
    //             : template?.created_by?.username
    //           : "-"}
    //       </Typography>
    //     </Grid>
    //     <Grid
    //       sx={{
    //         display: "flex",
    //         gap: "0.4em",
    //       }}
    //     >
    //       <Grid>
    //         <WishHeart />
    //       </Grid>
    //       <Grid
    //         sx={{
    //           display: "flex",
    //           fontSize: "0.7em",
    //           alignItems: "center",
    //           color: "#8c8b8e",
    //         }}
    //       >
    //         {template.likes}
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Grid>
  );
};

export default CardTemplate;
