import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import { LoadingPage } from '../components/Loading';

import { api, type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  if(!user) return null;

  return (
  <div className="flex gap-3 w-full">
    <Image 
      src={user.profileImageUrl} 
      alt="your profile image" 
      className="h-14 w-14 rounded-full"
      width={56}
      height={56}
    />
    <input 
      placeholder="Type some emojis!" 
      className="bg-transparent grow outline-none"
    />
  </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="border-b border-slate-400 p-4 flex gap-3">
      <Image 
        src={author.profileImageUrl} 
        alt={`${author.username}'s profile picture`} 
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span className="font-thin flex gap-1">
            <span>·</span>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </span>
        </div>
        {post.content}
      </div>
      
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if(postsLoading) return <LoadingPage />;

  if(!data) return <div>Something went horribly wrong fetching data</div>

  return (
    <div className="flex flex-col"> 
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // start fetching ASAP
  api.posts.getAll.useQuery();

  // return empty div if user isn't loaded yet
  if(!userLoaded) return <div/>

  return (
    <>
      <Head>
        <title>Greg`&apos;`s Create T3 App</title>
        <meta name="description" content="Twit t3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
      <div className="h-full w-full md:max-w-2xl border-x border-slate-400">
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
          {!!isSignedIn && <SignOutButton />}
        </div>
        <Feed />
      </div>
      </main>
    </>
  );
};

export default Home;
