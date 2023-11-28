import { Group, Title, Text, Paper, Grid } from '@mantine/core';
import { IconBook, } from '@tabler/icons';
import { CourseCard } from '../CoursesCard/CoursesCard';
import {useContract} from "../../hooks/useContract";
import {useEffect, useState} from "react";

export function CoursePannel(props: any) {
	console.log("CoursePannel", props)
	const {getCourseIds} = useContract()
	const [data, setData] = useState<any>([])
	useEffect(() => {
		const getCourses = async () => {
			const courseIds = await getCourseIds(props.id)
			const finIds = courseIds.map((id: any) => {
				const cId = id.toString()
				return cId
			})
			console.log("finIds", finIds)
			setData(finIds)
		}
		getCourses()
	}, [props])

	const render = data.map((id: any) => {
		return (
			<Grid.Col key={id} span={4} px={10}>
				<CourseCard id={id} />
			</Grid.Col>
		)
	})

	return (
		<div>
			<Group p='lg'>
				<Text ml={10} mt={32}>
					<IconBook size={32} />
				</Text>
				<Title mt={30}>Courses Offered</Title>
			</Group>
			<Paper shadow='sm' radius='lg' mt={20} p='lg' withBorder>
				<Grid p={10}>
					{render}
				</Grid>
			</Paper>
		</div>
	);
}
