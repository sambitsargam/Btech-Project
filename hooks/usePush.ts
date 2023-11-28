import * as PushApi from "@pushprotocol/restapi"
import { useAccount, useSigner } from "wagmi"
import { ethers } from "ethers"

const usePush = () => {
    const { data: signer } = useSigner()
    const address = useAccount()
    const CHANNEL_ADDRESS = "0x490cf4c9ad7827d5dc09bf07ace6c694e258c89a"
    const optIn = async () => {
        await PushApi.channels.subscribe({
            signer, // signer object from ethers.js
            channelAddress: `eip155:80001:${CHANNEL_ADDRESS}`, // channel address in CAIP
            userAddress: `eip155:80001:${address}`, // user address in CAIP
            onSuccess: () => {
                console.log("opt in success")
            },
            onError: () => {
                console.error("opt in error")
            },
            env: "staging",
        })
    }

    const PK = "0x490cf4c9ad7827d5dc09bf07ace6c694e258c89a"
    const getSigner = () => {
        return new ethers.Wallet(PK)
    }

    const sendNotification = async (recipients: any[]) => {
        const signer = getSigner()
        const array = recipients.map((e: any) => `eip155:80001:${e}`)
        try {
            console.log("inside sendNotification")
            const apiResponse = await PushApi.payloads.sendNotification({
                signer,
                type: 1, // subset
                identityType: 2, // direct payload
                notification: {
                    title: `The actual test notification`,
                    body: `This is a test notification sent by EPNS sdk`,
                },
                // recipients: [...array], // recipient address
                channel: `eip155:80001:${CHANNEL_ADDRESS}`, // your channel address
                env: "staging",
            })

            // apiResponse?.status === 204, if sent successfully!
            console.log("API repsonse: ", apiResponse)
        } catch (err) {
            console.error("Error: ", err)
        }
    }

    const receiveNotifs = async (address: any) => {
        return await PushApi.user.getFeeds({
            user: `eip155:42:${address}`, // user address in CAIP
            env: "staging",
        })
    }

    const hasUserOptedIn = async (address: any) => {
        return await PushApi.user.getSubscriptions({
            user: `eip155:42:${address}`, // user address in CAIP
            env: "staging",
        })
    }

    return {
        sendNotification,
        optIn,
        receiveNotifs,
        hasUserOptedIn,
    }
}

export default usePush