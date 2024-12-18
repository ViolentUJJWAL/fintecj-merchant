import React from 'react'
import './Profile.css'
import dp from './img/sunny.png'
import { CgProfile } from "react-icons/cg"
import { Link } from 'react-router-dom'
import { BiLogOut } from "react-icons/bi"
import { useSelector } from 'react-redux'

function Profile() {
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <div className='profile'>
        <div className="profile-upper">
          <div className="profile-img rounded-full overflow-hidden">
            <img src={user?.profile?.url || dp} alt="" />
          </div>
          <div className="profileinfo">
            <h3>{user?.name || 'Guest'}</h3>
            <p>{user?.email || 'No email'}</p>
          </div>
        </div>

        <div className="profile-details z-50">
          <span>
            <Link to="/profile"><span><CgProfile /></span>My Profile</Link>
          </span>
          <span>
            <Link to="/logout"><span><BiLogOut /></span>Logout</Link>
          </span>
        </div>
      </div>
    </>
  )
}

export default Profile