import { Button, ConfigProvider, Table } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { useRecentProjectQuery } from "@/redux/apiSlices/dashboardSlice";

interface Order {
  projectId: string;
  clientName: string;
  artisan: string;
  status: string;
  estimatedAmount: number;
  createdAt: string;
  key?: string;
}

const RecentActiveProject = () => {
const {data:recentProject}=useRecentProjectQuery(null)
console.log("Recent Project", recentProject);

  // Dummy data for salon orders
  const dummyOrders: Order[] = [
    {
      projectId: "ORD001",
      clientName: "John Doe",
      artisan: "Nolan Noa",
      status: "accepted",
      estimatedAmount: 56550,
      createdAt: "2024-12-01T10:00:00Z",
    },
    {
      projectId: "ORD002",
      clientName: "Jane Smith",
      artisan: "Nolan Noa",
      status: "pending",
      estimatedAmount: 80000,
      createdAt: "2024-12-03T14:00:00Z",
    },
    {
      projectId: "ORD003",
      clientName: "Alice Johnson",
      artisan: "Nolan Noa",
      status: "completed",
      estimatedAmount: 40000,
      createdAt: "2024-12-05T09:30:00Z",
    },
    {
      projectId: "ORD004",
      clientName: "Bob Brown",
      artisan: "Nolan Noa",
      status: "completed",
      estimatedAmount: 120000,
      createdAt: "2024-12-06T12:15:00Z",
    },
    {
      projectId: "ORD005",
      clientName: "Charlie Davis",
      artisan: "Nolan Noa",
      status: "completed",
      estimatedAmount: 60000,
      createdAt: "2024-12-08T08:45:00Z",
    },
  ];

  const data = dummyOrders.slice(0, 4).map((order, index) => ({
    ...order,
    key: order.projectId || index.toString(),
  }));

  const formattedData =
    recentProject?.data?.map((item: any) => ({
      key: item._id,
      projectId: item.projectCode,
      clientName: `${item?.userId?.firstName || ""} ${
        item?.userId?.lastName || ""
      }`,
      artisan: "", // Backend doesn't provide artisan
      estimatedAmount: item.totalWithVat,
      status: item.status?.toLowerCase(),
      createdAt: item.createdAt || null, // API doesn't include createdAt
    })) || [];

 const columns = [
    {
      title: "Project Number",
      dataIndex: "projectId",
      key: "projectId",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Artisan",
      dataIndex: "artisan",
      render: (text: string) => text || "Not Assign yet",
      key: "artisan",
    },
    {
      title: "Estimated Amount",
      dataIndex: "estimatedAmount",
      key: "estimatedAmount",
      render: (text: number) => `$${text}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: { [key: string]: { label: string; color: string } } = {
          accepted: { label: "Accepted", color: "green" },
          pending: { label: "Pending", color: "orange" },
          completed: { label: "Completed", color: "blue" },
          new: { label: "New", color: "#f59e0b" },
        };

        const current = statusMap[status] || {
          label: status,
          color: "gray",
        };

        return (
          <span
            className="px-2 py-1 rounded-full text-white font-bold"
            style={{ backgroundColor: current.color }}
          >
            {current.label}
          </span>
        );
      },
    }
    // {
    //   title: "Order Date",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (date: string) =>
    //     date ? moment(date).format("Do MMM, YYYY") : "N/A",
    // },
  ];

  return (
    <div className="border bg-white  p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h4 className="mb-2 text-xl font-semibold">Recent Active Projects</h4>
        {/* <Link to={"/analytics"}>
          <Button className="bg-secondary border-secondary">View All</Button>
        </Link> */}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#fff4e5",
            },
          },
        }}
      >
        <Table columns={columns} pagination={false} dataSource={formattedData || []} />
      </ConfigProvider>
    </div>
  );
};

export default RecentActiveProject;
