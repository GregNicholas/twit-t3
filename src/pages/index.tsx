import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { SignInButton, SignIn, useUser, SignOutButton } from "@clerk/nextjs";


import { api } from "~/utils/api";

const Home: NextPage = () => {

  const user = useUser();
  return (
    <>
      <Head>
        <title>Greg`&apos;`s Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      <div>
        <div>
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && <SignOutButton />}
        </div>
      </div>
      </main>
    </>
  );
};

export default Home;
