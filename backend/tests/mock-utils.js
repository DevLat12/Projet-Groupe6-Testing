// Données mockées en mémoire
export let mockUsers = [];

// Fonctions de seed
export const seedUsers = async () => {
    mockUsers = [
        {
            id: 1,
            name: "Admin",
            password: "admin123",
        },
        {
            id: 2,
            name: "User",
            password: "user123",
        },
    ];
};

export const clearDatabase = async () => {
    mockUsers = [];
};