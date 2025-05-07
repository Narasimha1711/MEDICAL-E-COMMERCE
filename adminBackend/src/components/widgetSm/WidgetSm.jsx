import "./widgetSm.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function WidgetSm() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLatestUsers = async () => {
      try {
        const response = await axios.get("api/user");
        console.log(response);
        // const data = await response.json();
        setUsers(response.data.latestUsers);
      } catch (error) {
        console.error("Error fetching latest users:", error);
      }
    };

    fetchLatestUsers();
  }, []);

  return (
    <>
      <div className="widgetSm">
        <span className="widgetSmTitle">New Join Members</span>
        <ul className="widgetSmList">
          {users.map((user) => (
            <li className="widgetSmListItem" key={user._id}>
              {/* <img
                src={
                  user.image ||
                  "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                }
                alt=""
                className="widgetSmImg"
              /> */}
              <div className="widgetSmUser">
                <span className="widgetSmUsername">{user.username}</span>
                {/* <span className="widgetSmUserTitle">user</span> */}
              </div>
              <span className="widgetSmUserTitle">user</span>
              {/* <button className="widgetSmButton">more info</button> */}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
