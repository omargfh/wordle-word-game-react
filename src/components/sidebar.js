import { useState, useEffect, useRef } from 'react'

import SocialMedia from './social'

import ToggleButton from './toggle-btn';
import SidebarItem from './sidebar-item';
import PersonalLogo from './personal-logo';

const Sidebar = () => {

  const [sidebarToggled, setsidebarToggled] = useState(false)
  const toggleBar = () => {
    setsidebarToggled(!sidebarToggled)
  }

  return (
    <div className={`sidebar ${sidebarToggled ? "toggled" : ""}`}>
        <div className='sidebar-content'>
          <PersonalLogo />
            <div className='sidebar-list'>
              <ul>
                <SidebarItem img="\home.png" href="http://www.omar-ibrahim.com" sub="Go Home"/>
                <SidebarItem img="\lg.png" href="http://wordle.omar-ibrahim.com" sub="Wordle" active={true}/>
                <SidebarItem img="http://mazebuilder.omar-ibrahim.com/block.png"href="http://mazebuilder.omar-ibrahim.com" sub="Maze Builder"/>
                <SidebarItem img="\ayat.png" href="http://ayat.omar-ibrahim.com" sub="Ayat Search"/>
              </ul>
            </div>
            <div className='sidebar-footer'>
              <SocialMedia />
            </div>
        </div>
        <ToggleButton toggleBar={toggleBar}/>
    </div>
  )
}

export default Sidebar