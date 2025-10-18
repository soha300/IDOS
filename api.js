// Mock API للاختبار
class MockAPI {
    async login(email, password) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (email === "user@example.com" && password === "password") {
            return {
                success: true,
                user: {
                    id: 1,
                    name: "محمد أحمد",
                    email: email,
                    subscription: "premium",
                    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    joinDate: new Date()
                }
            };
        } else {
            return {
                success: false,
                error: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            };
        }
    }

    async register(userData) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
            success: true,
            user: {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                subscription: "free",
                joinDate: new Date()
            }
        };
    }

    async getUserStats(userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            activeBookings: Math.floor(Math.random() * 5),
            totalConsultations: Math.floor(Math.random() * 20) + 5,
            totalRecords: Math.floor(Math.random() * 15) + 3,
            recentRecords: Math.floor(Math.random() * 5)
        };
    }
}

// جعل API متاحاً globally
window.MockAPI = MockAPI;