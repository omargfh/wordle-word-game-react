import { useState, useEffect, useRef } from 'react'

import Reset from '../reset.png'
import SocialMedia from '../socialmedia'

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = (props) => {

  const [sidebarToggled, setsidebarToggled] = useState(false)
  const toggleBar = () => {
    setsidebarToggled(!sidebarToggled)
  }

  return (
    <header>
        <div className={`sidebar ${sidebarToggled ? "toggled" : ""}`}>
        <div className='sidebar-content'>
            <div className='sidebar-btn'>
            <FontAwesomeIcon icon={faHome} className='icon'/>
            <a href="http://www.omaribrahim.tech">Go Home</a>
            </div>
            <SocialMedia />
        </div>
        <div className={`header-btn green close ${sidebarToggled ? "change" : ""}`} onClick={toggleBar}>
            <div className='bars'>
            <div key={1} className="bar1"></div>
            <div key={2} className="bar2"></div>
            <div key={3} className="bar3"></div>
            </div>
        </div>
        </div>
        <div className='title'>Wordle</div>
        <div className='header-btn green' onClick={props.reset}>
        <img src={Reset}></img>
        </div>
    </header>
  )
}

export default Header