import { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';

import { UserContext } from '@/providers/UserProvider';
import { PlaceContext } from '@/providers/PlaceProvider';

import { getItemFromLocalStorage, setItemsInLocalStorage, removeItemFromLocalStorage } from '@/utils';
import axiosInstance from '@/utils/axios';

// USER
export const useAuth = () => {
    return useContext(UserContext)
}

export const useProvideAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = getItemFromLocalStorage('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Ensure role is stored as a number
            if (parsedUser.role) {
                parsedUser.role = parseInt(parsedUser.role);
            }
            setUser(parsedUser);
        }
        setLoading(false)
    }, [])

    const register = async (formData) => {
        const { name, email, password, phone, role } = formData;
        
        console.log('Sending registration data:', { 
            name, 
            email, 
            password: password ? '********' : undefined,
            phone,
            role
        });
        
        try {
            const { data } = await axiosInstance.post('user/register', {
                name,
                email,
                password,
                phone,
                role
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Registration successful' }
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            return { success: false, message }
        }
    }

    const login = async (formData) => {
        const { email, password, role } = formData;

        try {
            const { data } = await axiosInstance.post('user/login', {
                email,
                password,
                role: parseInt(role)
            });
            if (data.user && data.token) {
                // Ensure role is stored as a number
                if (data.user.role) {
                    data.user.role = parseInt(data.user.role);
                }
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Login successful' }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            return { success: false, message }
        }
    }

    const googleLogin = async (credential, role) => {
        const decoded = jwt_decode(credential);
        try {
            const { data } = await axiosInstance.post('user/google/login', {
                name: `${decoded.given_name} ${decoded.family_name}`,
                email: decoded.email,
                role: parseInt(role)
            });
            if (data.user && data.token) {
                // Ensure role is stored as a number
                if (data.user.role) {
                    data.user.role = parseInt(data.user.role);
                }
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Login successful' }
        } catch (error) {
            console.error('Google login error:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            return { success: false, message }
        }
    }

    const logout = async () => {
        try {
            const { data } = await axiosInstance.get('/user/logout');
            if (data.success) {
                setUser(null);

                // Clear user data and token from localStorage when logging out
                removeItemFromLocalStorage('user');
                removeItemFromLocalStorage('token');
            }
            return { success: true, message: 'Logout successful' }
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Something went wrong!' }
        }
    }

    const uploadPicture = async (picture) => {
        try {
            const formData = new FormData()
            formData.append('picture', picture)
            const { data } = await axiosInstance.post('/user/upload-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const updateUser = async (userDetails) => {
        const { name, password, picture } = userDetails;
        const email = JSON.parse(getItemFromLocalStorage('user')).email
        try {
            const { data } = await axiosInstance.put('/user/update-user', {
                name, password, email, picture
            })
            return data;
        } catch (error) {
            console.log(error)
        }
    }


    return {
        user,
        setUser,
        register,
        login,
        googleLogin,
        logout,
        loading,
        uploadPicture,
        updateUser
    }
}


// PLACES
export const usePlaces = () => {
    return useContext(PlaceContext)
}

export const useProvidePlaces = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPlaces = async () => {
        const { data } = await axiosInstance.get('/places');
        setPlaces(data.places);
        setLoading(false);
    };

    useEffect(() => {
        getPlaces();
    }, [])

    return {
        places,
        setPlaces,
        loading,
        setLoading
    }
}