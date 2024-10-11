# UI

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

I am trying something new by managing page views by state and different components - this will reduce the number of different web page the user has to load which cause a white screen if you have slow internet, this way we can show a loading element while it is getting the info from the backend

I am trying to use MaterialUI for this project to make sure that it is phone friendly

I am using cypress to test our UI, you can run the scripts in the package.json to run the tests, don't forget to start the dev server first
