import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserGoogle } from "../../actions/userAction";


export default function GoogleLogin () {
  const userState = useSelector(store => store.auth.userInfo)
  const history = useHistory();
  const dispatch = useDispatch();
  
  
  useEffect(() => {
    let query = window.location.search;
    dispatch(loginUserGoogle(query))
  }, [dispatch])
  
  useEffect(() => {
    if(userState){
      history.push('/')
    }
  }, [history, userState])
  
  return (
    <div className='container'>
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  )
}


