import { getMe } from '@/api/api-call'
import ProfilePage from '@/components/user/ProfilePage';
export default async function page() {
    const {user} =await getMe();
    return (
       <ProfilePage user={user}/>
    )
}
