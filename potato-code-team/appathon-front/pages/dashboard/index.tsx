import RoomFinderWidget from "$/components/room_finder/room_search";
import { Stack } from "@mantine/core";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Stack>
      <RoomFinderWidget />
    </Stack>
  );
};

export default Home;
