import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { resolvers } from "./resolvers";
import { ListingAPI } from "./datasources/listing-api";

const typeDefs = gql(
    readFileSync(path.join(__dirname, "schema.graphql"), "utf8")
);

async function startServer() {
    const server = new ApolloServer({ typeDefs,  resolvers});

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async () => {
            const { cache } = server;
            return {
                dataSources: {
                    listingAPI: new ListingAPI(),
                },
            };
        },
    });

    console.log(`Server ready at ${url}`);
}

startServer();