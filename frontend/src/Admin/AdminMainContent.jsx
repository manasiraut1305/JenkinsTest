import React from 'react'
import {
  MdSearch,
  MdPerson,
  MdSettings,
  MdNotifications,
  MdLogout,
} from "react-icons/md";

const AdminMainContent = () => {
  return (
    <div>
      <main className="main-content">
      <header className="main-content-header pt-3">
        
        <div className="header-right">
          <div className="header-icons">
            {/* Click handler for profile icon */}
            {/* <MdPerson
              className="header-icon"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            /> */}
            {/* Click handler for logout icon to show confirmation modal */}
            {/* <MdLogout
              className="header-icon"
              onClick={handleLogoutClick}
              style={{ cursor: "pointer" }}
            /> */}
          </div>
        </div>
      </header>

      {/* <div className="dashboard-grid">
        {activeContent === "" && <EngineerStat />}
        {activeContent === "EngineerAssignedTickets" && (
          <EngineerAssignedTicket />
        )}
        {activeContent === "EngineerApprovedTickets" && (
          <EngineerApprovedTicket />
        )}
        {activeContent === "EngineerResolvedTickets" && (
          <EngineerResolvedTicket />
        )}
      </div> */}



      {/* Logout Confirmation Modal */}
      {/* <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
        dialogClassName="custom-modal" // Apply custom styling if defined in Styles.css
      >
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title style={{ color: "white" }}>
            🔒 Confirm Logout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="text-dark"
          style={{ fontSize: "1rem", padding: "20px" }}
        >
          <p>Are you sure you want to log out?</p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button
            onClick={handleLogout}
            style={{
              backgroundColor: "#4682B4",
              borderColor: "#4682B4",
              color: "white",
              fontWeight: "500",
            }}
            className="px-4"
          >
            Yes, Logout
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowLogoutModal(false)}
            className="px-4"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal> */}
    </main>
    </div>
  )
}

export default AdminMainContent
