import {
	createStyles,
	Card,
	Image,
	Text,
	Group,
	RingProgress,
	Button,
	Center,
	Badge,
	ActionIcon,
} from '@mantine/core';
import { IconCurrencyEthereum, IconShoppingCartPlus } from '@tabler/icons';
import Link from 'next/link';
import { useContract } from '../../hooks/useContract';
import {useEffect, useState} from "react";
import {showNotification} from "@mantine/notifications";
import { Revise } from "revise-sdk";
import { collectionId } from '../../constants';
import { useAccount } from 'wagmi';

const useStyles = createStyles((theme) => ({
	card: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
	},

	footer: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
		borderTop: `1px solid ${
			theme.colorScheme === 'dark'
				? theme.colors.dark[5]
				: theme.colors.gray[2]
		}`,
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		lineHeight: 1,
	},
}));

interface CardWithStatsProps {
	image: string;
	title: string;
	description: string;
	stats: {
		title: string;
		value: string;
	}[];
}

export function CourseCard(props: any) {
	const { classes } = useStyles()
	const [loading, setLoading] = useState(false)
	const {getCourse, enroll, getTokenId, setNftId} = useContract()
	const [data, setData] = useState<any>([])
	const {address} = useAccount()
	useEffect(() => {
		const getCourseData = async () => {
			const course = await getCourse(props.id)
			const data = await fetch(`https://${course[1]}.ipfs.nftstorage.link`)
			const json = await data.json()
			setData(json)
		}
		getCourseData()
	}, [props])

	const handleClick = async () => {
		setLoading(true)
		try {
			await enroll(props.id, data.price)
			const tokenId = (await getTokenId(props.id, address!)).toString()
			console.log("token id", tokenId)
			const revise = new Revise({auth: process.env.NEXT_PUBLIC_REVISE_AUTH_TOKEN!});
			console.log("revise", revise)
			const nft = await revise.addNFT(
				{
				  image:
					`https://${data.image}.ipfs.nftstorage.link`,
				  name: data.name,
				  tokenId: tokenId,
				  description: data.shortDescription,
				},
				[{ marks: 0 }],
				collectionId
			);
			console.log("nft", nft)
			await setNftId(props.id, nft.id)
			showNotification({
				title: 'Success',
				message: 'You have successfully enrolled in the course',
			})
			setLoading(false)
		} catch (e) {
			console.log(e)
			showNotification({
				title: 'Error',
				message: 'Something went wrong',
			})
			setLoading(false)
		}
	}

	const etherIcon = (
		<ActionIcon size='xs' color='blue' radius='xl' variant='transparent'>
			<IconCurrencyEthereum color='green' />
		</ActionIcon>
	);

	return (
		<Card withBorder p='lg' className={classes.card} radius='lg'>
			<Card.Section>
				<Image src={`https://${data.image}.ipfs.nftstorage.link`} alt={data.name} height={200} />
			</Card.Section>

			<Group position='apart' mt='xl'>
				<Link href={`/view-course?id=${props.id}`}>
					<Text size='xl' weight={700} className={classes.title}>
						{data.name}
					</Text>
				</Link>
				<Group>
					<Badge size='lg' color='lime' leftSection={etherIcon}>
						Price : {data.price}
					</Badge>
				</Group>
			</Group>
			<Text mt='xl' mb='xl' color='dimmed' size='md'>
				{data.shortDescription}
			</Text>
			<Card.Section>
				<Center>
					<Button
						onClick={async() => await handleClick()}
						disabled={loading}
						variant='subtle'
						color='indigo'
						size='md'
						mt={10}
						leftIcon={<IconShoppingCartPlus />}
						fullWidth
					>
						Enroll in the course
					</Button>
				</Center>
			</Card.Section>
		</Card>
	);
}
