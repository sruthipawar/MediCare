import React, { Children, useEffect } from 'react'
import "../styles/LayoutStyles.css"
import {Link,useNavigate,useLocation} from 'react-router-dom'
import { adminMenu, userMenu} from '../Data/data';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, message } from 'antd';
import { fetchUser } from '../api';
import { setUser } from '../redux/features/userSlice';
export default function Layout({children})
 {
  const { user} = useSelector(state => state.user);
  const dispatch=useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser();
        
      
        dispatch(setUser(user));
      } catch (error) {
        // Handle error scenarios
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);
  
    
   // console.log(user?.name)
       
  const location=useLocation()
  const navigate=useNavigate()
  const handleLogout=()=>{
    localStorage.clear()
   message.success("Logout Successfully")
    navigate("/login");
  }
  //doctor menu
   const doctorMenu=[
    {
    name:"Home",
    path:"/",
    icon:"fa-solid fa-house",

},
{
    name:"Appointments",
    path:"/doctor-appointments",
    icon:"fa-solid fa-list",
},

{
    name:"Profile",
    path:`/doctor/profile/${user?._id}`,
    icon:"fa-solid fa-user",
},

]
     
    var SidebarMenu =userMenu;

    if(user?.data?.isAdmin)
      SidebarMenu=adminMenu;
      else if(user?.data?.isDoctor)
      SidebarMenu=doctorMenu;

  
     
  return (
    <>
      <div className="main">
      <div className="Layout">
      <div className="sidebar">
      <div className="logo"> 
      <h6>
        DOCAPP
      </h6>
      <hr/>
      </div>
      
      <div className="menu">{SidebarMenu.map((menu)=>{
        const isActive=location.pathname===menu.path;
         
        return(
          <>
           <div className={`menu-item ${isActive && "active"}`}>
            <i className={menu.icon}></i>
            <Link to={menu.path}>
              {menu.name}
            </Link>
          </div>
          </>
        )
      })}
      <div className={`menu-item `} onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <Link to="/login">
              Logout
            </Link>
          </div>
      </div>
      </div>
        <div className="content">
        <div className="header">
        <div className="header-content" style={{cursor:"pointer"}}>
            
        <Badge count={user &&  user.data?.notification.length}
          onClick={() =>{
            navigate("/notification")
          }}>
        <i className="fa-solid fa-bell"></i>
    </Badge>
        
        <Link to="/">{user &&  user.data?.name}</Link>
        </div>
        </div>
        <div className="body">{children}</div>
        </div>
        </div>
      </div>
    </>
  )
}

