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
                <SidebarItem img="\home.png" href="http://www.omaribrahim.tech" sub="Go Home"/>
                <SidebarItem img="\lg.png" href="http://wordle.omaribrahim.tech" sub="Wordle" active={true}/>
                <SidebarItem img="http://mazebuilder.omaribrahim.tech/block.png"href="http://mazebuilder.omaribrahim.tech" sub="Maze Builder"/>
                <SidebarItem img="\ayat.png" href="http://ayat.omaribrahim.tech" sub="Ayat Search"/>
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