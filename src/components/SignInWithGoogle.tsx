"use client";

import { useAuth } from '../lib/hooks/useAuth';
import Image from 'next/image'

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      <Image
        src="/google-logo.png"
        alt="Google Logo"
        width={20}
        height={20}
      />
      <span>Sign in with Google</span>
    </button>
  );
}
