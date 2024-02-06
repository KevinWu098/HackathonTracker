import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
    // async afterAuth(auth, req, evt) {

    //     if (!auth.userId) {
    //         return;
    //     }
    //     // Function to check and update authorization status
    //     await fetch(`${req.nextUrl}/api/user`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             // Include any necessary headers, such as authorization tokens
    //         },
    //         body: JSON.stringify({ userId: auth.userId }),
    //     });
    // },
    publicRoutes: ['/', '/signin', '/signup'], // Define your public routes here
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};