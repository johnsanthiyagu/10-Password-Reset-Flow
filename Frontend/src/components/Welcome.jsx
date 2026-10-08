import { useAuth } from "../utility/AuthContext";

const Welcome = () => {
  const { user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 pt-12">
      <section className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Welcome{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-gray-600">You are now logged in.</p>
      </section>
    </main>
  );
};

export default Welcome;
