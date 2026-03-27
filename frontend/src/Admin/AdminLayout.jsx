// import AdminSidebar from "./AdminSidebar";

// export default function AdminLayout({ children }) {
//   return (
//     <div className="admin-layout">
//       <AdminSidebar />
//       <div className="admin-content">
//         {children}
//       </div>
//     </div>
//   );
// }

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
