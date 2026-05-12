import { login, logout, isAuthenticated, getUser } from "@/lib/auth";

beforeEach(() => {
  localStorage.clear();
});

describe("login", () => {
  it("returns false when username is empty", () => {
    expect(login("", "secret")).toBe(false);
  });

  it("returns false when password is empty", () => {
    expect(login("alice", "")).toBe(false);
  });

  it("returns false when both fields are whitespace", () => {
    expect(login("  ", "  ")).toBe(false);
  });

  it("returns true for any non-empty credentials", () => {
    expect(login("alice", "hunter2")).toBe(true);
  });

  it("persists auth state in localStorage", () => {
    login("alice", "hunter2");
    expect(isAuthenticated()).toBe(true);
  });

  it("stores the username", () => {
    login("alice", "hunter2");
    expect(getUser()).toEqual({ username: "alice" });
  });
});

describe("logout", () => {
  it("clears auth state", () => {
    login("alice", "hunter2");
    logout();
    expect(isAuthenticated()).toBe(false);
  });

  it("clears user data", () => {
    login("alice", "hunter2");
    logout();
    expect(getUser()).toBeNull();
  });
});
