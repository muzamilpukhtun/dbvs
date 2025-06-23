
    import React from 'react'
    import PublicPolls from '../Components/PublicPolls'
    import MyPolls from '../Components/MyPolls'
    import CreatePoll from '../Components/CreatePoll'
    import CreateUser from '../Components/CreateUser'
import LoginUser from '../Components/LoginUser'

    const page = async ({ params }) => {
        // Await params if it's a Promise (per Next.js dynamic route requirements)
        const resolvedParams = await params;
        const slug = resolvedParams?.slug;

        if (slug === 'public-polls') {
            return <PublicPolls />
        } else if (slug === 'my-polls') {
            return <MyPolls />
        } else if (slug === 'create-poll') {
            return <CreatePoll/>
        } else if (slug === 'create-user') {
            return <CreateUser/>
        } else if (slug === 'login') {
            return <LoginUser/>
        } else if (slug === 'logout') {
            // Clear auth token and redirect to login
            localStorage.removeItem('authToken')
            localStorage.removeItem('userName')
            router.push('/login')
        } else {
            return <div>Page not found</div>
        }
    }

    export default page