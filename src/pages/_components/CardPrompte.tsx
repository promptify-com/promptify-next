import { CardMedia, Grid, Typography } from "@mui/material";
import React from "react";
import { WishHeart } from "@/assets/icons/WishHeart";
import {
  BodyCardContainerGrid,
  CardContainerGrid,
  CardMediaContainer,
  FooterCardContainerGrid,
  ImgCardContainerGrid,
  TitleCardContainerGrid,
  TitleCardGrid,
  WishCardContainer,
  WishCardTotalGrid,
  WriterNameCardMedia,
} from "./StyleComponents";
import { UnionIcon } from "@/assets/icons/Union";
import { ICollection } from "@/common/types/collection";

type CardProps = {
  collection: ICollection;
  onFavoriteClick?: () => void;
};

const CardTemplate: React.FC<CardProps> = ({ collection, onFavoriteClick }) => {
  return (
    <CardContainerGrid onClick={onFavoriteClick}>
      <Grid>
        <ImgCardContainerGrid>
          <CardMedia
            sx={{ zIndex: 1 }}
            component="img"
            image={collection.thumbnail}
            alt="propmte image"
          />
          <Grid>
            <Grid
              sx={{
                left: "15px",
                zIndex: 1,
                // background: 'white',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "6px",
                gap: "4px",
                position: "absolute",
                width: "36px",
                height: "60px",
                background: "#FDFBFF",
                borderRadius: "99px",
                bottom: "15px",
                justifyContent: "center",
              }}
            >
              <UnionIcon />
              <Grid>{collection?.prompt_templates_count}</Grid>
            </Grid>
          </Grid>
        </ImgCardContainerGrid>
        {/* <Grid
          sx={{
            marginTop: '-11.5em',
            padding: '20px',
          }}
        >
          <CardMedia
            sx={{ borderRadius: '18px' }}
            component="img"
            image={collection.thumbnail}
            alt="propmte image"
          />
        </Grid> */}
      </Grid>
      <BodyCardContainerGrid>
        <TitleCardGrid>
          {collection.name.length <= 30
            ? collection.name
            : `${collection.name.slice(0, 30)}...`}
        </TitleCardGrid>
        {/* <TagsCardContainerGrid>
                    {collection.tags.map((el, idx) => (
                        <TagCardGrid key={idx} >
                            {el.name}
                        </TagCardGrid>
                    ))}
                </TagsCardContainerGrid> */}
        <Grid
          sx={{
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
          {collection.description?.length > 78
            ? `${collection.description?.slice(0, 78 - 1)}...`
            : collection.description}
        </Grid>
      </BodyCardContainerGrid>
      <TitleCardContainerGrid>
        <FooterCardContainerGrid>
          <CardMediaContainer>
            {/* <WriterImgCardMedia
                            component="img"
                            image={collection?.created_by?.avatar || Images.WRITER}
                            alt="writer"
                        /> */}
            {/* {`${collection?.first_name[0].toUpperCase()}${collection?.last_name[0].toUpperCase()}`} */}
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
              {!!collection?.created_by
                ? !!collection?.created_by?.first_name &&
                  !!collection?.created_by?.last_name
                  ? `${collection?.created_by?.first_name[0]?.toUpperCase()}${collection?.created_by?.last_name[0]?.toUpperCase()}`
                  : collection?.created_by?.username[0]?.toUpperCase()
                : ""}
            </Typography>
            <WriterNameCardMedia>
              {!!collection?.created_by
                ? !!collection?.created_by?.first_name &&
                  !!collection?.created_by?.last_name
                  ? `${collection?.created_by?.first_name} ${collection?.created_by?.last_name}`
                  : collection?.created_by?.username
                : "-"}
            </WriterNameCardMedia>
          </CardMediaContainer>
          <WishCardContainer>
            <Grid>
              <WishHeart />
            </Grid>
            <WishCardTotalGrid>{collection.likes}</WishCardTotalGrid>
          </WishCardContainer>
        </FooterCardContainerGrid>
      </TitleCardContainerGrid>
    </CardContainerGrid>
  );
};

export default CardTemplate;
