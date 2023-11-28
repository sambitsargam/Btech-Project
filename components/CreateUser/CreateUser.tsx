import {
	Container,
	Grid,
	Paper,
	TextInput,
	Center,
	Title,
	Textarea,
	Button,
	Group,
} from '@mantine/core';
import { ImageInput } from '../ImageInput/ImageInput';
import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { schema } from './Schema';
import { showNotification } from '@mantine/notifications';
import {IconAlertCircle, IconCheck, IconLoader} from '@tabler/icons';
import useNftStorage from "../../hooks/useNftStorage";
import useLens from "../../hooks/useLens";
import {useAccount, useSigner} from "wagmi";
import {useRouter} from "next/router";
import { useContract } from '../../hooks/useContract';

export function CreateUser() {
	const [image, setImage] = useState<File>();
	const {uploadImage,uploadText} = useNftStorage()
	const {addUser} = useContract()
	const {createProfile, profileExists, getProfileId} = useLens()
	const {address} = useAccount()
	const [loading, setLoading] = useState(false);
	const {data: signer} = useSigner()
	const router = useRouter()

	const form = useForm({
		validate: zodResolver(schema),
		validateInputOnChange: true,
		initialValues: {
			username: '',
		},
	});

	const handleSubmit = async () => {
		setLoading(true)
		showNotification({
			title: 'Creating profile',
			message: 'Creating your lens profile',
			color: 'yellow',
			icon: <IconLoader />,
		});

		const exists = await profileExists(form.values.username)
		console.log("exists", exists)
		if(exists){
			showNotification({
				title: 'Error',
				message: 'Username already taken',
				color: 'red',
				icon: <IconAlertCircle />,
			});
			setLoading(false)
			return
		}

		let cid
		if(image){
			cid = await uploadImage(image)
		}
		try{
			const res = await createProfile(form.values.username, address!, signer, `ipfs://${cid}`)
			const profId = res.logs[0].topics[3]
			console.log(`0x${profId.substring(profId.length-4)}`)
			await addUser(`0x${profId.substring(profId.length-4)}`)

			showNotification({
				title: 'Profile created',
				message: 'Your profile has been created',
				color: 'teal',
				icon: <IconCheck />,
			});
			setLoading(false)
		} catch (e){
			console.log(e)
			showNotification({
				title: 'Error',
				message: 'There was an error creating your profile',
				color: 'red',
				icon: <IconAlertCircle />,
			});
			setLoading(false)
		}
	};

	return (
		<Container>
			<Center>
				<Paper
					radius='lg'
					p='lg'
					w={700}
				>
					<Title align='center' mb={10}>
						Edit User Profile
					</Title>
					<Grid justify='center'>
						<Grid.Col span={9}>
							<Title order={4}>
								Username <span style={{ color: 'red' }}>*</span>
							</Title>
							<TextInput
								placeholder='Enter your username'
								required
								{...form.getInputProps('username')}
							/>
						</Grid.Col>

						<Grid.Col span={9}>
							<Title order={4} my={5}>
								Profile Image
							</Title>
							<ImageInput
								width={600}
								height={300}
								onChange={setImage}
								value={image}
							/>
						</Grid.Col>

						<Grid.Col span={9}>
							<Group position='right' mt='lg'>
								<Button
									disabled={loading}
									onClick={() => handleSubmit()}>
									Submit
								</Button>
							</Group>
						</Grid.Col>
					</Grid>
				</Paper>
			</Center>
		</Container>
	);
}
