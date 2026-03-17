import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const AUTH_STORAGE_KEY = 'auth_user';
const ACCOUNTS_STORAGE_KEY = 'auth_accounts';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface StoredAccount {
  id: string;
  username: string;
  email: string;
  password: string;
}

/** Pre-seeded demo accounts so reviewers can test without registering */
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  { id: 'demo-1', username: 'Alice', email: 'alice@demo.com', password: 'password' },
  { id: 'demo-2', username: 'Bob', email: 'bob@demo.com', password: 'password' },
  { id: 'demo-3', username: 'Charlie', email: 'charlie@demo.com', password: 'password' },
];

async function loadAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await SecureStore.getItemAsync(ACCOUNTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

async function saveAccounts(accounts: StoredAccount[]): Promise<void> {
  await SecureStore.setItemAsync(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function getAllAccounts(custom: StoredAccount[]): StoredAccount[] {
  return [...DEFAULT_ACCOUNTS, ...custom];
}

/** Returns all known users (for cross-user review reads). */
export async function getAllUsers(): Promise<Pick<StoredAccount, 'id' | 'username'>[]> {
  const custom = await loadAccounts();
  return getAllAccounts(custom).map(({ id, username }) => ({ id, username }));
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,

  login: async (email, password) => {
    const custom = await loadAccounts();
    const all = getAllAccounts(custom);
    const account = all.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );

    if (!account) {
      throw new Error('No account found with this email. Please register first.');
    }
    if (account.password !== password) {
      throw new Error('Incorrect password.');
    }

    const user: User = { id: account.id, username: account.username, email: account.email };
    await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({ user, isLoggedIn: true });
  },

  register: async (username, email, password) => {
    const custom = await loadAccounts();
    const all = getAllAccounts(custom);
    const exists = all.some((a) => a.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const account: StoredAccount = {
      id: Date.now().toString(),
      username,
      email,
      password,
    };

    await saveAccounts([...custom, account]);

    const user: User = { id: account.id, username: account.username, email: account.email };
    await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({ user, isLoggedIn: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
    set({ user: null, isLoggedIn: false });
  },

  restoreSession: async () => {
    try {
      const stored = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
      if (stored) {
        const user: User = JSON.parse(stored);
        set({ user, isLoggedIn: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
