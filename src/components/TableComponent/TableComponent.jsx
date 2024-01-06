import React, { useState } from "react";
import { Divider, Radio, Table } from "antd";
import Loading from "../LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from "react";

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
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "action");
    return arr;
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };
  const handleDeleteAll = () => {
    console.log(`selectedRowKeys: ${rowSelectedKeys}`);
    handleDelteMany(rowSelectedKeys);
  };

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
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
        <button
          style={{
            outline: "none",
            border: "none",
            padding: "13px 20px",
            borderRadius: "8px",
            fontWeight: "500",
            marginBottom: "20px",
            backgroundColor: "#18c418de",
            color: "white",
          }}
          onClick={exportExcel}
        >
          Export Excel
        </button>
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
