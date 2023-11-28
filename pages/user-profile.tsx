import Head from 'next/head';
import {Banner} from '../components/Banner/Banner';
import {useAccount, useProvider, useSigner} from 'wagmi';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Layout} from '../components/Layout/Layout';
import {Stack} from '@mantine/core';
import {CreateUser} from '../components/CreateUser/CreateUser';
import useLens from '../hooks/useLens';

export default function Home() {
    const {address, isConnected, isDisconnected, status} = useAccount();
    const router = useRouter();
    const isOwner = address === router.query.address;
    const [stats, setStats] = useState();
    const [isUserExist, setIsUserExist] = useState(true);

    return (
        <>
            <Layout>
                <Head>
                    <title>Your Profile</title>
                    <meta
                        name='viewport'
                        content='minimum-scale=1, initial-scale=1, width=device-width'
                    />
                </Head>
                {isUserExist ? (
                    <Stack m={'sm'} sx={{height: '100%'}}>
                        <Banner
                            isOwner={isOwner}
                        />
                    </Stack>
                ) : (
                    // <div>user not found</div>
                    <>
                        <CreateUser/>
                    </>
                )}
            </Layout>
        </>
    );
}
