import { Container } from '@mantine/core';
import Head from 'next/head';
import { CreateCourse } from '../components/CreateCourse/CreateCourse';
import { Layout } from '../components/Layout/Layout';

export default function Home() {
	return (
		<div>
			<Layout>
				<Head>
					<title>Create Project</title>
				</Head>
				<Container size={'xs'}>
					<CreateCourse />
				</Container>
			</Layout>
		</div>
	);
}
