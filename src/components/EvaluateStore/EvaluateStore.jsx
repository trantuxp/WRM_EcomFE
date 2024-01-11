import { Button, Form, Modal, Select, Space } from "antd";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import React, { useState, useEffect, useRef } from "react";
import { getBase64, renderOptions } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as EvaluateService from "../../services/EvaluateService";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as message from "../../components/Message/Message";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  MessageOutlined,
  StopOutlined,
} from "@ant-design/icons";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useSelector } from "react-redux";
import StarRatingUI from "../StarRatingUI/StarRatingUI";
import Rating from "../Rating/Rating";

const EvaluateStore = () => {
  const inittial = () => ({
    content: "",
  });

  const inittialDetail = () => ({
    _id: "",
    idEvaluate: "",
    idStore: "",
    content: "",
    evaluate: [],
    user: [],
  });
  const [stateReply, setStateReply] = useState(inittialDetail());
  const [stateContent, setStateContent] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [idUser, setIdUser] = useState("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState("");
  const [evaluate, setEvaluate] = useState("");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, content } = data;
    // console.log("content", content);
    const res = EvaluateService.updateReplyEvaluate(id, content);
    return res;
  });

  // const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const mutationCreateReply = useMutationHooks((data) => {
    const { idEvaluate, idStore, content } = data;
    const res = EvaluateService.createReplyEvaluate({
      idEvaluate,
      idStore,
      content,
    });
    return res;
  });

  // const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: dataCreateE,
    isPending: isLoadingCreateE,
    isSuccess: isSuccessCreateE,
    isError: isErrorCreateE,
  } = mutationCreateReply;

  const mutationDeleted = useMutationHooks((data) => {
    const { id, star } = data;
    const res = EvaluateService.updateEvaluate(id, { star: star });
    return res;
  });
  const {
    data: dataDeleted,
    isPending: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;

  // const mutationDeletedMany = useMutationHooks((data) => {
  //   const { token, ...ids } = data;
  //   const res = PostService.deleteManyPost(ids, token);
  //   return res;
  // });
  // const {
  //   data: dataDeletedMany,
  //   isPending: isLoadingDeletedMany,
  //   isSuccess: isSuccessDelectedMany,
  //   isError: isErrorDeletedMany,
  // } = mutationDeletedMany;
  const getEvaluateByStore = async () => {
    const res = await EvaluateService.getAllEvaluate(user.id);

    return res;
  };
  const queryEvaluate = useQuery({
    queryKey: ["evaluate"],
    queryFn: getEvaluateByStore,
  });
  const { isPending: isLoadingEvaluates, data: Evaluates } = queryEvaluate;

  const dataTable =
    Evaluates?.length &&
    Evaluates?.filter((Evaluate, index) => {
      return (
        Evaluate.productName !== "" &&
        Evaluate.productName !== null &&
        Evaluate.productName !== undefined && {
          ...Evaluate,
          key: Evaluate?._id,
        }
      );
    });

  const fetchGetReplyDetail = async (rowSelected, idUser) => {
    const res = await EvaluateService.getReplyEvaluate(rowSelected, idUser);
    // console.log("idUser", idUser, res, res[0]);

    if (res[0]) {
      setStateReply({
        _id: res[0]?._id,
        idEvaluate: res[0]?.idEvaluate,
        idStore: res[0]?.idStore,
        content: res[0]?.content,
        evaluate: res[0]?.evaluate,
        user: res[0]?.user,
      });
      // console.log("khong co gi", res[0]);
    } else {
      setStateReply(inittialDetail());
    }

    setIsLoadingUpdate(false);
  };
  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetReplyDetail(rowSelected, idUser);
    }
  }, [rowSelected]);
  useEffect(() => {
    form.setFieldsValue(stateReply);
  }, [form, stateReply]);

  // console.log("resdataDetail", stateReply);
  const handleDetailsReply = () => {
    if (rowSelected) {
      fetchGetReplyDetail(rowSelected, idUser);
    }
    setIsOpenDrawer(true);
    // console.log("rowSelected", rowSelected);
  };

  const renderAction = () => {
    return (
      <div>
        <MessageOutlined
          style={{
            color: "orange",
            fontSize: "20px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={handleDetailsReply}
        />
        <StopOutlined
          style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };
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
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
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
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const columns = [
    {
      title: "Title",
      dataIndex: "productName",
      sorter: (a, b) => a.title.length - b.title.length,
      ...getColumnSearchProps("product.name"),
    },
    {
      title: "Content",
      dataIndex: "content",
    },

    {
      title: "Star",
      dataIndex: "star",
      sorter: (a, b) => a.content - b.content,
    },
    {
      title: "User",
      dataIndex: "userName",
      sorter: (a, b) => a.content - b.content,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    } else if (dataUpdated?.status === "ERR") {
      message.error(dataUpdated?.message);
    }
  }, [isSuccessUpdated]);
  // useEffect(() => {
  //   if (isErrorCreateE && dataCreateE) {
  //     message.success();
  //     handleCloseDrawer();
  //   } else if (isErrorCreateE) {
  //     message.error();
  //   } else if (dataCreateE === "") {
  //     message.error();
  //   }
  // }, [isSuccessCreateE]);
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };
  const handleCloseDrawer = () => {
    setStateContent("");

    setIsOpenDrawer(false);
  };

  const handleOnchangeReply = (e) => {
    setStateContent(e.target.value);
  };

  const onUpdateReply = (id) => {
    // console.log(
    //   " id: rowSelected, token: user?.access_token, ...stateReply ",
    //   rowSelected,
    //   user?.access_token,
    //   stateContent
    // );
    mutationUpdate.mutate(
      {
        id: id,
        token: user?.access_token,
        content: stateContent,
      },
      {
        onSettled: () => {
          queryEvaluate.refetch();
        },
      }
    );
  };
  const onAddReply = () => {
    // console.log(
    //   " id: rowSelected, stateContent: stateReply,rating ",
    //   rowSelected,
    //   stateContent,
    //   user.id
    // );
    mutationCreateReply.mutate(
      {
        idEvaluate: rowSelected,
        idStore: user.id,
        content: stateContent,
      },
      {
        onSettled: () => {
          queryEvaluate.refetch();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteEvaluate = () => {
    mutationDeleted.mutate(
      {
        id: rowSelected,
        star: "0",
      },
      {
        onSettled: () => {
          queryEvaluate.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  useEffect(() => {
    if (isSuccessCreateE && dataCreateE?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorCreateE) {
      message.error();
    }
  }, [isSuccessCreateE]);
  return (
    <div>
      <WrapperHeader>Review Management</WrapperHeader>

      <TableComponent
        columns={columns}
        // handleDelteMany={handleDelteManyEvaluates}
        // isLoading={isLoadingEvaluates || isLoadingDeletedMany}
        isLoading={isLoadingEvaluates}
        data={dataTable}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id);
              setIdUser(record.idUser);
              setUserName(record.userName);
              setRating(record.star);
              setEvaluate(record.content);
            }, // click row
          };
        }}
      />

      <DrawerComponent
        title="Phản hồi đánh giá"
        isOpen={isOpenDrawer}
        onClose={() => handleCloseDrawer()}
        width="40%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            // onFinish={onUpdateReply}
            autoComplete="on"
            form={form}
            style={{ backgroundColor: "#f5f5f5" }}
          >
            {/* {console.log("stateReply?.user?.name", stateReply)} */}

            <Form.Item
              label="User Name: "
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <div>{userName}</div>
            </Form.Item>
            <Form.Item
              label="Evaluate:"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <StarRatingUI rating={rating}></StarRatingUI>
            </Form.Item>
            <Form.Item
              label="Evaluate Content: "
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <div>{evaluate}</div>
            </Form.Item>

            <Form.Item
              label="Reply:"
              name="content"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <InputComponent
                value={stateReply?.content}
                onChange={handleOnchangeReply}
                name="content"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  if (stateReply?._id) {
                    if (stateContent) {
                      onUpdateReply(stateReply?._id);
                    }
                  } else {
                    onAddReply();
                  }
                }}
              >
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Block reviews"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteEvaluate}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Are you sure to block this review?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default EvaluateStore;
