import React, { useState } from "react";
import { Divider, Radio, Table } from "antd";
import Loading from "../LoadingComponent/Loading";

// rowSelection object indicates the need for row selection

const TableComponent = (prop) => {
  const {
    selectionType = "checkbox",
    data = [],
    isLoading = false,
    columns = [],
    handleDelteMany,
  } = prop;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };
  const handleDeleteAll = () => {
    console.log(`selectedRowKeys: ${rowSelectedKeys}`);
    handleDelteMany(rowSelectedKeys);
  };
  return (
    <div>
      <Loading isLoading={isLoading}>
        <Divider />
        {!!rowSelectedKeys.length && (
          <div
            style={{
              background: "#1d1ddd",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={handleDeleteAll}
          >
            Xóa tất cả
          </div>
        )}
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          {...prop}
        />
      </Loading>
    </div>
  );
};
export default TableComponent;
