import {ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache} from '@apollo/client'
import {
    AUTHENTICATE_MUTATION,
    CHALLENGE_QUERY,
    CREATE_PROFILE_MUTATION,
    LENS_PROFILE_DETAILS,
    LENS_PROFILE_EXISTS
} from "../constants/graphql/queries";
import {useProvider} from "wagmi";

const APIURL = 'https://api-mumbai.lens.dev/';

const apolloClient = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
})

export default function useLens() {
    const provider = useProvider()
    const login = async (address: `0x${string}`, signer: any) => {
        const response = await apolloClient.query({
            query: gql(CHALLENGE_QUERY),
            variables: {
                address: address
            }
        })
        console.log('Lens example data: ', response)
        const signature = await signer.signMessage(response.data.challenge.text)
        console.log("signature", signature)
        const mutationRes = await apolloClient.mutate({
            mutation: gql(AUTHENTICATE_MUTATION),
            variables: {
                address: address,
                signature: signature
            }
        })

        const httpLink = new HttpLink({ uri: 'https://api-mumbai.lens.dev/' });

        const authLink = new ApolloLink((operation, forward) => {
            // Retrieve the authorization token from local storage.
            const token = mutationRes.data.authenticate.accessToken
            console.log("token", token)

            // Use the setContext method to set the HTTP headers.
            operation.setContext({
                headers: {
                    "x-access-token": token ? `Bearer ${token}` : ''
                }
            });

            // Call the next link in the middleware chain.
            return forward(operation);
        });
        return new ApolloClient({
            link: authLink.concat(httpLink), // Chain it with the HttpLink
            cache: new InMemoryCache()
        })
    }

    const createProfile = async (username: string,  address: `0x${string}`, signer: any, pfp? : string) => {
        const client = await login(address, signer)
        const createProfRes = await client.mutate({
            mutation: gql(CREATE_PROFILE_MUTATION),
            variables: {
                username: username,
                img: pfp,
            }
        })
        console.log("createProfRes", createProfRes)
        const txHash = createProfRes.data.createProfile.txHash
        const txReceipt = await provider.waitForTransaction(txHash)
        console.log("txReceipt", txReceipt)
        return txReceipt
    }

    const profileExists = async (handle: string) =>{
        console.log("handle", handle)
        const response = await apolloClient.query({
            query: gql(LENS_PROFILE_EXISTS),
            variables: {
                name: `${handle}.test`
            }
        })
        console.log("profileExists", response)
        let exists = false
        if(response.data.profile !== null){
            exists = true
        }
        return exists
    }

    const getProfileId = async (handle: string) =>{
        console.log("handle", handle)
        const response = await apolloClient.query({
            query: gql(LENS_PROFILE_EXISTS),
            variables: {
                name: `${handle}.test`
            }
        })
        return response.data.profile.id
    }

    const getProfile = async (hex: string) => {
        const response = await apolloClient.query({
            query: gql(LENS_PROFILE_DETAILS),
            variables: {
                id: hex
            }
        })
        return response.data.profile
    }

    return {
        login,
        createProfile,
        profileExists,
        getProfileId,
        getProfile
    }
}