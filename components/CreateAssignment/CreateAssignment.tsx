import {
	Paper,
	TextInput,
	Title,
	Text,
	Textarea,
	Center,
	Group,
	Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconFile, IconPaperclip, IconPin, IconUsers } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import useNftStorage from '../../hooks/useNftStorage';

export function CreateAssignment() {
	const {addAssignment} = useContract()
	const [loading, setLoading] = useState(false);
	const form = useForm({
		initialValues: {
			assignmentName: '',
			description: '',
		},
	});

	const router = useRouter()
	const {uploadJson, uploadImage} = useNftStorage()
	
	const onSubmit = async() => {
		setLoading(true)
		showNotification({
			title: 'Creating Assignment',
			message: 'Please wait while we create your assignment',
		})
		try {
			const fileId = await uploadJson({
				name: form.values.assignmentName,
				description: form.values.description
			})
			console.log(fileId)
			const id = router.query.id
			if (typeof id === "string") {
				const res = await addAssignment(parseInt(id), fileId)
				console.log(res)
				showNotification({
					title: 'Assignment Created',
					message: 'Your assignment has been created',
				})
				setLoading(false)
				router.push("/view-course?id="+id)
				console.log('submit');
			}else{
				console.log("course id is not passed in query params")
				showNotification({
					title: 'Error',
					message: 'There was an error creating your assignment',
				})
				setLoading(false)
			}
		} catch (error) {
			console.log(error);
			showNotification({
				title: 'Error',
				message: 'There was an error creating your assignment',
			})
			setLoading(false)
		}
	};

	return (
		<div>
			<Group p='lg'>
				<Text ml={10} mt={32}>
					<IconPaperclip size={32} />
				</Text>
				<Title mt={30}>Create Assignment</Title>
			</Group>
			<Center>
				<Paper
					shadow='sm'
					radius='lg'
					mt={20}
					p='lg'
					withBorder
					w={700}
				>
					<Title my={'sm'} order={4}>
						Assignment Name <span style={{ color: 'red' }}>*</span>
					</Title>
					<TextInput
						placeholder='Assignment Name'
						required
						{...form.getInputProps('assignmentName')}
					/>
					<Title my={'sm'} order={4}>
						Assignment Discription
						<span style={{ color: 'red' }}>*</span>
					</Title>
					<Textarea
						autosize={true}
						minRows={3}
						maxRows={12}
						placeholder='Add your assignment discription'
						{...form.getInputProps('description')}
					/>
					<Button onClick={()=>{onSubmit()}} mt={20}>Submit</Button>
				</Paper>
			</Center>
		</div>
	);
}
