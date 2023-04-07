import LayoutProvider from "$/layouts";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { domAnimation, LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import client from "$/apollo-client";
import { QueryClient, QueryClientProvider } from "react-query";

function MyApp({ Component, pageProps, router }: AppProps) {
  const preferred = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferred);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
    },
  });

  return (
    <>
      <Head>
        <title>МУИС туслах систем</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <LazyMotion strict features={domAnimation}>
            <ColorSchemeProvider
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
            >
              <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                  colorScheme,
                  loader: "bars",
                  primaryColor: "blue",
                  fontFamily: "'Raleway', sans-serif",
                  fontFamilyMonospace: "'Raleway', sans-serif",
                  headings: { fontFamily: "'Raleway', sans-serif" },
                }}
              >
                <NotificationsProvider autoClose={2000} position="top-center">
                  <ModalsProvider>
                    <LayoutProvider router={router}>
                      <Component {...pageProps} />
                    </LayoutProvider>
                  </ModalsProvider>
                </NotificationsProvider>
              </MantineProvider>
            </ColorSchemeProvider>
          </LazyMotion>
        </QueryClientProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
