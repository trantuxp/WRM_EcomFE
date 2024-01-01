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

const EvaluateStore = () => {
  const inittial = () => ({
    content: "",
  });

  const inittialDetail = () => ({
    _id: "",
    idEvaluate: "",
    idStore: "",
    content: "",
    user: "",
    evaluate: "",
  });
  const [stateReply, setStateReply] = useState(inittialDetail());
  const [stateContent, setStateContent] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  // const mutation = useMutationHooks((data) => {
  //   const { title, content, image, idStore } = data;
  //   const res = PostService.createPost({
  //     title,
  //     content,
  //     image,
  //     idStore,
  //   });

  //   return res;
  // });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, content } = data;
    console.log("content", content);
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

  // const mutationDeleted = useMutationHooks((data) => {
  //   const { id, token } = data;
  //   const res = PostService.deletePost(id, token);
  //   return res;
  // });
  // const {
  //   data: dataDeleted,
  //   isPending: isLoadingDeleted,
  //   isSuccess: isSuccessDelected,
  //   isError: isErrorDeleted,
  // } = mutationDeleted;

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
  const queryPost = useQuery({
    queryKey: ["evaluate"],
    queryFn: getEvaluateByStore,
  });
  const { isPending: isLoadingPosts, data: Evaluates } = queryPost;
  // const dataEvaluate =
  //   Evaluates?.length &&
  //   Evaluates?.map((Evaluate) => {
  //     setStateEvaluate({
  //       name: Evaluate?.product?.name,
  //       content: Evaluate?.content,
  //       star: Evaluate?.star,
  //       user: Evaluate?.user?.user,
  //     });
  //   });
  // useEffect(() => {
  //   setStateEvaluate(
  //     Evaluates?.length &&
  //       Evaluates?.filter((Evaluate, index) => {
  //         return (
  //           Evaluate !== "" &&
  //           Evaluate !== null &&
  //           Evaluate !== undefined && { ...Evaluate, key: Evaluate?._id }
  //         );
  //       })
  //   );
  //   console.log("setStateEvaluate", stateEvaluate);
  // }, [Evaluates]);
  const dataTable =
    Evaluates?.length &&
    Evaluates?.filter((Evaluate, index) => {
      return (
        Evaluate !== "" &&
        Evaluate !== null &&
        Evaluate !== undefined && { ...Evaluate, key: Evaluate?._id }
      );
    });

  const fetchGetReplyDetail = async (rowSelected) => {
    const res = await EvaluateService.getReplyEvaluate(rowSelected);
    console.log("res?.data 123", res[0]?.idEvaluate);

    if (res) {
      setStateReply({
        _id: res[0]?._id,
        idEvaluate: res[0]?.idEvaluate,
        idStore: res[0]?.idStore,
        content: res[0]?.content,
        user: res[0]?.user,
        evaluate: res[0]?.evaluate,
      });
      // console.log("stateReply.user[0].name", stateReply.user.name);
    }

    setIsLoadingUpdate(false);
  };
  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetReplyDetail(rowSelected);
    }
  }, [rowSelected]);
  useEffect(() => {
    form.setFieldsValue(stateReply);
  }, [form, stateReply]);

  // console.log("resdataDetail", stateReply);
  const handleDetailsReply = () => {
    if (rowSelected) {
      fetchGetReplyDetail(rowSelected);
    }
    setIsOpenDrawer(true);
    console.log("rowSelected", rowSelected);
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
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };
  // useEffect(() => {
  //   if (isSuccessUpdated && dataUpdated?.status === "OK") {
  //     message.success();
  //     handleCloseDrawer();
  //   } else if (isErrorUpdated) {
  //     message.error();
  //   }
  // }, [isSuccessUpdated]);

  // useEffect(() => {
  //   if (isSuccessDelected && dataDeleted?.status === "OK") {
  //     message.success();
  //     handleCancelDelete();
  //   } else if (isErrorDeleted) {
  //     message.error();
  //   }
  // }, [isSuccessDelected]);

  // useEffect(() => {
  //   if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
  //     message.success();
  //   } else if (isErrorDeletedMany) {
  //     message.error();
  //   }
  // }, [isSuccessDelectedMany]);

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setStatePost({
  //     title: "",
  //     content: "",
  //     image: "",
  //     idStore: "",
  //   });
  //   form.resetFields();
  // };
  // const onFinish = () => {
  //   const params = {
  //     title: statePost.title,
  //     content: statePost.content,
  //     image: statePost.image,

  //     idStore: user?.id,
  //   };
  //   mutation.mutate(params, {
  //     onSettled: () => {
  //       queryPost.refetch();
  //     },
  //   });
  // };

  // const handleOnchange = (e) => {
  //   setStatePost({
  //     ...statePost,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleOnchangeReply = (e) => {
    setStateContent(e.target.value);
  };

  const onUpdateReply = (id) => {
    console.log(
      " id: rowSelected, token: user?.access_token, ...stateReply ",
      rowSelected,
      user?.access_token,
      stateContent
    );
    mutationUpdate.mutate(
      {
        id: id,
        token: user?.access_token,
        content: stateContent,
      },
      {
        onSettled: () => {
          queryPost.refetch();
        },
      }
    );
  };

  // const handleCancelDelete = () => {
  //   setIsModalOpenDelete(false);
  // };
  // const handleDeletePost = () => {
  //   mutationDeleted.mutate(
  //     { id: rowSelected, token: user?.access_token },
  //     {
  //       onSettled: () => {
  //         queryPost.refetch();
  //       },
  //     }
  //   );
  // };

  // const handleDelteManyPosts = (ids) => {
  //   mutationDeletedMany.mutate(
  //     { ids: ids, token: user?.access_token },
  //     {
  //       onSettled: () => {
  //         queryPost.refetch();
  //       },
  //     }
  //   );
  // };

  // const handleOnchangeAvatar = async ({ fileList }) => {
  //   const file = fileList[0];
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setStatePost({
  //     ...statePost,
  //     image: file.preview,
  //   });
  // };

  // const handleOnchangeAvatarDetail = async ({ fileList }) => {
  //   const file = fileList[0];
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setStateReply({ ...stateReply, image: file.preview });
  // };
  return (
    <div>
      <WrapperHeader>Review Management</WrapperHeader>

      <TableComponent
        columns={columns}
        // handleDelteMany={handleDelteManyPosts}
        // isLoading={isLoadingPosts || isLoadingDeletedMany}
        isLoading={isLoadingPosts}
        data={dataTable}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id);
            }, // click row
          };
        }}
      />

      {/* <Modal
        title="Add Post"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input your title!" }]}
            >
              <InputComponent
                value={statePost["title"]}
                onChange={handleOnchange}
                name="title"
              />
            </Form.Item>

            <Form.Item
              label="Content"
              name="content"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <InputComponent
                value={statePost.content}
                onChange={handleOnchange}
                name="content"
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button>Select File</Button>
                {statePost?.image && (
                  <img
                    src={statePost?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </Modal> */}
      <DrawerComponent
        title="Phản hồi đánh giá"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
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
            <Form.Item
              label="User Name: "
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <div>{stateReply?.user[0]?.name}</div>
            </Form.Item>
            <Form.Item
              label="Evaluate:"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <div>
                <StarRatingUI
                  rating={stateReply?.evaluate[0]?.star}
                ></StarRatingUI>
              </div>
            </Form.Item>
            <Form.Item
              label="Evaluate Content: "
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <div>{stateReply?.evaluate[0]?.content}</div>
            </Form.Item>
            <Form.Item
              label="Reply:"
              name="content"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <InputComponent
                value={stateReply.content}
                onChange={handleOnchangeReply}
                name="content"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  onUpdateReply(stateReply?._id);
                }}
              >
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      {/* <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeletePost}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent> */}
    </div>
  );
};

export default EvaluateStore;
