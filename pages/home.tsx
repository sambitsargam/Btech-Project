import { Center, Grid, Title, Group, Button } from '@mantine/core';
import { IconSchool } from '@tabler/icons';
import Link from 'next/link';
import { Layout } from '../components/Layout/Layout';
import { UniversityCard } from '../components/UniversityCard/UniversityCard';
import {useContract} from "../hooks/useContract";
import {useEffect, useState} from "react";
import {useSigner} from "wagmi";

export default function Home() {
	const {totalUniversities} = useContract()
	const {data: signer} = useSigner()

	const [totalUni, setTotalUni] = useState<number>(0)
	const renderUni = Array.from({length: totalUni}, (_, i) => <Grid.Col span={4}><UniversityCard key={i+1} id={i+1} /></Grid.Col>)
	useEffect(() => {
		if (!signer) return
		const getUni = async () => {
			const totalUni = await totalUniversities()
			setTotalUni(totalUni)
		}
		getUni()
	}, [signer])

	return (
		<div>
			<Layout>
				<Center>
					<Title>Universities</Title>
				</Center>

				<Group position='right'>
					{/* <Button variant='outline'>1</Button> */}
					<Link href='/create-university'>
						<Button
							variant='outline'
							color='indigo'
							radius='lg'
							size='md'
							mr={20}
							leftIcon={<IconSchool />}
						>
							Create University
						</Button>
					</Link>
				</Group>
				<Grid mt={10}>
					{renderUni}
				</Grid>
			</Layout>
		</div>
	);
}
