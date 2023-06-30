import { CardMedia, Grid, Typography } from "@mui/material";
import React from "react";
import { WishHeart } from "@/assets/icons/WishHeart";
import { Templates } from "@/core/api/dto/templates";

type ListProps = {
  template: Templates;
  onFavoriteClick?: () => void;
  windowWidth: number;
};

const ListTemplate: React.FC<ListProps> = ({
  template,
  onFavoriteClick,
  windowWidth,
}) => {
  return (
    <Grid
      onClick={onFavoriteClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5em",
        "&:hover": {
          transform: "scale(1.005)",
          cursor: "pointer",
        },
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 0,
          height: { xs: "130px", sm: "218px" },
          background: "#F5F5F5",
          borderRadius: "16px",
          marginTop: { xs: "0em", sm: "0.5em" },
          marginBottom: { xs: "0em", sm: "1.5em" },
        }}
      >
        <Grid
          className="img-template"
          sx={{
            height: { xs: "130px", sm: "218px" },
            borderRadius: "16px",
            minWidth: { xs: "158px", sm: "238px" },
          }}
        >
          <CardMedia
            component="img"
            image={template.thumbnail}
            alt="propmte image"
            sx={{
              borderRadius: "16px",
              height: { xs: "130px", sm: "218px" },
              width: "100%",
            }}
          />
        </Grid>
        <Grid
          sx={{
            justifyContent: { xs: "flex-start", sm: "space-between" },
            alignItems: "flex-start",
            padding: "0px 24px",
            alignSelf: "stretch",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Grid
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: "140%",
              letterSpacing: "0.15px",
              color: "#1B1B1E",
              height: { xs: "fit-content", sm: "22px" },
            }}
          >
            {template.title}
          </Grid>
          <Grid
            sx={{
              height: { xs: "fit-content", sm: "53px" },
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "143%",
              letterSpacing: "0.17px",
              color: "#1B1B1E",
              opacity: 0.75,
            }}
          >
            {windowWidth < 793 ? (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    template.description?.length > 64
                      ? `${template.description?.slice(0, 64 - 1)}...`
                      : template.description,
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    template.description?.length > 121
                      ? `${template.description?.slice(0, 121 - 1)}...`
                      : template.description,
                }}
              />
            )}
          </Grid>
          <Grid
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "21px",
              flexGrow: 0,
              display: { xs: "none", sm: "flex" },
              height: "26px",
              alignItems: "center",
              gap: "1em",
            }}
          >
            {template.tags.map((el, idx) => (
              <Grid
                key={idx}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0px 10px",
                  height: "26px",
                  background: "#E7E7F0",
                  borderRadius: "100px",
                }}
              >
                {el.name}
              </Grid>
            ))}
          </Grid>
          <Grid
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: "40px",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.4em",
              }}
            >
              {/* <CardMedia
                component="img"
                image={template?.created_by?.avatar || Images.WRITER}
                alt="propmte image"
                sx={{
                  width: '1.5em',
                }}
              /> */}
              <Typography
                sx={{
                  bgcolor: "black",
                  borderRadius: "25px",
                  width: "25px",
                  padding: "1px",
                  height: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  textAlign: "center",
                  fontWeight: 400,
                  fontSize: "12px",
                  letterSpacing: "0.14px",
                  color: "#FFFFFF",
                }}
              >
                {/* {`${collection?.created_by?.first_name[0]?.toUpperCase()}${collection?.created_by?.last_name[0]?.toUpperCase()}`} */}
                {!!template?.created_by
                  ? !!template?.created_by?.first_name &&
                    !!template?.created_by?.last_name
                    ? `${template?.created_by?.first_name[0]?.toUpperCase()}${template?.created_by?.last_name[0]?.toUpperCase()}`
                    : template?.created_by?.username[0]?.toUpperCase()
                  : ""}
              </Typography>
              <Grid
                sx={{
                  fontSize: "12px",
                  width: "fit-content",
                  height: "20px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "166%",
                  display: "flex",
                  alignItems: "center",
                  letterSpacing: "0.4px",
                  color: "#000000",
                }}
              >
                {!!template?.created_by
                  ? !!template?.created_by?.first_name &&
                    !!template?.created_by?.last_name
                    ? `${template?.created_by?.first_name} ${template?.created_by?.last_name}`
                    : template?.created_by?.username
                  : "-"}
              </Grid>
            </Grid>
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
                }}
              >
                {template.likes}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "40px",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.4em",
          }}
        >
          <Typography
            sx={{
              bgcolor: "black",
              borderRadius: "25px",
              width: "25px",
              padding: "1px",
              height: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontFamily: "Poppins",
              fontStyle: "normal",
              textAlign: "center",
              fontWeight: 400,
              fontSize: "12px",
              letterSpacing: "0.14px",
              color: "#FFFFFF",
            }}
          >
            {/* {`${collection?.created_by?.first_name[0]?.toUpperCase()}${collection?.created_by?.last_name[0]?.toUpperCase()}`} */}
            {!!template?.created_by
              ? !!template?.created_by?.first_name &&
                !!template?.created_by?.last_name
                ? `${template?.created_by?.first_name[0]?.toUpperCase()}${template?.created_by?.last_name[0]?.toUpperCase()}`
                : template?.created_by?.username[0]?.toUpperCase()
              : ""}
          </Typography>

          <Grid
            sx={{
              fontSize: "12px",
              width: "fit-content",
              height: "20px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "166%",
              display: "flex",
              alignItems: "center",
              letterSpacing: "0.4px",
              color: "#000000",
            }}
          >
            {!!template?.created_by
              ? !!template?.created_by?.first_name &&
                !!template?.created_by?.last_name
                ? `${template?.created_by?.first_name} ${template?.created_by?.last_name}`
                : template?.created_by?.username
              : "-"}
          </Grid>
        </Grid>
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
            }}
          >
            {template.likes}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListTemplate;
