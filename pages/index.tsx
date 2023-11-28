import { Grid } from '@mantine/core';
import { Hero } from '../components/Hero/Hero';
import { Layout } from '../components/Layout/Layout';

export default function Home() {
	return (
		<div>
			<Layout>
				{/* <p>Welcome</p> */}
				<Hero />
			</Layout>
		</div>
	);
}
