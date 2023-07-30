// BaseButton.tsx
import React, { FC, ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";

interface BaseButtonProps extends Omit<ButtonProps, "color"> {
  children: ReactNode;
  variant: "text" | "outlined" | "contained";
  color: "primary" | "custom";
  customColor?: string;
  onClick?: () => void; // Add onClick prop
}

const BaseButton: FC<BaseButtonProps> = ({
  children,
  variant,
  color,
  customColor,
  onClick,
  ...rest
}) => {
  // Define the color for the button
  let buttonColor: "inherit" | "primary" | undefined = undefined;
  if (color === "primary") {
    buttonColor = "primary";
  }

  // Define custom color style if 'custom' color is selected
  const buttonStyle: React.CSSProperties =
    color === "custom" && customColor ? { backgroundColor: customColor } : {};

  return (
    <Button
      variant={variant}
      color={buttonColor}
      style={buttonStyle}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default BaseButton;
