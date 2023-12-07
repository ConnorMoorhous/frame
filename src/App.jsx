import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useState, useEffect } from "react";
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

function App() {
    const [authUser, setAuthUser] = useState(null);

    Hub.listen('auth', ({ payload }) => {
        switch (payload.event) {
            case 'signedIn':
                checkCurrentUser();
                break;
            case 'signedOut':
                setAuthUser(null);
                break;
            default:
                break;
        }
      });

    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        try {
            const user = await getCurrentUser();
            setAuthUser(user);

        } catch {
            setAuthUser(null);
        }
    };

    return (
        <PageLayout>
            <Routes>
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/auth' />} />
                <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
                <Route path='/:username' element={<ProfilePage />} />
            </Routes>
        </PageLayout>
    );
}


export default App;
