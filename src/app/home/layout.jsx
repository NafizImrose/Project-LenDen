import Navbar from "@/Components/Navbar/Navbar";
import Sidebar from "@/Components/Sidebar/Sidebar";

const HomeLayout = ({ children }) => {
  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default HomeLayout;
