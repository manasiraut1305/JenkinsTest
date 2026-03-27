import React from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaAward,
  FaFlagCheckered,
  FaNewspaper,
  FaBalanceScaleLeft,
  FaPhotoVideo,
  FaBusinessTime,
  FaAtlassian,
} from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="admin-main d-flex flex-column">
      {/* Header */}
      <header className="px-4 py-3 bg-white border-bottom">
        <h4 className="fw-bold mb-1">Admin Dashboard</h4>
        <small className="text-muted">Quick access</small>
      </header>

      {/* Content */}
      <main className="flex-grow-1 px-4 py-4">
       <div className="row g-4 mt-3">

          {/* Press Release */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/press-release" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaBook size={36} color="#ac2172" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">Press Release</h5>
                  <p className="text-muted">Corporate news releases</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Milestones */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/milestones" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaFlagCheckered size={36} color="#a04e1b" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">Milestones</h5>
                  <p className="text-muted">Track achievements</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Awards */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/awards" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaAward size={36} color="#4c7b47" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">Awards</h5>
                  <p className="text-muted">Achievements and awards</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Tenders */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/tenders" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaBalanceScaleLeft size={36} color="#3613d5" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">Tenders</h5>
                  <p className="text-muted">Available contract bids</p>
                </div>
              </div>
            </Link>
          </div>

          {/* News */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/news" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaNewspaper size={36} color="#7c9b0c" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">News</h5>
                  <p className="text-muted">Official news updates</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Photos */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/photos" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaPhotoVideo size={36} color="#a834eb" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">Photos</h5>
                  <p className="text-muted">Media photo archive</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Financial Progress */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/finance" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaAtlassian size={36} color="#136a8a" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">Financial Progress</h5>
                  <p className="text-muted">Business growth metrics</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Organization */}
          <div className="col-12 col-sm-6 col-md-3">
            <Link to="/admin/organization" className="text-decoration-none">
              <div className="dashboard-card card-white w-100">
                <div className="card-icon">
                  <FaBusinessTime size={36} color="#d67d24" />
                </div>
                <div className="card-content">
                  <h5 className="text-dark">Organization</h5>
                  <p className="text-muted">Organization profile details</p>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
