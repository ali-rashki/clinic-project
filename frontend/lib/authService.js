export const authService = {
    login: async (username, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            const data = await response.json();
            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
            }
            return data;
        } catch (error) {
            console.error("❌ Login error:", error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            console.log("📤 [authService] register request:", userData);
            const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            console.log("📤 [authService] register status:", response.status);

            // اول text رو بگیر تا ببینیم چی برگشت داده شده
            const text = await response.text();
            console.log("📤 [authService] raw response:", text);

            // سعی کن JSON parse کنی
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("❌ [authService] not JSON:", text);
                throw new Error("Server returned non-JSON response");
            }

            console.log("📤 [authService] register response data:", data);
            if (response.ok) {
                if (data.tokens?.access) {
                    localStorage.setItem('access_token', data.tokens.access);
                    localStorage.setItem('refresh_token', data.tokens.refresh);
                }
                return data;
            } else {
                console.error("❌ [authService] register error response:", data);
                throw data;
            }
        } catch (error) {
            console.error("❌ [authService] register error:", error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/accounts/profile/', {
                headers: {'Authorization': `Bearer ${token}`}
            });
            return await response.json();
        } catch (error) {
            console.error("❌ GetCurrentUser error:", error);
            throw error;
        }
    },

    isAuthenticated: () => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('access_token');
        }
        return false;
    },
};