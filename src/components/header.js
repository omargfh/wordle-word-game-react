import { useState, useEffect, useRef } from 'react'

import Reset from '../reset.png'
import SocialMedia from './social'

import ToggleButton from './toggle-btn';
import SidebarItem from './sidebar-item';
import PersonalLogo from './personal-logo';
import Sidebar from './sidebar';

const Header = (props) => {

  return (
    <>
    <header>
        <Sidebar />
        <div className='title'>Wordle</div>
        <div className='header-btn green' onClick={props.reset}>
        <img src={Reset}></img>
        </div>
    </header>
    </>
  )
}

export default Header