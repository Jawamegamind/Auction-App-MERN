import React, { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

// This component is responsible for rendering the layout for protected routes.
// Within the component, it uses the useContext hook to access the user context.
// It also uses the useNavigate hook from React Router to handle navigation.
// The component checks if there is a user authenticated (i.e., user exists in the context).
// If there is a user, it renders the child components wrapped by the Outlet component, allowing nested routes to be rendered.
// If there is no user (i.e., user is not authenticated), it redirects the user to the '/' route using the Navigate component.

function ProtectedLayout() {

    const navigate = useNavigate();

    const { user } = useContext(UserContext);

    if (user) {
        return (

            <div>
                <Outlet />
            </div>
        )
    }
    else {
       
        return <Navigate to="/" />; 
        
    }

}

export default ProtectedLayout
