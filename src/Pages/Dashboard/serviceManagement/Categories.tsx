import { useMemo, useState } from "react";
import { Table, Button, Modal, Input, Space, Tag, Upload, ConfigProvider, Spin, message } from "antd";
import type { TableProps, UploadFile } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery, useUpdateCategoryMutation } from "@/redux/apiSlices/categoryApi";


type Category = {
  _id: string;
  name: string;
  image: string;
};

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);

  // ✅ API Queries & Mutations
  const { data: categoryData, isLoading: isLoadingCategories } = useGetAllCategoriesQuery(null);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  console.log(categoryData);

  const categories = categoryData?.data || [];

  const categoryColumns: TableProps<Category>["columns"] = [
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name" 
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src: string) => (
        <img 
          src={`${src}`} 
          alt="category" 
          className="w-12 h-12 rounded object-cover border" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/80";
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => handleEdit(record)}
            size="small"
          >
            <FiEdit />
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => handleDelete(record._id)} 
            loading={isDeleting}
          >
            <FiTrash2 />
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Category) => {
    setEditingId(record._id);
    setName(record.name);
    setImageFile(null);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Category",
      content: "Are you sure you want to delete this category?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
          message.success("Category deleted successfully!");
        } catch (error) {
          message.error("Failed to delete category");
        }
      },
    });
  };

  const onAddClick = () => {
    setEditingId(null);
    setName("");
    setImageFile(null);
    setOpen(true);
  };

  const onSubmit = async () => {
    if (!name.trim()) {
      message.error("Please enter category name");
      return;
    }

    if (!editingId && !imageFile) {
      message.error("Please upload an image");
      return;
    }

    try {
      if (editingId) {
        // ✅ Update
        await updateCategory({
          id: editingId,
          name,
          image: imageFile?.originFileObj,
        }).unwrap();
        message.success("Category updated successfully!");
      } else {
        // ✅ Create
        await createCategory({
          name,
          image: imageFile?.originFileObj,
        }).unwrap();
        message.success("Category created successfully!");
      }

      setOpen(false);
      setName("");
      setImageFile(null);
    } catch (error: any) {
      message.error(error?.data?.message || "Operation failed");
    }
  };

  const header = useMemo(
    () => (
      <span className="flex items-center gap-2">
        Categories 
        <Tag color="#3f51b5" style={{ color: "#fff" }}>
          {categories.length}
        </Tag>
      </span>
    ),
    [categories.length]
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl my-7 font-bold text-[#210630]">Category Management</h2>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#210630]">{header}</h3>
          <Button 
            type="primary" 
            onClick={onAddClick}
            disabled={isLoadingCategories}
          >
            <FaPlus /> Add Category
          </Button>
        </div>

        {isLoadingCategories ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <ConfigProvider theme={{ components: { Table: { headerBg: "#fff4e5" } } }}>
            <Table<Category>
              rowKey="_id"
              dataSource={categories}
              columns={categoryColumns}
              pagination={{ pageSize: 6 }}
            />
          </ConfigProvider>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editingId ? "Edit Category" : "Add Category"}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText={editingId ? "Save" : "Create"}
        confirmLoading={isCreating || isUpdating}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category Name</label>
            <Input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
              onChange={(info) => {
                setImageFile(info.fileList[0] || null);
              }}
              defaultFileList={
                editingId && !imageFile
                  ? [
                      {
                        uid: editingId,
                        name: "image",
                        status: "done",
                        url: `${categories.find(c => c._id === editingId)?.image || ""}`,
                      } as UploadFile,
                    ]
                  : []
              }
            >
              Upload
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;