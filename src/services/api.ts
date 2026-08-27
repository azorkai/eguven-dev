
const API_BASE = '/api';

export const api = {
    contact: {
        send: async (data: { name: string; email: string; message: string; token: string }) => {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            return response.json();
        },
    },
    posts: {
        getAll: async () => {
            const response = await fetch(`${API_BASE}/posts`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        },
        create: async (data: { title: string; content: string; tags?: string[] }) => {
            const response = await fetch(`${API_BASE}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            return response.json();
        },
        delete: async (id: string) => {
            const response = await fetch(`${API_BASE}/posts/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            return response.json();
        },
    },
};
