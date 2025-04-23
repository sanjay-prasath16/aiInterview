import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import PropTypes from 'prop-types';

function PrivateRoute({ element }) {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return element;
}

export default PrivateRoute;

PrivateRoute.propTypes = {
    element: PropTypes.node.isRequired,
};