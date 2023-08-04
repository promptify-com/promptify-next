import React, { FC, ReactNode, JSX } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Icon from "@mui/material/Icon";
interface BaseButtonProps extends Omit<ButtonProps, "color"> {
  children: ReactNode;
  variant: "text" | "outlined" | "contained";
  color: "primary" | "custom";
  customColor?: string;
  onClick?: () => void;
  icon?: JSX.Element;
}

const BaseButton: FC<BaseButtonProps> = ({
  children,
  variant,
  color,
  customColor,
  onClick,
  icon,
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
      style={{
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
        ...buttonStyle,
      }}
      onClick={onClick}
      {...rest}
    >
      {/* Render the icon if provided */}
      {icon && <Icon>{icon}</Icon>}
      {children}
    </Button>
  );
};

export default BaseButton;
