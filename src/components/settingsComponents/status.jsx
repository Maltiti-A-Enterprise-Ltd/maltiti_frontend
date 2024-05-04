import { Chip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { orderStatusProgress } from "../../utility/status";

export const PaymentStatus = ({ status }) => {
  return status === "paid" ? (
    <Chip
      label={status?.toUpperCase()}
      sx={{
        bgcolor: "#49a876",
        color: "#ffffff",
      }}
      icon={
        <DoneIcon
          style={{
            color: "#ffffff",
          }}
        />
      }
    />
  ) : (
    <Chip
      label={status?.toUpperCase()}
      sx={{
        bgcolor: "#e84848",
        color: "#ffffff",
      }}
      icon={
        <CloseIcon
          style={{
            color: "#ffffff",
          }}
        />
      }
    />
  );
};

export const OrderStatus = ({ status }) => {
  switch (status) {
    case "review":
      return (
        <Chip
          label={status.toUpperCase()}
          color="default"
          icon={<RemoveRedEyeIcon />}
        />
      );
    case "delivered":
      return (
        <Chip
          label={status.toUpperCase()}
          color="default"
          icon={<DoneIcon />}
        />
      );
    case "packaging":
      return (
        <Chip
          label={status.toUpperCase()}
          color="default"
          icon={<DeveloperBoardIcon />}
        />
      );
    case "delivery in progress":
      return (
        <Chip
          label={status.toUpperCase()}
          color="default"
          icon={<LocalShippingIcon />}
        />
      );
    case "cancelled":
      return (
        <Chip
          label={status.toUpperCase()}
          color="default"
          icon={<CloseIcon />}
        />
      );
    default:
      return null; // Or you can return some default message/component here
  }
};
