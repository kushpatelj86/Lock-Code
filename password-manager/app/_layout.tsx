// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/LoginScreen'); // redirect root to Login
  }, []);

  return <Stack />;
}
