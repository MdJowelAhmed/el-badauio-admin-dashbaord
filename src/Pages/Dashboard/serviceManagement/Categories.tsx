import { useMemo, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Tag, Upload, ConfigProvider } from "antd";
import type { TableProps } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

type Category = {
  id: string;
  title: string;
  image: string;
};

const initialCategories: Category[] = [
  { id: "cat-tiles", title: "Tiles", image: "https://picsum.photos/seed/tiles/80/80" },
  { id: "cat-flooring", title: "Flooring", image: "https://picsum.photos/seed/flooring/80/80" },
  { id: "cat-painting", title: "Painting", image: "https://picsum.photos/seed/painting/80/80" },
];

const Categories = () => {
  const categories: Category[] = initialCategories;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const categoryColumns: TableProps<Category>["columns"] = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src: string) => <img src={src} alt="thumb" className="w-12 h-12 rounded object-cover border" />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue({
                title: record.title,
                image: [{ uid: record.id, url: record.image, name: "image" }],
              });
              setOpen(true);
            }}
          >
            <FiEdit />
          </Button>
          <Button danger disabled>
            <FiTrash2 />
          </Button>
        </Space>
      ),
    },
  ];

  const onAddClick = () => {
    setEditingId(null);
    form.resetFields();
    setOpen(true);
  };

  const onSubmit = () => {
    setOpen(false);
  };

  const header = useMemo(
    () => (
      <span className="flex items-center gap-2">
        Categories <Tag color="#3f51b5" style={{ color: "#fff" }}>{categories.length}</Tag>
      </span>
    ),
    [categories]
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl my-7 font-bold text-[#210630]">Category Management</h2>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#210630]">{header}</h3>
          <Button type="primary" onClick={onAddClick}>
            <FaPlus /> Add Category
          </Button>
        </div>
        <ConfigProvider theme={{ components: { Table: { headerBg: "#fff4e5" } } }}>
          <Table<Category> rowKey="id" dataSource={categories} columns={categoryColumns} pagination={{ pageSize: 6 }} />
      </ConfigProvider>
    </div>

      <Modal open={open} title={editingId ? "Edit Category" : "Add Category"} onCancel={() => setOpen(false)} onOk={onSubmit} okText={editingId ? "Save" : "Create"}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}> 
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} rules={[{ required: true }]}> 
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} accept="image/*">Upload</Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
