import { Button, Form, Space } from "antd";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { convertPrice, getBase64 } from "../../utils";
import * as message from "../Message/Message";

import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import React, { useState, useEffect, useRef } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [orderItem, setOrderItem] = useState([]);
  const [rowSelected, setRowSelected] = useState("");

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleCancelUpdate = () => {
    setIsModalOpenUpdate(false);
  };
  const getAllOrder1 = async () => {
    const res = await OrderService.getOrderByStore1(user.id);
    return res;
  };
  const queryOrder1 = useQuery({
    queryKey: ["orders1"],
    queryFn: getAllOrder1,
  });
  const { isPending: isLoadingOrders1, data: orders1 } = queryOrder1;

  const getAllOrder2 = async () => {
    const res = await OrderService.getOrderByStore2(user.id);
    return res;
  };
  const queryOrder2 = useQuery({
    queryKey: ["orders2"],
    queryFn: getAllOrder2,
  });
  const { isPending: isLoadingOrders2, data: orders2 } = queryOrder2;

  const getAllOrder3 = async () => {
    const res = await OrderService.getOrderByStore3(user.id);
    return res;
  };

  const queryOrder3 = useQuery({
    queryKey: ["orders3"],
    queryFn: getAllOrder3,
  });
  const { isPending: isLoadingOrders3, data: orders3 } = queryOrder3;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const mutationDeleted = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;

    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });
  const {
    data: dataDeleted,
    isPending: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      {
        id: rowSelected,
        token: user?.token,
        orderItems: orderItem,
        userId: user.id,
      },
      {
        onSettled: () => {
          queryOrder1.refetch();
          queryOrder2.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };
  const renderAction1 = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };
  const renderAction2 = () => {
    return (
      <div>
        <CheckOutlined
          style={{
            color: "orange",
            fontSize: "30px",
            cursor: "pointer",
            marginRight: "5px",
          }}
          onClick={() => setIsModalOpenUpdate(true)}
        />
      </div>
    );
  };
  const columns1 = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Paided",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Shipped",
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps("isDelivered"),
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction1,
    },
  ];

  const dataTable1 =
    orders1?.data?.length &&
    orders1?.data?.map((order) => {
      console.log("usewr", order);
      return {
        ...order,
        key: order.id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });
  const columns2 = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Paided",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Shipped",
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps("isDelivered"),
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction2,
    },
  ];

  const dataTable2 =
    orders2?.data?.length &&
    orders2?.data?.map((order) => {
      console.log("usewr", order);
      return {
        ...order,
        key: order.id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });
  const columns3 = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Paided",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Shipped",
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps("isDelivered"),
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps("totalPrice"),
    },
  ];

  const dataTable3 =
    orders3?.data?.length &&
    orders3?.data?.map((order) => {
      console.log("usewr", order);
      return {
        ...order,
        key: order.id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  const mutationUpdate = useMutationHooks((id) => {
    const res = OrderService.updateStateOrder(id);
    return res;
  });

  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const onUpdateOrder = () => {
    mutationUpdate.mutate(rowSelected, {
      onSettled: () => {
        queryOrder2.refetch();
        queryOrder3.refetch();
      },
    });
    setIsModalOpenUpdate(false);
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  return (
    <div>
      <WrapperHeader>Order management</WrapperHeader>
      <div
        style={{
          height: 200,
          width: "20%",
          padding: "10px",
          alignItems: "flex-start",
        }}
      >
        <PieChartComponent data={orders3?.data} />
        100% Payment in cash
      </div>

      <div style={{ marginTop: "20px" }}>
        <h5>New Order</h5>
        <TableComponent
          columns={columns1}
          isLoading={isLoadingOrders1}
          data={dataTable1}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record.id);
                setOrderItem(record.orderItems);
              }, // click row
            };
          }}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <h5>Delivered Order</h5>

        <TableComponent
          columns={columns2}
          isLoading={isLoadingOrders2}
          data={dataTable2}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record.id);
                setOrderItem(record.orderItems);
              }, // click row
            };
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <h5>Paid Order</h5>

        <TableComponent
          columns={columns3}
          isLoading={isLoadingOrders3}
          data={dataTable3}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record.id);
                setOrderItem(record.orderItems);
              }, // click row
            };
          }}
        />
      </div>
      <ModalComponent
        title="Cancel Order"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Are you sure to cancel this order?</div>
        </Loading>
      </ModalComponent>
      <ModalComponent
        title="Confirm paid Order"
        open={isModalOpenUpdate}
        onCancel={handleCancelUpdate}
        onOk={onUpdateOrder}
      >
        <Loading isLoading={isLoadingUpdated}>
          <div>Are you sure your order has been paid?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default OrderAdmin;
