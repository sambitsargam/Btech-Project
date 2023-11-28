import {
	Card,
	Image,
	Text,
	Group,
	Badge,
	createStyles,
	Center,
	Button,
	Title,
} from '@mantine/core';
import {
	IconBooks,
	IconFileCertificate,
	IconGasStation,
	IconGauge,
	IconManualGearbox,
	IconUsers,
} from '@tabler/icons';
import Link from 'next/link';
import {useContract} from "../../hooks/useContract";
import {useEffect, useState} from "react";

const useStyles = createStyles((theme) => ({
	card: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.white,
	},

	imageSection: {
		padding: theme.spacing.sm,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark'
				? theme.colors.dark[4]
				: theme.colors.gray[3]
		}`,
	},

	label: {
		marginBottom: theme.spacing.xs,
		lineHeight: 1,
		fontWeight: 700,
		fontSize: theme.fontSizes.xs,
		letterSpacing: -0.25,
		textTransform: 'uppercase',
	},

	section: {
		padding: theme.spacing.md,
		borderTop: `1px solid ${
			theme.colorScheme === 'dark'
				? theme.colors.dark[4]
				: theme.colors.gray[3]
		}`,
	},

	icon: {
		marginRight: 5,
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[2]
				: theme.colors.gray[5],
	},
}));


interface UniversityCardProps {
	id: number;
	university_name?: string;
	description?: string;
	image?: string;
}

export function UniversityCard({
	id
}: UniversityCardProps) {
	const { classes } = useStyles();
	const {getUniversity} = useContract()
	const [data, setData] = useState<any>({
		name: "...",
		image: "https://images.unsplash.com/photo-1616161616161-1b1b1b1b1b1b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
		description: "...",
	})
	useEffect(() => {
		const getUni = async () => {
			const uni = await getUniversity(id)
			const data = await fetch(`https://${uni[1]}.ipfs.nftstorage.link`)
			const json = await data.json()
			setData(json)
		}
		getUni()
	}, [id])
	return (
		<Card withBorder radius='md' mt={20} mx={20} className={classes.card}>
			<Card.Section className={classes.imageSection}>
				<Image src={`https://${data.image}.ipfs.nftstorage.link`} alt='University Image' 
        width={200}
        height={200}
        fit="contain" />
			</Card.Section>

			<Group position='apart' my='md'>
				<div>
					<Title weight={500} order={2}>
						{data.name}
					</Title>
					<Text size='md' color='dimmed'>
						{data.description.slice(0, 100)}...
					</Text>
				</div>
			</Group>

			<Card.Section className={classes.section}>
				<Link href={`/university?id=${id}`}>
					<Button
						radius='xl'
						variant='outline'
						style={{ flex: 1 }}
						fullWidth
						color='indigo'
					>
						View University
					</Button>
				</Link>
			</Card.Section>
		</Card>
	);
}
