import classes from './header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom';
import { setOptions } from 'filepond';

const Header = () => {
    const navigate = useNavigate();

    const notloggedinpic = "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80";

    const [pic, setPic] = useState(notloggedinpic);

    const [user, setUser] = useState(null);


    const auth = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose1 = () => {
        setAnchorEl(null);
        navigate('/panel')
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlelogout = async () => {


        const token = localStorage.getItem('token');
        // console.log('logout token => ', token);

        axios.defaults.headers.common['authorisation'] = `Bearer ${token}`;


        //! here we also need to make the api call to remove the cookie storing user info at server side.

        await axios.get('http://localhost:4001/api/v1/user/logout').then((response) => {
            console.log(response);

            if (response.data.status == 'success') {
                alert('logout successful');
                //* if logout is successful nullifying the localstorage token and user info that has been set.
                localStorage.setItem('token', null);
                // localStorage.setItem('userinfo', null);
                localStorage.removeItem('userinfo');
                setUser(null);
                setPic(notloggedinpic)
                setAnchorEl(null)
                navigate('/')
            }
        }).catch((err) => {
            console.log('logout error => ', err);
        })


    }

    const handleClose3 = () => {
        setAnchorEl(null)
        navigate('/login')
    }
    const movetohome = () => {
        navigate('/')
    }

    useEffect(() => {

        let myuser = localStorage.getItem('userinfo');

        console.log('user => ', user);
        console.log('myuser => ', myuser);

        if (myuser && user == null) {
            console.log('i am here')
            myuser = JSON.parse(localStorage.getItem('userinfo'));
            setUser(myuser);
            setPic(myuser.profilePic.url)
        }
    }, [user, pic])


    return (
        <div className={classes.header}>
            <img className={`${classes.image1} cursor-pointer`} src="https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80" onClick={movetohome}></img>


            <div className={`${classes.search}`}>



                <input className={classes.input} placeholder="Search your question"></input>
                <div className={classes.searchIcon}>
                    <FontAwesomeIcon className={classes.icon} icon={faSearch} />
                </div>

            </div>

            <img className={classes.image2} src={pic} onClick={handleClick}></img>
            {/* <img className={classes.image2} src={auth.user.profilePic.url} onClick={handleClick}></img> */}

            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleClose1}>Profile</MenuItem>
                {user ? <MenuItem onClick={handlelogout}>Logout</MenuItem> : <MenuItem onClick={handleClose3}>LogIn</MenuItem>}
            </Menu>
        </div>
    )
}

export default Header;