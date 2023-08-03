/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthentication"
import { useEffect } from "react";

function ProtectedRoute({children}) {
    const {is_authenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(function() {
        if(!is_authenticated) navigate('/');
    } ,[is_authenticated , navigate]);
    
    return (
        is_authenticated? children : null
    )
}

export default ProtectedRoute
