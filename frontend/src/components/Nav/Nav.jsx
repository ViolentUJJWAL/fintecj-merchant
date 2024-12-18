import React from 'react'
import './Nav.css'
import { NavLink } from 'react-router-dom'
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { MdOutlineInventory } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { MdReviews, MdPerson } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { MdHelp } from "react-icons/md";
import { IoMdLogOut, IoMdWallet } from "react-icons/io";

function Nav() {
  return (
    <nav className='bg-blue-900'>
      <div className="nav-container">
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><RiDashboardHorizontalFill /></span>
            <span className='link-text'>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/inventory" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><MdOutlineInventory /></span>
            <span className='link-text'>Inventory</span>
          </NavLink>

          <NavLink 
            to="/orders" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><FaBoxArchive /></span>
            <span className='link-text'>Orders</span>
          </NavLink>

          <NavLink 
            to="/reviews" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><MdReviews /></span>
            <span className='link-text'>Reviews</span>
          </NavLink>

          <NavLink 
            to="/customer" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><MdPerson /></span>
            <span className='link-text'>Customers</span>
          </NavLink>

          <NavLink 
            to="/myqr" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><HiDocumentReport /></span>
            <span className='link-text'>MyQR</span>
          </NavLink>

          <NavLink 
            to="/wallet" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><IoMdWallet /></span>
            <span className='link-text'>Wallet</span>
          </NavLink>
        </div>

        <div className="bottom-nav">
          <NavLink 
            to="/help" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><MdHelp /></span>
            <span className='link-text'>Help</span>
          </NavLink>

          <NavLink 
            to="/logout" 
            className={({ isActive, isPending }) => 
              isPending ? "nav-link pending-link" : 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className='link-icon'><IoMdLogOut /></span>
            <span className='link-text'>Logout</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Nav