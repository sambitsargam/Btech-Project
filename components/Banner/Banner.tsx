import {
	createStyles,
	Card,
	Avatar,
	Text,
	Button,
	Center,
	Stack,
	Modal,
} from '@mantine/core';
import {
	IconEdit,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
import { CreateUser } from '../CreateUser/CreateUser';
import {useAccount,useEnsName,useEnsAvatar} from "wagmi";
import useLens from "../../hooks/useLens";
import { useContract } from '../../hooks/useContract';

const useStyles = createStyles((theme) => ({
	card: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
	},

	avatar: {
		border: `2px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
		}`,
	},
}));

interface UserCardImageProps {
	image?: string;
	avatar?: string;
	name?: string;
	stats?: any;
	website?: string;
	twitter?: string;
	github?: string;
	designation?: string;
	isOwner?: boolean;
	profId?: string;
}

export function Banner({
	isOwner,
}: UserCardImageProps) {
	const { classes, theme } = useStyles();
	const [stats, setStats] = useState<any>();
	const [opened, setOpened] = useState(false);
	const {address, isConnected, isDisconnected, status} = useAccount();
	const { data: ensName } = useEnsName({ address });
	console.log("ensName", ensName);
	const { data: ensAvatarData } = useEnsAvatar({ address });
	const {getProfile} = useLens()
	const {getAccountHex} = useContract()

	const router = useRouter();
	useEffect(() => {
		if(isDisconnected){
			alert("Please connect your wallet")
			router.push("/")
		}
		console.log("rq",router.query)
		if(router.query.address === undefined){
			return
		}
		const fetchProfile = async () => {
			const prof = await getAccountHex(router.query.address as string)
			if(prof == '') return
			console.log("prof",prof)
			const res = await getProfile(prof as string)
			console.log("res", res)
			setStats(res)
		}
		fetchProfile()
	}, [isConnected, isDisconnected, router.isReady, router.query])
	return (
		<Card p='xl' className={classes.card}>
			<Avatar
				src={stats?.picture.original.url.replace("ipfs://", "https://") + ".ipfs.nftstorage.link"}
				size={160}
				radius={80}
				m='auto'
				className={classes.avatar}
			/>
			<Text align='center' size='lg' weight={500} mt='sm'>
				{stats?.handle || "..."}
			</Text>

			{isOwner &&
				<>
					<Stack m={'md'}>
						<Center mb={0}>
							<Button
								radius='md'
								mt='xl'
								size='md'
								fullWidth={false}
								variant='gradient'
								gradient={{ from: 'indigo', to: 'cyan' }}
								color={
									theme.colorScheme === 'dark'
										? undefined
										: 'dark'
								}
								// onClick={() => {
								// 	handleFollow();
								// }}
								onClick={() => {
									setOpened(true);
								}}
								leftIcon={<IconEdit />}
							>
								Edit Profile
							</Button>
						</Center>
						<Center>
						<h3>Ens Name: {ensName}</h3>
						</Center>
					</Stack>

					<Modal
						opened={opened}
						onClose={() => setOpened(false)}
						size='lg'
					>
						<CreateUser />
					</Modal>
				</>}
		</Card>
	);
}
