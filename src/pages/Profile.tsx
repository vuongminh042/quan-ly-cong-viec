import { useAuth } from '../contexts/AuthContext';

function Profile() {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Hồ sơ</h1>

                <div className="space-y-6">
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin tài khoản</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <p className="mt-1 text-gray-900">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
