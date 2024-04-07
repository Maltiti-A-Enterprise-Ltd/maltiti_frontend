import {
  Avatar,
  Breadcrumbs,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  getOrder,
  getOrders,
  removeFromCart,
  setIsOrderOpen,
} from "../../features/cart/cartSlice";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { formatDate } from "../../utility/formatDate";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import CycloneIcon from "@mui/icons-material/Cyclone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { HighlightedText } from "../styleTW";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "100%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
};

const Orders = () => {
  const dispatch = useDispatch();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0F6938",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer",
    },
    "&:hover:nth-of-type(odd)": {
      backgroundColor: "#e8faef",
      cursor: "pointer",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const orders = useSelector((state) => state.cart.orders);
  const order = useSelector((state) => state.cart.order);
  const isOrderOpen = useSelector((state) => state.cart.isOrderOpen);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  return (
    <div className={"mt-16"}>
      <Breadcrumbs separator={">"} aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          color="text.primary"
        >
          <ShoppingBagIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Orders
        </Typography>
      </Breadcrumbs>
      <div className={"my-5 text-3xl"}>
        My <HighlightedText>Orders</HighlightedText>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order #</StyledTableCell>
              <StyledTableCell>Payment Status</StyledTableCell>
              <StyledTableCell>Order Status</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <StyledTableRow
                onClick={() => {
                  dispatch(getOrder(order.id));
                }}
                className={"hover:bg-[#e8faef] cursor-pointer"}
                key={order.id}
              >
                <StyledTableCell component="th" scope="row">
                  {`#${order.id.substring(0, 6).toUpperCase()}`}
                </StyledTableCell>
                <StyledTableCell>
                  {order.paymentStatus === "paid" ? (
                    <Chip
                      label={order.paymentStatus.toUpperCase()}
                      color="success"
                      icon={<DoneIcon />}
                    />
                  ) : (
                    <Chip
                      label={order.paymentStatus.toUpperCase()}
                      color="error"
                      icon={<CloseIcon />}
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {order.orderStatus === "review" && (
                    <Chip
                      label={order.orderStatus.toUpperCase()}
                      color="default"
                      icon={<RemoveRedEyeIcon />}
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell>{formatDate(order.createdAt)}</StyledTableCell>
                <StyledTableCell>GH&#8373; {order.amount}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
          open={isOrderOpen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className={"bg-[#e8faef] flex justify-between p-4"}>
              <span>
                Order ID: {`#${order?.id.substring(0, 6).toUpperCase()}`}
              </span>
              <span>Ship To: {order?.name}</span>
              <span>Total: GHC {order?.amount}</span>
              <span>
                Order Date: {order?.createdAt && formatDate(order?.createdAt)}
              </span>
            </div>
            <hr className={"bg-gray-200"} />
            <div className={"flex justify-between p-4"}>
              <div className={"flex flex-col"}>
                <span>Order Status</span>
                <span>
                  <Chip
                    label={order?.paymentStatus.toUpperCase()}
                    color="success"
                    icon={<DoneIcon />}
                  />
                </span>
              </div>
              <Divider orientation="vertical" variant="middle" flexItem />
              <div className={"flex flex-col"}>
                <span>Payment Status</span>
                <span>
                  <Chip
                    label={order?.orderStatus.toUpperCase()}
                    icon={<VisibilityIcon />}
                  />
                </span>
              </div>
              <Divider orientation="vertical" variant="middle" flexItem />
              <div className={"flex flex-col"}>
                <span>Payment Date</span>
                <span>{order?.updatedAt && formatDate(order?.updatedAt)}</span>
              </div>
              <Divider orientation="vertical" variant="middle" flexItem />
              <div className={"flex flex-col"}>
                <span>Estimated Arrival Date</span>
                <span>VISA CARD</span>
              </div>
            </div>
            <hr className={"bg-gray-200"} />
            <div className={"w-full p-10 h-full flex"}>
              <div>
                <Tooltip
                  placement="top"
                  open={order?.orderStatus === "review"}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  title="Order is being reviewed and will begin packaging shortly."
                  arrow
                >
                  <Avatar sx={{ bgcolor: "green" }}>
                    <VisibilityIcon />
                  </Avatar>
                </Tooltip>
              </div>
              <div className={"w-full grid items-center"}>
                <hr className={"bg-[green] h-1"} />
              </div>
              <div>
                <Tooltip
                  placement="top"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  title="Order is being packaged and will be scheduled for delivery soon."
                  arrow
                >
                  <Avatar>
                    <CycloneIcon />
                  </Avatar>
                </Tooltip>
              </div>
              <div className={"w-full grid items-center"}>
                <hr className={"bg-[#bdbdbd] h-1"} />
              </div>
              <div>
                <Avatar>
                  <LocalShippingIcon />
                </Avatar>
              </div>
              <div className={"w-full grid items-center"}>
                <hr className={"bg-[#bdbdbd] h-1"} />
              </div>
              <div>
                <Avatar>
                  <AssuredWorkloadIcon />
                </Avatar>
              </div>
            </div>
            <div className="flex p-10 flex-row">
              <div className="basis-3/4">
                <ul
                  role="list"
                  className="-my-6 space-y-3 divide-y divide-gray-200"
                >
                  {order?.__carts__?.map((item) => (
                    <li className="flex rounded-md bg-gray-200 px-3 mx-5 py-2">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex justify-center flex-1 flex-col">
                        <div>
                          <div className="flex items-center self-center justify-self-center justify-between text-base font-medium text-gray-900">
                            <div className={"flex gap-x-2"}>
                              <span>{item.product.name}</span>
                              <span>X{item.quantity}</span>
                            </div>
                            <p className="ml-4 text-sm">
                              GH&#8373; {item.product.retail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="basis-1/4 flex gap-y-2 flex-col">
                <Button color={"error"} variant="contained">
                  Cancel Order
                </Button>
                <Button color={"success"} variant="contained">
                  Invoice
                </Button>
                <Button color={"warning"} variant="contained">
                  Contact Us
                </Button>
                <Button variant="contained">Reorder</Button>
              </div>
            </div>
            <div className={"p-4 flex justify-center"}>
              <Button
                onClick={() => dispatch(setIsOrderOpen(false))}
                color={"error"}
                variant="contained"
              >
                Close
              </Button>
            </div>
          </Box>
        </Modal>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={5}
        page={1}
        onPageChange={() => {
          console.log("");
        }}
        onRowsPerPageChange={() => {
          console.log("");
        }}
      />
    </div>
  );
};

export default Orders;
