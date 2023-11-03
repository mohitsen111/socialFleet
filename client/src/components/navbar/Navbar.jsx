import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import useMakeRequest from "../../hook/useFetch";
import SearchResultsContainer from "../comments/searchContainer/searchResultsContainer";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const inputRef = useRef("");
  const makeRequest = useMakeRequest();
  const handleSearch = () => {
    console.log(inputRef.current.value);
    const username = inputRef.current.value;
    makeRequest
      .post("/users/find", { username })
      .then((res) => setSearchResult(res.data))
      .catch((error) => {
        console.log("search Error");
        console.log(error.response.status);
        if (error.response.status === 404) {
          setSearchResult([]);
        }
        console.log(error);
      });
    setIsSearch(true);
  };
  const handleEnter = (e) => {
    if (e.key === "Enter" && inputRef.current.value.length > 0) {
      console.log("Enter pressed");
      handleSearch();
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="navbar">
        <div className="left">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span>The Social App </span>
          </Link>
          <HomeOutlinedIcon />
          {darkMode ? (
            <WbSunnyOutlinedIcon onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon onClick={toggle} />
          )}
          <GridViewOutlinedIcon />
          <div className="search">
            <input
              type="text"
              placeholder="Search..."
              ref={inputRef}
              onKeyUp={handleEnter}
            />
            <button onClick={handleSearch}>
              <SearchOutlinedIcon />
            </button>
          </div>
        </div>
        <div className="right">
          <PersonOutlinedIcon />
          <EmailOutlinedIcon />
          <NotificationsOutlinedIcon />
          <div className="user">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <span>{currentUser.name}</span>
          </div>
        </div>
      </div>
      {isSearch && (
        <SearchResultsContainer data={searchResult} setIsSearch={setIsSearch} />
      )}
    </div>
  );
};

export default Navbar;
