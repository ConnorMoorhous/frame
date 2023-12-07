import { Box, Flex, Spinner } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from 'aws-amplify/auth';
import Navbar from "../../components/Navbar/Navbar";
import useAuthStore from "../../store/authStore";

const PageLayout = ({ children }) => {
    const { pathname } = useLocation();
    const authUser = useAuthStore((state) => state.user);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        checkUser();
    }, [authUser]);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const canRenderSidebar = pathname !== "/auth" && user;
    const canRenderNavbar = !user && !loading && pathname !== "/auth";
    const checkingUserIsAuth = !user && loading;

    if (checkingUserIsAuth) return <PageLayoutSpinner />;

    return (
        <Flex backgroundColor={'#222831'} color={'#EEEEEE'} flexDir={canRenderNavbar ? "column" : "row"}>
            {/* Sidebar */}
            {canRenderSidebar ? (
                <Box w={{ base: "70px", md: "240px" }}>
                    <Sidebar />
                </Box>
            ) : null}
            {/* Navbar */}
            {canRenderNavbar ? <Navbar /> : null}
            {/* Page Content */}
            <Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }} mx={"auto"}>
                {children}
            </Box>
        </Flex>
    );
};

export default PageLayout;

const PageLayoutSpinner = () => {
    return (
        <Flex flexDir='column' h='100vh' alignItems='center' justifyContent='center'>
            <Spinner size='xl' />
        </Flex>
    );
};
