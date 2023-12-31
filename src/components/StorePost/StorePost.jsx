import { Button, Form, Modal, Select, Space } from "antd";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import React, { useState, useEffect, useRef } from "react";
import { getBase64, renderOptions } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as PostService from "../../services/PostService";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as message from "../../components/Message/Message";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useSelector } from "react-redux";

const StorePost = () => {
  const inittial = () => ({
    title: "",
    content: "",
    image: "",
    idStore: "",
  });

  const inittialDetail = () => ({
    title: "",
    content: "",
    image: "",
    idStore: "",
  });
  const [statePostDetail, setStatePostDetail] = useState(inittialDetail());
  const [statePost, setStatePost] = useState(inittial());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  const mutation = useMutationHooks((data) => {
    const { title, content, image, idStore } = data;
    const res = PostService.createPost({
      title,
      content,
      image,
      idStore,
    });

    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = PostService.updatePost(id, token, { ...rests });
    return res;
  });

  const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = PostService.deletePost(id, token);
    return res;
  });
  const {
    data: dataDeleted,
    isPending: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = PostService.deleteManyPost(ids, token);
    return res;
  });
  const {
    data: dataDeletedMany,
    isPending: isLoadingDeletedMany,
    isSuccess: isSuccessDelectedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;
  const getAllPosts = async () => {
    const res = await PostService.getAllPost();
    console.log("resdata", res);
    return res;
  };
  const queryPost = useQuery({
    queryKey: ["Posts"],
    queryFn: getAllPosts,
  });
  const { isPending: isLoadingPosts, data: Posts } = queryPost;
  const dataTable =
    Posts?.data.length &&
    Posts?.data.map((Post) => {
      return { ...Post, key: Post._id };
    });
  const fetchGetPostsDetail = async (rowSelected) => {
    const res = await PostService.getDetailsPost(rowSelected);
    if (res?.data) {
      setStatePostDetail({
        title: res?.data.title,
        content: res?.data.content,
        image: res?.data.image,
        idStore: res?.data.idStore,
      });
    }

    setIsLoadingUpdate(false);
  };
  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetPostsDetail(rowSelected);
    }
  }, [rowSelected]);
  useEffect(() => {
    form.setFieldsValue(statePostDetail);
  }, [form, statePostDetail]);

  console.log("resdataDetail", statePostDetail);
  const handleDetailsPost = () => {
    if (rowSelected) {
      fetchGetPostsDetail(rowSelected);
    }
    setIsOpenDrawer(true);
    console.log("rowSelected", rowSelected);
  };

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "20px", cursor: "pointer" }}
          onClick={handleDetailsPost}
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
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Content",
      dataIndex: "content",
      sorter: (a, b) => a.content - b.content,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    } else if (data?.status === "ERR") {
      message.error(data?.message);
    }
  }, [isSuccess]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStatePostDetail({
      title: "",
      content: "",
      image: "",
      idStore: "",
    });
    form.resetFields();
  };
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDelectedMany]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStatePost({
      title: "",
      content: "",
      image: "",
      idStore: "",
    });
    form.resetFields();
  };
  const onFinish = () => {
    const params = {
      title: statePost.title,
      content: statePost.content,
      image: statePost.image,

      idStore: user?.id,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryPost.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStatePost({
      ...statePost,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetail = (e) => {
    setStatePostDetail({
      ...statePostDetail,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdatePost = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...statePostDetail },
      {
        onSettled: () => {
          queryPost.refetch();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeletePost = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryPost.refetch();
        },
      }
    );
  };

  const handleDelteManyPosts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryPost.refetch();
        },
      }
    );
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStatePost({
      ...statePost,
      image: file.preview,
    });
  };

  const handleOnchangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStatePostDetail({ ...statePostDetail, image: file.preview });
  };
  return (
    <div>
      <WrapperHeader>Quản lý Bài đăng</WrapperHeader>
      <Button type="primary" onClick={showModal}>
        Add
      </Button>
      <TableComponent
        columns={columns}
        handleDelteMany={handleDelteManyPosts}
        isLoading={isLoadingPosts || isLoadingDeletedMany}
        data={dataTable}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id);
            }, // click row
          };
        }}
      />

      <Modal
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
      </Modal>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdatePost}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input your title!" }]}
            >
              <InputComponent
                value={statePostDetail["title"]}
                onChange={handleOnchangeDetail}
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
                value={statePostDetail.content}
                onChange={handleOnchangeDetail}
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
                    src={statePostDetail?.image}
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
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeletePost}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default StorePost;
