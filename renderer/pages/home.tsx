import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Flex } from "@chakra-ui/react";

function home() {
  return (
    <div>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <Flex>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/dailyboard" as="/dailyboard">
            <a>Go to timetable</a>
          </Link>
        </p>
        <img src="/images/logo.png" />
      </Flex>
    </div>
  );
}

export default home;
