import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../../models/user.model'; // correspond à `default`
import {
  mockUsers,
  seedUsers,
  clearDatabase,
} from "../mock-utils";

describe("User (mocked)", () => {
  beforeEach(async () => {
    await clearDatabase();
    await seedUsers();

    vi.spyOn(User, "findAll").mockImplementation(async () => {
      return mockUsers;
    });

    vi.spyOn(User, "destroy").mockImplementation(async (id) => {
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) return false;
      mockUsers.splice(index, 1);
      return true;
    });

    vi.spyOn(User, "findOne").mockImplementation(async (name) => {
      return mockUsers.find((u) => u.name === name) || null;
    });

    vi.spyOn(User, "create").mockImplementation(
      async ({ name, password }) => {
        const id = mockUsers.length + 1;
        const user = { id, name, password };
        mockUsers.push(user);
        return user;
      }
    );

    vi.spyOn(User, "update").mockImplementation(
      async (id, userData) => {
        const user = mockUsers.find((u) => u.id === id);
        if (!user) return false;
        Object.assign(user, userData);
        return true;
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("doit retourner un utilisateur avec un nom valide", async () => {
    const testName = "Admin";
    const user = await User.findOne(testName);
    expect(user).toBeDefined();
    expect(user.name).toBe(testName);
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("password");
  });

  it("doit créer un nouvel utilisateur", async () => {
    const userData = {
      name: "Nouvel utilisateur",
      password: "newpass123",
    };
    const user = await User.create(userData);
    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user).toHaveProperty("password");
  });

  it("doit mettre à jour le nom d'un utilisateur", async () => {
    const user = await User.findOne("Admin");
    const newName = "SuperAdmin";
    const updated = await User.update(user.id, { name: newName });
    expect(updated).toBe(true);
    const updatedUser = await User.findOne("SuperAdmin");
    expect(updatedUser.name).toBe(newName);
    expect(updatedUser).toHaveProperty("id");
    expect(updatedUser).toHaveProperty("password");
  });

  it("doit retourner tous les utilisateurs", async () => {
    const users = await User.findAll();
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty("id");
    expect(users[0]).toHaveProperty("name");
    expect(users[0]).toHaveProperty("password");
  });

  it("doit supprimer un utilisateur existant", async () => {
    const user = await User.findOne("Admin");
    const result = await User.destroy(user.id);
    expect(result).toBe(true);

    const deletedUser = await User.findOne("Admin");
    expect(deletedUser).toBeNull();
  });

  it("doit échouer à supprimer un utilisateur inexistant", async () => {
    const result = await User.destroy(9999); // id qui n'existe pas
    expect(result).toBe(false);
  });
});