import React from 'react'
import Header from '../components/Header'
import LeftNav from '../components/LeftNav'
import MainContent from '../components/MainContent'
import Employees from "../admin/pages/users/Users";

export default function Home() {
  return (
    <div className='wrapper-outer d-flex'>
      {
        Config.user.role === 'Admin' && <>
          <div className='side-nav'>
            <LeftNav />
          </div>
          <div className='main-content'>
            <Header />
            <Employees />
          </div>
        </>
      }
    </div>
  )
}
