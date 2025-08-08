import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import loginImage from '../../assets/login_img.jpg';

const Login = () => {
    const { signIn, signInWithGoogle, signInWithGitHub, loading, setLoading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleLoginSuccess = (user) => {
        const userInfoForToken = { email: user.email };
        axiosPublic.post('/jwt', userInfoForToken)
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem('access-token', res.data.token);
                    setLoading(false);
                    Swal.fire({
                        title: "Login Successful!",
                        text: "Welcome back!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    navigate(from, { replace: true });
                }
            });
    };

    const handleSocialLogin = (socialProvider) => {
        socialProvider()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    image: result.user?.photoURL,
                    role: 'user'
                };
                axiosPublic.post('/users', userInfo)
                    .then(() => {
                        handleLoginSuccess(result.user);
                    });
            })
            .catch(error => {
                let errorMessage = "Could not complete sign-in. Please try again.";
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = "Sign-in cancelled. Please try again.";
                }
                toast.error(errorMessage);
                setLoading(false);
            });
    };

    const onSubmit = (data) => {
        signIn(data.email, data.password)
            .then((result) => {
                handleLoginSuccess(result.user);
            })
            .catch(error => {
                let errorMessage = "An unexpected error occurred. Please try again.";
                switch (error.code) {
                    case 'auth/invalid-credential':
                    case 'auth/wrong-password':
                    case 'auth/user-not-found':
                        errorMessage = "Incorrect email or password. Please check your credentials and try again.";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Too many failed login attempts. Please try again later.";
                        break;
                    default:
                        break;
                }
                toast.error(errorMessage);
                setLoading(false);
            });
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="relative flex w-full max-w-4xl mx-auto overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="hidden md:block md:w-1/2">
                    <img
                        src={loginImage}
                        alt="A happy pet"
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="w-full p-8 md:w-1/2 text-black dark:text-white">
                    <h2 className="text-center text-3xl font-extrabold text-[var(--color-primary)]">
                        Sign in to your account
                    </h2>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="email" className="mb-1 font-semibold">Your Email</Label>
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email", { required: "Must enter your email address" })}
                            />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-1 font-semibold">Your Password</Label>
                            <TextInput
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", { required: "Must enter your password" })}
                            />
                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[var(--color-accent)] enabled:hover:bg-gradient-to-r from-[#56B4D3] to-[#02AAB0]"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" /> : "Sign In"}
                        </Button>
                    </form>

                    <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                        <p className="mx-4 mb-0 text-center font-semibold">Or</p>
                    </div>

                    <div className="space-y-3">
                        <Button onClick={() => handleSocialLogin(signInWithGoogle)} className="w-full" color="gray" disabled={loading}>
                            <FaGoogle className="mr-3 h-4 w-4" />
                            Continue with Google
                        </Button>
                        <Button onClick={() => handleSocialLogin(signInWithGitHub)} className="w-full" color="gray" disabled={loading}>
                            <FaGithub className="mr-3 h-4 w-4" />
                            Continue with GitHub
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        New to Nexyn Pets?{' '}
                        <Link to="/register" className="font-medium text-[var(--color-accent)] hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
